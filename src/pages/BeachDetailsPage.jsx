import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  MapPin,
  Droplet,
  ThermometerSun,
  Wind,
  ArrowLeft,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { communityApi } from "@/services/api";
import {
  formatDate,
  getWaterQualityColor,
  getWaterQualityDescription,
  formatEnterococcusCount,
} from "@/utils/formatters";
import "@/styles/BeachDetails.css";
import { geminiService } from "@/services/geminiService";

// OpenWeatherMap API key
const OPENWEATHER_API_KEY =
  import.meta.env.VITE_OPENWEATHER_API_KEY ||
  "cd605f37629117f007b32d581e8f19af";

// Map update component
function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (map && center && Array.isArray(center) && center.length === 2) {
      map.invalidateSize(true);
      map.setView(center, map.getZoom());
      setTimeout(() => {
        map.invalidateSize(true);
      }, 500);
    }
  }, [center, map]);

  return null;
}
// First, correct the getWaterQualityCategory function
function getWaterQualityCategory(enterococcusCount) {
  if (enterococcusCount === null || enterococcusCount === undefined) {
    return "Unknown";
  }

  // Based on the standards in your PDF
  if (enterococcusCount < 100) {
    return "Excellent";
  } else if (enterococcusCount < 200) {
    return "Good";
  } else if (enterococcusCount < 185) {
    // Note: This overlaps with "Good" category
    return "Sufficient";
  } else {
    return "Poor";
  }
}
// Sample beach description fallbacks when description is missing
const beachDescriptions = {
  "camps-bay":
    "Camps Bay is one of Cape Town's most affluent areas and is situated on the Atlantic Seaboard, at the foot of the Twelve Apostles mountain range and Table Mountain. This beach features pristine white sand and turquoise waters, making it popular with locals and tourists alike.",
  "clifton-4th":
    "Clifton 4th Beach is one of Cape Town's most exclusive beaches, sheltered from the wind by large granite boulders. The beach is known for its white sand, crystal-clear water, and spectacular views of the Twelve Apostles mountain range.",
  llandudno:
    "Llandudno is a small, exclusive beach community on the Atlantic Seaboard of Cape Town. The beach is surrounded by mountains and large granite boulders, making it one of the most picturesque beaches in Cape Town.",
  muizenberg:
    "Muizenberg Beach is famous for its colorful beach huts and is considered the birthplace of surfing in South Africa. The beach is popular for surfing, kiteboarding, and other water sports due to its warm water and gentle waves.",
  "fish-hoek":
    "Fish Hoek Beach is a family-friendly beach located in False Bay. It's known for its safe swimming conditions, warm water, and beautiful white sand. The beach is also popular for whale watching during whale season.",
  bloubergstrand:
    "Bloubergstrand offers one of the most iconic views of Table Mountain across Table Bay. The beach is popular for kitesurfing and windsurfing due to the consistent winds and has a vibrant beachfront with restaurants and cafes.",
  strand:
    "Strand Beach is a long, white sandy beach located in False Bay. It's popular for swimming and surfing, and the warm waters make it a family-friendly destination.",
  "hout-bay":
    "Hout Bay Beach is a picturesque beach located in the coastal suburb of Hout Bay. The beach is surrounded by mountains and has a working harbor nearby, offering fresh seafood and boat trips to Seal Island.",
};

const BeachDetailsPage = () => {
  const { beachName } = useParams();
  const location = useLocation();
  const [beach, setBeach] = useState(null);
  const [isLoadingBeach, setIsLoadingBeach] = useState(true);
  const [beachError, setBeachError] = useState(null);
  const [comment, setComment] = useState("");
  const [communityPosts, setCommunityPosts] = useState([]);
  const [weather, setWeather] = useState(null);
  const mapRef = useRef(null);

  // Extract beach code and coordinates from location state if available
  const beachCode = location.state?.beachCode;
  const coordinates = location.state?.coordinates;

  // Fetch beach data directly from API
  async function getBeachDescription(beachName, location) {
    if (!beachName)
      return "A beautiful Cape Town beach with scenic views and sandy shores.";

    try {
      const description = await geminiService.getBeachDescription(
        beachName,
        location
      );
      return description;
    } catch (error) {
      console.error("Error getting beach description:", error);
      return `${beachName} is one of Cape Town's beautiful beaches offering visitors a chance to enjoy the stunning coastline of South Africa.`;
    }
  }

  // Modify the fetchBeachData function to use the async description:
  const fetchBeachData = useCallback(async () => {
    if (!beachCode) {
      setBeachError("Beach code not provided");
      setIsLoadingBeach(false);
      return;
    }

    try {
      setIsLoadingBeach(true);
      const API_URL =
        import.meta.env.VITE_API_URL ||
        "https://waterqualityapi20250427235311.azurewebsites.net/";
      const response = await axios.get(`${API_URL}/beach/${beachCode}`);

      // Format the data properly
      const beachInfo = getBeachInfoFromCode(beachCode);

      // Get AI-generated description
      const description = await getBeachDescription(
        beachInfo.name,
        beachInfo.location
      );

      const formattedBeach = {
        id: response.data.id,
        code: response.data.beachCode,
        name: beachInfo.name || `Beach ${response.data.beachCode}`,
        location: beachInfo.location || "Cape Town",
        coordinates: beachInfo.coordinates || [-33.9249, 18.4241],
        date_sampled: response.data.samplingDate,
        values: [response.data.enterococcusCount],
        is_safe: response.data.isWithinSafetyThreshold,
        sampling_frequency: response.data.samplingFrequency,
        description: description,
      };

      setBeach(formattedBeach);
      setBeachError(null);
    } catch (error) {
      console.error("Error fetching beach data:", error);
      setBeachError(`Failed to fetch beach data. ${error.message}`);
    } finally {
      setIsLoadingBeach(false);
    }
  }, [beachCode]);

  // Helper function to get beach info based on code
  function getBeachInfoFromCode(code) {
    // Beach info mapping
    const beachInfoMap = {
      // Cape Town Atlantic
      XCN08: {
        name: "Silverstroomstrand Tidal Pool",
        location: "Cape Town North",
        coordinates: [-33.59123333, 18.36005],
      },
      XCN14: {
        name: "Silverstroomstrand Lifeguard Building",
        location: "Cape Town North",
        coordinates: [-33.588165, 18.359023],
      },
      XCN07: {
        name: "Melkbosstrand",
        location: "Cape Town North",
        coordinates: [-33.726691, 18.44006],
      },
      XCN12: {
        name: "Blouberg Big Bay Lifeguard Building",
        location: "Cape Town North",
        coordinates: [-33.7938, 18.45666667],
      },
      CN37: {
        name: "Small Bay",
        location: "Cape Town North",
        coordinates: [-33.79914844, 18.45822252],
      },
      XCN06: {
        name: "Tableview",
        location: "Cape Town North",
        coordinates: [-33.82303333, 18.4761],
      },
      XCN04: {
        name: "Milnerton Lighthouse",
        location: "Cape Town North",
        coordinates: [-33.88135, 18.48665],
      },
      CN22: {
        name: "Lagoon Beach",
        location: "Cape Town North",
        coordinates: [-33.892047, 18.481274],
      },

      // Cape Town Atlantic
      CN04: {
        name: "Mouille Point Beach (Thermopoli)",
        location: "Cape Town Atlantic",
        coordinates: [-33.89918333, 18.40758333],
      },
      CN36: {
        name: "Three Anchor Bay Beach",
        location: "Cape Town Atlantic",
        coordinates: [-33.90611137, 18.39798198],
      },
      CN06C: {
        name: "Rocklands Beach",
        location: "Cape Town Atlantic",
        coordinates: [-33.90851667, 18.39336667],
      },
      CN18I: {
        name: "Milton Beach Tidal Pool Inside",
        location: "Cape Town Atlantic",
        coordinates: [-33.914455, 18.386189],
      },
      CN34: {
        name: "Queen's Beach Tidal Pool",
        location: "Cape Town Atlantic",
        coordinates: [-33.92108985, 18.37869426],
      },
      CN35: {
        name: "Queen's Beach Gully",
        location: "Cape Town Atlantic",
        coordinates: [-33.92135956, 18.37825668],
      },
      CN16O: {
        name: "Saunders Rocks Tidal Pool Outside",
        location: "Cape Town Atlantic",
        coordinates: [-33.924225, 18.377186],
      },
      CN16I: {
        name: "Saunders Rocks Tidal Pool Inside",
        location: "Cape Town Atlantic",
        coordinates: [-33.924335, 18.377048],
      },
      CN42: {
        name: "Clifton Second Beach",
        location: "Cape Town Atlantic",
        coordinates: [-33.937505, 18.376607],
      },
      CN09: {
        name: "Clifton Fourth Beach",
        location: "Cape Town Atlantic",
        coordinates: [-33.940619, 18.374417],
      },
      CN10: {
        name: "Maidens Cove North Sandy Cove",
        location: "Cape Town Atlantic",
        coordinates: [-33.94339361, 18.37227917],
      },
      CN19I: {
        name: "Maidens Cove Tidal Pool West Inside",
        location: "Cape Town Atlantic",
        coordinates: [-33.944889, 18.37335],
      },
      CN20I: {
        name: "Maidens Cove Tidal Pool East Inside",
        location: "Cape Town Atlantic",
        coordinates: [-33.945203, 18.374671],
      },
      CN31: {
        name: "Glen Beach",
        location: "Cape Town Atlantic",
        coordinates: [-33.947056, 18.377192],
      },
      CN30: {
        name: "Camps Bay North",
        location: "Cape Town Atlantic",
        coordinates: [-33.948847, 18.377445],
      },
      CN41: {
        name: "Camps Bay Central",
        location: "Cape Town Atlantic",
        coordinates: [-33.95092422, 18.37711225],
      },
      CN11: {
        name: "Camps Bay South",
        location: "Cape Town Atlantic",
        coordinates: [-33.95262556, 18.37566417],
      },
      CN12A: {
        name: "Camps Bay Tidal Pool Inside",
        location: "Cape Town Atlantic",
        coordinates: [-33.955052, 18.375176],
      },
      CN14: {
        name: "Barley Bay",
        location: "Cape Town Atlantic",
        coordinates: [-33.95765444, 18.37688167],
      },
      CN40: {
        name: "Beta Beach",
        location: "Cape Town Atlantic",
        coordinates: [-33.95956009, 18.37450268],
      },
      CN21: {
        name: "Bakoven Beach",
        location: "Cape Town Atlantic",
        coordinates: [-33.96049972, 18.37306972],
      },
      CN39: {
        name: "Cosy Bay",
        location: "Cape Town Atlantic",
        coordinates: [-33.98211535, 18.36154654],
      },
      XCN09: {
        name: "Oudekraal",
        location: "Cape Town Atlantic",
        coordinates: [-33.987235, 18.34967472],
      },
      XCN03: {
        name: "Llandudno",
        location: "Cape Town Atlantic",
        coordinates: [-34.007816, 18.34031],
      },
      HB13: {
        name: "Hout Bay Mariners Wharf",
        location: "Cape Town Atlantic",
        coordinates: [-34.04741935, 18.34918168],
      },
      XCN10: {
        name: "Hout Bay Chapmans Peak",
        location: "Cape Town Atlantic",
        coordinates: [-34.04781667, 18.3602],
      },
      CS40: {
        name: "Hoek, Noordhoek Beach",
        location: "Cape Town Atlantic",
        coordinates: [-34.09751307, 18.35242828],
      },
      XCN02: {
        name: "Long Beach Kommetjie",
        location: "Cape Town Atlantic",
        coordinates: [-34.13676667, 18.32828889],
      },
      CS39: {
        name: "Inner Kom",
        location: "Cape Town Atlantic",
        coordinates: [-34.144279, 18.318809],
      },
      XCN11: {
        name: "Scarborough Beach",
        location: "Cape Town Atlantic",
        coordinates: [-34.19988722, 18.37188861],
      },

      // False Bay
      CS37: {
        name: "Miller's Point Tidal Pool",
        location: "False Bay",
        coordinates: [-34.231397, 18.476052],
      },
      XCS12: {
        name: "Fishermans Beach",
        location: "False Bay",
        coordinates: [-34.20596667, 18.45838889],
      },
      CS36: {
        name: "Windmill Beach",
        location: "False Bay",
        coordinates: [-34.20104751, 18.45634199],
      },
      XCS32: {
        name: "Boulders Beach",
        location: "False Bay",
        coordinates: [-34.19796667, 18.45221667],
      },
      XCS13: {
        name: "Seaforth Beach",
        location: "False Bay",
        coordinates: [-34.19394444, 18.44663889],
      },
      XCS14: {
        name: "Simons Town Long Beach",
        location: "False Bay",
        coordinates: [-34.18741667, 18.42655556],
      },
      CS38: {
        name: "Glencairn Tidal Pool",
        location: "False Bay",
        coordinates: [-34.162559, 18.432068],
      },
      XCS15: {
        name: "Glencairn Beach",
        location: "False Bay",
        coordinates: [-34.15981667, 18.43218333],
      },
      CS35: {
        name: "Fish Hoek Corner Of The Beach",
        location: "False Bay",
        coordinates: [-34.141276, 18.432959],
      },
      CS41: {
        name: "Fish Hoek Beach Lifesaving Club",
        location: "False Bay",
        coordinates: [-34.1394567, 18.43275173],
      },
      XCS17: {
        name: "Clovelly Beach Silvermine Mouth",
        location: "False Bay",
        coordinates: [-34.13281667, 18.43955],
      },
      CS42: {
        name: "Woolley's Tidal Pool",
        location: "False Bay",
        coordinates: [-34.13273121, 18.44543279],
      },
      CS01A: {
        name: "Kalk Bay Harbour Beach",
        location: "False Bay",
        coordinates: [-34.12875, 18.4483],
      },
      CS02: {
        name: "Kalk Bay Tidal Pool Inside",
        location: "False Bay",
        coordinates: [-34.12638333, 18.4506],
      },
      CS03: {
        name: "Dalebrook Tidal Pool",
        location: "False Bay",
        coordinates: [-34.12403333, 18.45291667],
      },
      CS44: {
        name: "Dangers Beach",
        location: "False Bay",
        coordinates: [-34.12143007, 18.4561023],
      },
      CS04: {
        name: "St James Tidal Pool",
        location: "False Bay",
        coordinates: [-34.118862, 18.459533],
      },
      CS34: {
        name: "Muizenberg Surfers Corner",
        location: "False Bay",
        coordinates: [-34.108983, 18.470834],
      },
      CS16: {
        name: "Muizenberg Pavilion",
        location: "False Bay",
        coordinates: [-34.107968, 18.472645],
      },
      CS07: {
        name: "Sunrise Beach Parking Area",
        location: "False Bay",
        coordinates: [-34.104809, 18.482613],
      },
      CS11: {
        name: "Ribbon Road Parking Area",
        location: "False Bay",
        coordinates: [-34.093636, 18.523396],
      },
      CS17: {
        name: "Strandfontein Tidal Pool",
        location: "False Bay",
        coordinates: [-34.08911667, 18.55351667],
      },
      CS45: {
        name: "Strandfontein Beach",
        location: "False Bay",
        coordinates: [-34.08733837, 18.55744323],
      },
      CS46: {
        name: "Blue Waters Resort",
        location: "False Bay",
        coordinates: [-34.08177896, 18.58049079],
      },
      CS19: {
        name: "Mnandi Beach",
        location: "False Bay",
        coordinates: [-34.075324, 18.622209],
      },
      XCS18: {
        name: "Monwabisi Tidal Pool",
        location: "False Bay",
        coordinates: [-34.07313333, 18.68863333],
      },
      XCS30: {
        name: "Monwabisi Beach",
        location: "False Bay",
        coordinates: [-34.07284056, 18.68996667],
      },
      XCS19: {
        name: "Macassar Beach",
        location: "False Bay",
        coordinates: [-34.078065, 18.749314],
      },

      // False Bay East
      XCS34: {
        name: "Strand Pipe Surfing",
        location: "False Bay East",
        coordinates: [-34.10333837, 18.81328622],
      },
      XCS26: {
        name: "Strand Lifesaving Club",
        location: "False Bay East",
        coordinates: [-34.10616667, 18.81753333],
      },
      XCS29: {
        name: "Strand Harmonie Park Jetty",
        location: "False Bay East",
        coordinates: [-34.13991145, 18.84579525],
      },
      XCS05: {
        name: "Gordons Bay East Beach",
        location: "False Bay East",
        coordinates: [-34.160632, 18.86756667],
      },
      CS29: {
        name: "Gordons Bay Milkwoods",
        location: "False Bay East",
        coordinates: [-34.161691, 18.865056],
      },
      XCS08: {
        name: "Gordons Bay Bikini Beach",
        location: "False Bay East",
        coordinates: [-34.16555, 18.85868333],
      },
      XCS09: {
        name: "Kogel Bay Beach",
        location: "False Bay East",
        coordinates: [-34.236774, 18.85032],
      },
    };

    return (
      beachInfoMap[code] || {
        name: `Beach ${code}`,
        location: "Cape Town",
        coordinates: coordinates || [-33.9249, 18.4241], // Use passed coordinates or default
      }
    );
  }

  // Helper function to get beach description
  async function getBeachDescription(beachName, location) {
    if (!beachName)
      return "A beautiful Cape Town beach with scenic views and sandy shores.";

    try {
      const description = await geminiService.getBeachDescription(
        beachName,
        location
      );
      return description;
    } catch (error) {
      console.error("Error getting beach description:", error);
      return `${beachName} is one of Cape Town's beautiful beaches offering visitors a chance to enjoy the stunning coastline of South Africa.`;
    }
  }

  // Fetch weather data
  const fetchWeatherData = useCallback(async () => {
    if (!beach?.coordinates) return;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${beach.coordinates[0]}&lon=${beach.coordinates[1]}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, [beach?.coordinates]);

  // Fetch community posts
  const fetchCommunityPosts = useCallback(async () => {
    if (!beachCode) return;

    try {
      const response = await communityApi.getPostsByBeach(beachCode);

      // Transform backend data to match frontend expectations
      const transformedPosts = response.data.map((post) => ({
        post_id: post.id,
        author: "Anonymous", // Default since your backend doesn't have author/nickname yet
        content: post.content,
        created_at:
          post.createdAt || post.created_at || new Date().toISOString(),
      }));

      setCommunityPosts(transformedPosts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      setCommunityPosts([]);
    }
  }, [beachCode]);

  // Initial data loading - fetch beach data directly
  useEffect(() => {
    fetchBeachData();
  }, [fetchBeachData]);

  // Then load weather and community posts once we have the beach data
  useEffect(() => {
    if (beach) {
      fetchWeatherData();
      fetchCommunityPosts();
    }
  }, [beach, fetchWeatherData, fetchCommunityPosts]);

  // Map size updates
  useEffect(() => {
    if (mapRef.current) {
      const resizeMap = () => {
        if (mapRef.current) {
          mapRef.current.invalidateSize(true);
        }
      };
      setTimeout(resizeMap, 100);
      setTimeout(resizeMap, 500);
      setTimeout(resizeMap, 1000);
    }

    const weatherInterval = setInterval(fetchWeatherData, 600000);

    window.addEventListener("resize", () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize(true);
      }
    });

    return () => {
      clearInterval(weatherInterval);
      window.removeEventListener("resize", () => {});
    };
  }, [fetchWeatherData]);

  // Handle community post submission
  // Handle community post submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      // Use the beachCode from your state instead of beachName
      await communityApi.createPost({
        beachCode: beachCode, // This is the important change
        content: comment,
      });

      setComment("");
      // Optionally refresh posts after submission
      // fetchCommunityPosts();
      alert("Your post has been submitted for moderation.");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    }
  };

  // Custom map marker icon
  const customIcon = L.icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  if (isLoadingBeach) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-blue-800">
            Loading beach information...
          </h2>
        </div>
      </div>
    );
  }

  if (beachError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Error Loading Beach Information
          </h2>
          <p className="text-gray-700 mb-4">{beachError}</p>
          <Link
            to="/"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!beach) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Beach Not Found
          </h2>
          <p className="text-gray-700 mb-4">
            The requested beach could not be found.
          </p>
          <Link
            to="/"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Map is_safe to waterQuality string
  // Calculate safety status
  const safetyStatus =
    beach.is_safe === 1 ? "Safe" : beach.is_safe === 0 ? "Unsafe" : "Unknown";

  // Determine water quality category based on enterococcus count
  const waterQualityCategory = getWaterQualityCategory(
    beach.values && beach.values.length > 0 ? beach.values[0] : null
  );

  return (
    <div className="beach-details">
      <header className="beach-header">
        <div className="container">
          <Link
            to="/"
            className="back-button"
            style={{
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              marginBottom: "12px",
            }}
          >
            <ArrowLeft size={18} style={{ color: "white" }} />
            <span style={{ color: "white", fontWeight: "600" }}>
              Back to Home
            </span>
          </Link>
          <h1 className="beach-title">{beach.name}</h1>
        </div>
      </header>

      <main className="beach-content">
        <div className="container">
          <div className="map-wrapper">
            {beach.coordinates &&
              Array.isArray(beach.coordinates) &&
              beach.coordinates.length === 2 && (
                <MapContainer
                  center={beach.coordinates}
                  zoom={13}
                  className="map-container"
                  ref={mapRef}
                  whenCreated={(map) => {
                    setTimeout(() => {
                      map.invalidateSize();
                    }, 400);
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={beach.coordinates} icon={customIcon}>
                    <Popup>
                      <strong>{beach.name}</strong>
                      <br />
                      {weather && (
                        <>
                          Temperature: {Math.round(weather.main.temp)}°C
                          <br />
                          Wind: {Math.round(weather.wind.speed * 3.6)} km/h
                        </>
                      )}
                    </Popup>
                  </Marker>
                  <MapUpdater center={beach.coordinates} />
                </MapContainer>
              )}
          </div>

          <div className="info-grid">
            <div className="info-card location">
              <MapPin className="info-icon" />
              <div>
                <h3>Location</h3>
                <p>{beach.location}</p>
              </div>
            </div>

            {/* Water Quality Card - shows Excellent, Good, etc. */}
            <div className="info-card water-quality">
              <Droplet className="info-icon" />
              <div>
                <h3>Water Quality</h3>
                <p>{waterQualityCategory}</p>
              </div>
            </div>

            {/* Status Card - shows Safe/Unsafe */}
            <div
              className={`info-card status ${
                safetyStatus === "Safe"
                  ? "safe"
                  : safetyStatus === "Unsafe"
                  ? "unsafe"
                  : ""
              }`}
            >
              <div className="info-icon">{/* Add appropriate icon */}</div>
              <div>
                <h3>Status</h3>
                <p>{safetyStatus}</p>
              </div>
            </div>

            {/* Weather cards */}
            {weather && (
              <>
                <div className="info-card temperature">
                  <ThermometerSun className="info-icon" />
                  <div>
                    <h3>Temperature</h3>
                    <p>{Math.round(weather.main.temp)}°C</p>
                  </div>
                </div>

                <div className="info-card wind">
                  <Wind className="info-icon" />
                  <div>
                    <h3>Wind</h3>
                    <p>{Math.round(weather.wind.speed * 3.6)} km/h</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="content-grid">
            <section className="content-card water-quality-details">
              <h2 className="section-title">
                <Droplet className="section-icon" />
                Water Quality Information
              </h2>
              <div className="quality-content">
                <div className="quality-meta">
                  <div className="quality-item">
                    <h4>Last sampled</h4>
                    <p>
                      {beach.date_sampled
                        ? formatDate(beach.date_sampled)
                        : "Unknown"}
                    </p>
                  </div>
                  <div className="quality-item">
                    <h4>Status</h4>
                    <p
                      className={`quality-status ${getWaterQualityColor(
                        safetyStatus
                      )}`}
                    >
                      {safetyStatus}
                    </p>
                  </div>
                  <div className="quality-item">
                    <h4>Category</h4>
                    <p
                      className={`quality-status ${getWaterQualityColor(
                        waterQualityCategory
                      )}`}
                    >
                      {waterQualityCategory}
                    </p>
                  </div>
                </div>

                <p className="quality-description">
                  {getWaterQualityDescription(safetyStatus)}
                </p>

                {beach.values && beach.values.length > 0 && (
                  <div className="measurements">
                    <h3>Recent Measurements</h3>
                    <ul className="measurements-list">
                      {beach.values.map((value, index) => (
                        <li key={index} className="measurement-item">
                          <span className="measurement-label">
                            Enterococcus Count
                          </span>
                          <span className="measurement-value">
                            {formatEnterococcusCount(value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-gray-600">
                      <strong>Sampling Frequency:</strong>{" "}
                      {beach.sampling_frequency || "Weekly"}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="content-card description">
              <h2 className="section-title">
                <MapPin className="section-icon" />
                About This Beach
              </h2>
              <p className="description-text">{beach.description}</p>
            </section>

            <section className="content-card community">
              <h2 className="section-title">
                <MessageSquare className="section-icon" />
                Community Posts
              </h2>

              <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                  className="comment-input"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience at this beach..."
                  required
                ></textarea>
                <button type="submit" className="submit-button">
                  Submit Post
                </button>
              </form>

              <div className="posts-container">
                {communityPosts.length === 0 ? (
                  <p className="no-posts">
                    No approved posts yet. Be the first to share your
                    experience!
                  </p>
                ) : (
                  communityPosts.map((post) => (
                    <div key={post.post_id} className="post">
                      <div className="post-header">
                        <span className="post-author">
                          {post.author || "Anonymous"}
                        </span>
                        <span className="post-date">
                          <Calendar size={14} />
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      <p className="post-content">{post.content}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BeachDetailsPage;

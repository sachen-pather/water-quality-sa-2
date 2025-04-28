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
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { communityApi } from "@/services/api";
import useBeachData from "@/hooks/useBeachData"; // Import the hook
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

// Function to get water quality category based on enterococcus count
function getWaterQualityCategory(enterococcusCount) {
  if (enterococcusCount === null || enterococcusCount === undefined) {
    return "Unknown";
  }

  // Based on the standards
  if (enterococcusCount < 100) {
    return "Excellent";
  } else if (enterococcusCount < 200) {
    return "Good";
  } else if (enterococcusCount < 185) {
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
  const [comment, setComment] = useState("");
  const [communityPosts, setCommunityPosts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [beachDescription, setBeachDescription] = useState("");
  const mapRef = useRef(null);

  // Extract beach code from location state if available
  const beachCode = location.state?.beachCode;

  // Use the useBeachData hook to fetch beach data
  const {
    selectedBeach: beach,
    isLoading: isLoadingBeach,
    error: beachError,
    fetchBeachByName,
  } = useBeachData(beachName);

  // Fetch beach description using AI service
  const getBeachDescription = useCallback(async (beachName, location) => {
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
      // Try to use a predefined description
      const formattedName = beachName.toLowerCase().replace(/\s+/g, "-");
      return (
        beachDescriptions[formattedName] ||
        `${beachName} is one of Cape Town's beautiful beaches offering visitors a chance to enjoy the stunning coastline of South Africa.`
      );
    }
  }, []);

  // Fetch beach description once we have beach data
  useEffect(() => {
    if (beach) {
      getBeachDescription(beach.name, beach.location).then((description) => {
        setBeachDescription(description);
      });
    }
  }, [beach, getBeachDescription]);

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
    if (!beachCode && !beach?.code) return;

    const codeToUse = beachCode || beach.code;

    try {
      const response = await communityApi.getPostsByBeach(codeToUse);

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
  }, [beachCode, beach?.code]);

  // Initial fetch - the hook will handle fetching the beach data
  useEffect(() => {
    if (beachName && !beach) {
      fetchBeachByName(beachName);
    }
  }, [beachName, beach, fetchBeachByName]);

  // Fetch weather and community posts once we have the beach data
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
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      // Use the beachCode from your beach data or the location state
      const codeToUse = beachCode || (beach && beach.code);

      if (!codeToUse) {
        alert("Unable to submit post: Beach code not found");
        return;
      }

      await communityApi.createPost({
        beachCode: codeToUse,
        content: comment,
      });

      setComment("");
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-500 to-blue-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white">
            Loading beach information...
          </h2>
        </div>
      </div>
    );
  }

  if (beachError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-500 to-blue-700">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Error Loading Beach Information
          </h2>
          <p className="text-gray-700 mb-4">{beachError}</p>
          <Link
            to="/"
            className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-4 py-2 rounded-full hover:opacity-90 transition-colors shadow-md"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!beach) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-500 to-blue-700">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Beach Not Found
          </h2>
          <p className="text-gray-700 mb-4">
            The requested beach could not be found.
          </p>
          <Link
            to="/"
            className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-4 py-2 rounded-full hover:opacity-90 transition-colors shadow-md"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate safety status
  const safetyStatus =
    beach.is_safe === 1 || beach.is_safe === true
      ? "Safe"
      : beach.is_safe === 0 || beach.is_safe === false
      ? "Unsafe"
      : "Unknown";

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
            className="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium transition-colors bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-md"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
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
              <p className="description-text">{beachDescription}</p>
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

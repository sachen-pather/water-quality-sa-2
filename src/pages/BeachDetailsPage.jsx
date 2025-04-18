import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { MapPin, Droplet, ThermometerSun, Wind } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { beachesApi, communityApi } from "@/services/api";
import {
  formatDate,
  getWaterQualityColor,
  getWaterQualityDescription,
  urlToBeachName,
} from "@/utils/formatters";
import "@/styles/BeachDetails.css";

// OpenWeatherMap API key - in production, this should be an environment variable
const OPENWEATHER_API_KEY =
  import.meta.env.VITE_OPENWEATHER_API_KEY ||
  "cd605f37629117f007b32d581e8f19af";

// Map update component to set the view when coordinates change
function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      // Force map to update its size and redraw
      map.invalidateSize(true);
      map.setView(center, map.getZoom());

      // Additional fix for delayed rendering
      setTimeout(() => {
        map.invalidateSize(true);
      }, 500);
    }
  }, [center, map]);

  return null;
}

const BeachDetailsPage = () => {
  const { beachName } = useParams();
  const location = useLocation();
  const { coordinates } = location.state || {
    coordinates: [-34.1126, 18.4662],
  }; // Default to Cape Town area
  const [comment, setComment] = useState("");
  const [communityPosts, setCommunityPosts] = useState([]);
  const [beachData, setBeachData] = useState({
    name: urlToBeachName(beachName),
    location: "Cape Town, South Africa",
    waterQuality: "Unknown",
    values: [],
    date_sampled: null,
    description: "Loading beach information...",
    coordinates: coordinates,
  });
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  // Fetch beach data
  const fetchBeachData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await beachesApi.getBeachByName(beachName);
      setBeachData((prev) => ({
        ...prev,
        ...response.data,
        coordinates,
        waterQuality: response.data.is_safe,
      }));
      setError(null);
    } catch (error) {
      console.error("Error fetching beach data:", error);
      setError("Failed to load beach information. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [beachName, coordinates]);

  // Fetch weather data
  const fetchWeatherData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // We don't set the main error state for weather failures
    }
  }, [coordinates]);

  // Fetch community posts
  const fetchCommunityPosts = useCallback(async () => {
    try {
      const response = await communityApi.getPostsByBeach(beachName);
      setCommunityPosts(response.data);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      // We don't set the main error state for community post failures
    }
  }, [beachName]);

  // Initial data loading
  useEffect(() => {
    fetchBeachData();
    fetchCommunityPosts();
    fetchWeatherData();

    // Force map resize after component is fully rendered
    if (mapRef.current) {
      const resizeMap = () => {
        if (mapRef.current) {
          mapRef.current.invalidateSize(true);
        }
      };

      // Try multiple times with increasing delays
      setTimeout(resizeMap, 100);
      setTimeout(resizeMap, 500);
      setTimeout(resizeMap, 1000);
    }

    // Update weather every 10 minutes
    const weatherInterval = setInterval(fetchWeatherData, 600000);

    // Add window resize event listener
    window.addEventListener("resize", () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize(true);
      }
    });

    return () => {
      clearInterval(weatherInterval);
      window.removeEventListener("resize", () => {});
    };
  }, [fetchBeachData, fetchCommunityPosts, fetchWeatherData]);

  // Ensure map is properly sized
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [mapRef]);

  // Handle community post submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await communityApi.createPost({
        beachName: beachName,
        content: comment,
      });
      setComment("");
      alert("Your post has been submitted for moderation.");
      // No need to refetch posts since it needs approval first
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

  // Handle loading states
  if (isLoading) {
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

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Error Loading Beach Information
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
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

  return (
    <div className="beach-details">
      <header className="beach-details__header">
        <Link to="/" className="beach-details__back-button">
          ← Back to Home
        </Link>
        <h1 className="beach-details__title">{beachData.name}</h1>
      </header>

      <main className="beach-details__content">
        <div className="beach-details__map-container">
          <MapContainer
            center={coordinates}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
            whenCreated={(map) => {
              // Store map instance and trigger resize after creation
              setTimeout(() => {
                map.invalidateSize();
              }, 400);
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={coordinates} icon={customIcon}>
              <Popup>
                <strong>{beachData.name}</strong>
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
            <MapUpdater center={coordinates} />
          </MapContainer>
        </div>

        <div className="beach-details__info">
          <div className="beach-details__info-item">
            <MapPin className="beach-details__info-icon" />
            <span>{beachData.location}</span>
          </div>
          <div className="beach-details__info-item">
            <Droplet className="beach-details__info-icon" />
            <span>
              Water Quality:{" "}
              {beachData.waterQuality === true
                ? "Safe"
                : beachData.waterQuality === false
                ? "Unsafe"
                : beachData.waterQuality}
            </span>
          </div>
          {weather && (
            <>
              <div className="beach-details__info-item">
                <ThermometerSun className="beach-details__info-icon" />
                <span>Temperature: {Math.round(weather.main.temp)}°C</span>
              </div>
              <div className="beach-details__info-item">
                <Wind className="beach-details__info-icon" />
                <span>Wind: {Math.round(weather.wind.speed * 3.6)} km/h</span>
              </div>
            </>
          )}
        </div>

        <div className="beach-details__water-quality">
          <h2 className="beach-details__section-title">
            Water Quality Information
          </h2>
          <p>
            Last sampled:{" "}
            {beachData.date_sampled
              ? formatDate(beachData.date_sampled)
              : "Unknown"}
          </p>
          <p>
            Status:{" "}
            <span className={getWaterQualityColor(beachData.waterQuality)}>
              {beachData.waterQuality === true
                ? "Safe"
                : beachData.waterQuality === false
                ? "Unsafe"
                : beachData.waterQuality || "Unknown"}
            </span>
          </p>
          <p>{getWaterQualityDescription(beachData.waterQuality)}</p>
          {beachData.values && beachData.values.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Recent Measurements:
              </h3>
              <ul className="list-disc pl-5">
                {beachData.values.map((value, index) => (
                  <li key={index} className="mb-1">
                    Sample {index + 1}: {value} cfu/100ml
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="beach-details__description">
          <h2 className="beach-details__description-title">Description</h2>
          <p>{beachData.description}</p>
        </div>

        <div className="beach-details__community">
          <h2 className="beach-details__community-title">Community Posts</h2>
          <form
            onSubmit={handleCommentSubmit}
            className="beach-details__comment-form"
          >
            <textarea
              className="beach-details__comment-input"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience at this beach..."
              required
            ></textarea>
            <button type="submit" className="beach-details__submit-button">
              Submit Post
            </button>
          </form>

          <div className="beach-details__posts">
            {communityPosts.length === 0 ? (
              <p>
                No approved posts yet. Be the first to share your experience!
              </p>
            ) : (
              communityPosts.map((post) => (
                <div key={post.post_id} className="beach-details__post">
                  <div className="post-header">
                    <span className="post-author">
                      {post.author || "Anonymous"}
                    </span>
                    <span className="post-date">
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <p className="post-content">{post.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BeachDetailsPage;

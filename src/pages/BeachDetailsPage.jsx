"use client";

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
      <header className="beach-header">
        <div className="container">
          <Link to="/" className="back-button">
            <ArrowLeft size={18} color="white" />
            <span>Back to Home</span>
          </Link>
          <h1 className="beach-title">{beachData.name}</h1>
        </div>
      </header>

      <main className="beach-content">
        <div className="container">
          <div className="map-wrapper">
            <MapContainer
              center={coordinates}
              zoom={13}
              className="map-container"
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

          <div className="info-grid">
            <div className="info-card location">
              <MapPin className="info-icon" />
              <div>
                <h3>Location</h3>
                <p>{beachData.location}</p>
              </div>
            </div>

            <div
              className={`info-card water-quality ${
                beachData.waterQuality === true
                  ? "safe"
                  : beachData.waterQuality === false
                  ? "unsafe"
                  : ""
              }`}
            >
              <Droplet className="info-icon" />
              <div>
                <h3>Water Quality</h3>
                <p>
                  {beachData.waterQuality === true
                    ? "Safe"
                    : beachData.waterQuality === false
                    ? "Unsafe"
                    : beachData.waterQuality}
                </p>
              </div>
            </div>

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
                      {beachData.date_sampled
                        ? formatDate(beachData.date_sampled)
                        : "Unknown"}
                    </p>
                  </div>
                  <div className="quality-item">
                    <h4>Status</h4>
                    <p
                      className={`quality-status ${getWaterQualityColor(
                        beachData.waterQuality
                      )}`}
                    >
                      {beachData.waterQuality === true
                        ? "Safe"
                        : beachData.waterQuality === false
                        ? "Unsafe"
                        : beachData.waterQuality || "Unknown"}
                    </p>
                  </div>
                </div>

                <p className="quality-description">
                  {getWaterQualityDescription(beachData.waterQuality)}
                </p>

                {beachData.values && beachData.values.length > 0 && (
                  <div className="measurements">
                    <h3>Recent Measurements</h3>
                    <ul className="measurements-list">
                      {beachData.values.map((value, index) => (
                        <li key={index} className="measurement-item">
                          <span className="measurement-label">
                            Sample {index + 1}
                          </span>
                          <span className="measurement-value">
                            {value} cfu/100ml
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            <section className="content-card description">
              <h2 className="section-title">
                <MapPin className="section-icon" />
                About This Beach
              </h2>
              <p className="description-text">{beachData.description}</p>
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

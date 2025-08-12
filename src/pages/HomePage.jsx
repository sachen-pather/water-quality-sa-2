"use client";

import { useCallback, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Ensure Leaflet CSS is imported
import { Search } from "lucide-react";
import BeachCard from "@/components/BeachCard";
import Header from "@/components/Header";
import useBeachData from "@/hooks/useBeachData";
import { formatDate, formatEnterococcusCount } from "@/utils/formatters";

// Create safety-based marker icons
const safeIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const cautionIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const unsafeIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Function to determine icon based on enterococcus count
const getMarkerIcon = (beach) => {
  const safetyStatus = getSafetyStatus(beach);

  switch (safetyStatus) {
    case "Safe":
      return safeIcon; // Green
    case "Caution":
      return cautionIcon; // Yellow
    case "Unsafe":
      return unsafeIcon; // Red
    default:
      return defaultIcon; // Blue
  }
};

// Function to get safety status text
const getSafetyStatus = (beach) => {
  if (!beach.values || beach.values.length === 0 || beach.values[0] == null) {
    return "Unknown";
  }

  // Convert to number and handle potential string values
  const ecoliCount = parseFloat(beach.values[0]);

  // Check if conversion resulted in a valid number
  if (isNaN(ecoliCount)) {
    console.warn(
      `Invalid enterococcus count for beach ${beach.name}:`,
      beach.values[0]
    );
    return "Unknown";
  }

  if (ecoliCount < 250) {
    return "Safe"; // Green
  } else if (ecoliCount >= 250 && ecoliCount <= 500) {
    return "Caution"; // Yellow
  } else if (ecoliCount > 500) {
    return "Unsafe"; // Red
  } else {
    return "Unknown";
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredBeaches, setFilteredBeaches] = useState([]);
  const { beaches, isLoading, error } = useBeachData();

  // When beach data loads, set it as the initial filtered beaches
  useEffect(() => {
    if (beaches && beaches.length > 0) {
      console.log("Beaches loaded:", beaches);
      setFilteredBeaches(beaches);
    }
  }, [beaches]);

  const handleBeachSelection = useCallback(
    (beach) => {
      // 1. Check for the new urlName property
      if (!beach || !beach.urlName) {
        console.error("Invalid beach selected:", beach);
        return;
      }

      // 2. Navigate using the consistent urlName.
      //    We also remove the `state` object because it's unreliable on page refresh.
      //    Your BeachDetailsPage should only rely on the URL parameter.
      navigate(`/beach/${beach.urlName}`);
    },
    [navigate]
  );

  const handleSearchInput = useCallback(
    (e) => {
      const input = e.target.value.toLowerCase();
      setSearchInput(input);

      if (input.trim().length > 0 && beaches && beaches.length > 0) {
        const filtered = beaches.filter(
          (beach) =>
            (beach.name && beach.name.toLowerCase().includes(input)) ||
            (beach.location && beach.location.toLowerCase().includes(input))
        );
        setSearchResults(filtered.slice(0, 5)); // Limit to 5 results for dropdown
        setFilteredBeaches(filtered); // Update filtered beaches for cards
      } else {
        setSearchResults([]);
        setFilteredBeaches(beaches || []); // Reset to all beaches when search is empty
      }
    },
    [beaches]
  );

  return (
    <div className="min-h-screen">
      {/* Header component */}
      <Header title="SeaClear" />

      {/* Main content with gradient background */}
      <div className="bg-gradient-to-b from-blue-800 to-cyan-500">
        {/* Hero Section */}
        <div className="pt-12 pb-10">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Find Your Perfect Beach
            </h1>
            <p className="text-xl text-white mb-8">
              Discover Cape Town's beautiful beaches and check their water
              quality.
            </p>
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for beaches..."
                  value={searchInput}
                  onChange={handleSearchInput}
                  className="w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-600">
                  <Search size={20} />
                </button>
              </div>
              {searchResults.length > 0 && (
                <ul className="bg-white mt-2 rounded-lg shadow-lg z-10 relative border border-cyan-100">
                  {searchResults.map((result, index) => (
                    <li
                      key={`search-result-${result.id || result.code || index}`}
                      onClick={() => handleBeachSelection(result)}
                      className="p-3 hover:bg-cyan-50 cursor-pointer text-cyan-900 border-b border-cyan-100 last:border-b-0"
                    >
                      {result.name}, {result.location}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Map and Beach List Section */}
        <div className="container mx-auto px-6 pb-12">
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Beaches in Cape Town
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-white text-sm">Safe</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span className="text-white text-sm">Caution</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-white text-sm">Unsafe</span>
                </div>
              </div>
            </div>
            <div className="w-full h-96 rounded-xl overflow-hidden shadow-xl border-4 border-white">
              {!isLoading && filteredBeaches.length > 0 && (
                <MapContainer
                  center={[-33.9249, 18.4241]} // Default Cape Town coordinates
                  zoom={10}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {filteredBeaches.map((beach) => {
                    // Safety check for valid coordinates
                    if (
                      !beach.coordinates ||
                      !Array.isArray(beach.coordinates) ||
                      beach.coordinates.length !== 2 ||
                      beach.coordinates[0] === undefined ||
                      beach.coordinates[1] === undefined
                    ) {
                      console.warn(
                        `Beach ${beach.name} (${beach.code}) has invalid coordinates:`,
                        beach.coordinates
                      );
                      return null;
                    }

                    // Determine marker icon based on safety
                    const markerIcon = getMarkerIcon(beach);
                    const safetyStatus = getSafetyStatus(beach);

                    return (
                      <Marker
                        key={`marker-${beach.id || beach.code}`}
                        position={beach.coordinates}
                        icon={markerIcon}
                        eventHandlers={{
                          mouseover: (e) => {
                            e.target.openPopup();
                          },
                          mouseout: (e) => {
                            e.target.closePopup();
                          },
                          click: () => {
                            handleBeachSelection(beach);
                          },
                        }}
                      >
                        <Popup>
                          <div className="font-medium">{beach.name}</div>
                          <div className="text-sm">{beach.location}</div>
                          <div className="text-sm">
                            Status:{" "}
                            <span
                              className={
                                safetyStatus === "Safe"
                                  ? "text-green-600 font-semibold"
                                  : safetyStatus === "Caution"
                                  ? "text-yellow-600 font-semibold"
                                  : safetyStatus === "Unsafe"
                                  ? "text-red-600 font-semibold"
                                  : ""
                              }
                            >
                              {safetyStatus}
                            </span>
                          </div>
                          <div className="text-sm">
                            Last Sampled: {formatDate(beach.date_sampled)}
                          </div>
                          <div className="text-sm">
                            E. coli:{" "}
                            {formatEnterococcusCount(
                              beach.values && beach.values.length > 0
                                ? beach.values[0]
                                : null
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              )}
              {isLoading && (
                <div className="w-full h-full flex items-center justify-center bg-blue-300 bg-opacity-50">
                  <div className="text-white text-xl font-semibold animate-pulse">
                    Loading map data...
                  </div>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-white text-xl animate-pulse">
              Loading beach data...
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-300 text-xl">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBeaches.map((beach) => (
                <BeachCard
                  key={`beach-card-${beach.id || beach.code}`}
                  beach={beach}
                  onSelect={handleBeachSelection}
                  waterQuality={getSafetyStatus(beach)}
                  lastSampled={formatDate(beach.date_sampled)}
                  enterococcusCount={formatEnterococcusCount(
                    beach.values && beach.values.length > 0
                      ? beach.values[0]
                      : null
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold">SeaClear</h3>
            <p className="text-blue-100">Sachen Pather - 0812354879</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

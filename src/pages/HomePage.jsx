import { useCallback, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Search } from "lucide-react";
import BeachCard from "@/components/BeachCard";
import Header from "@/components/Header";
import useBeachData from "@/hooks/useBeachData";
import { beachNameToUrl } from "@/utils/formatters";
import { beachLocationsData } from "@/services/mockData";

// Custom icon for Leaflet markers
const beachIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const HomePage = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredBeaches, setFilteredBeaches] = useState(beachLocationsData);
  const { beaches, isLoading, error } = useBeachData();

  // When beach data loads, merge it with location data
  useEffect(() => {
    if (beaches && beaches.length > 0) {
      setFilteredBeaches(beaches);
    }
  }, [beaches]);

  const handleBeachSelection = useCallback(
    (beach) => {
      const beachNameForUrl = beachNameToUrl(beach.name);
      navigate(`/beach/${beachNameForUrl}`, {
        state: { coordinates: [beach.lat, beach.lng] },
      });
    },
    [navigate]
  );

  const handleSearchInput = useCallback(
    (e) => {
      const input = e.target.value.toLowerCase();
      setSearchInput(input);

      if (input.trim().length > 0) {
        const filtered = filteredBeaches.filter(
          (beach) =>
            beach.name.toLowerCase().includes(input) ||
            (beach.address && beach.address.toLowerCase().includes(input))
        );
        setSearchResults(filtered.slice(0, 5)); // Limit to 5 results for dropdown
        setFilteredBeaches(filtered); // Update filtered beaches for cards
      } else {
        setSearchResults([]);
        setFilteredBeaches(beaches.length > 0 ? beaches : beachLocationsData); // Reset to all beaches when search is empty
      }
    },
    [beaches, filteredBeaches]
  );

  return (
    <div className="min-h-screen">
      {/* Only the Header component */}
      <Header title="SeaClear" />

      {/* Main content with gradient background */}
      <div className="bg-gradient-to-b from-blue-400 to-blue-600">
        {/* Hero Section */}
        <div className="pt-10 pb-8">
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
                  className="w-full px-4 py-2 rounded-full focus:outline-none"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                  <Search size={20} />
                </button>
              </div>
              {searchResults.length > 0 && (
                <ul className="bg-white mt-2 rounded-lg shadow-md z-10 relative">
                  {searchResults.map((result, index) => (
                    <li
                      key={`result-${index}`}
                      onClick={() => handleBeachSelection(result)}
                      className="p-2 hover:bg-blue-100 cursor-pointer text-blue-900"
                    >
                      {result.name}, {result.address}
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
            </div>
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <MapContainer
                center={[-33.9249, 18.4241]}
                zoom={10}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredBeaches.map((beach) => (
                  <Marker
                    key={beach.name}
                    position={[beach.lat, beach.lng]}
                    icon={beachIcon}
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
                      <div className="text-sm">{beach.address}</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-white">Loading beach data...</div>
          ) : error ? (
            <div className="text-center text-red-300">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBeaches.map((beach, index) => (
                <BeachCard
                  key={index}
                  beach={beach}
                  onSelect={handleBeachSelection}
                  waterQuality={beach.is_safe}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-blue-800 text-white py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">SeaClear</h3>
              <p className="text-blue-200">Keeping beaches safe</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/education" className="text-blue-200 hover:text-white">
                Learn More
              </Link>
              <Link to="/community" className="text-blue-200 hover:text-white">
                Community
              </Link>
              <Link to="/login" className="text-blue-200 hover:text-white">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

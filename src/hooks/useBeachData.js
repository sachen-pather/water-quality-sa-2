import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Updated mapping of BeachCode to user-friendly names, location and coordinates
const beachCodeToInfo = {
  // Cape Town North
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

// For codes not in our mapping, create a generic one
const getDefaultBeachInfo = (code) => {
  // Basic location guess based on code prefix
  let location = "Cape Town";
  if (code.startsWith("XCN")) location = "Cape Town Atlantic";
  else if (code.startsWith("CN")) location = "Cape Town City";
  else if (code.startsWith("XCS") || code.startsWith("CS"))
    location = "South Coast";

  return {
    name: `Beach ${code}`,
    location: location,
    coordinates: [-33.9249, 18.4241], // Default Cape Town coordinates
  };
};

// Create URL-friendly names
const createUrlNameMapping = () => {
  const mapping = {};
  Object.entries(beachCodeToInfo).forEach(([code, info]) => {
    const urlName = info.name.toLowerCase().replace(/\s+/g, "-");
    mapping[urlName] = code;
  });
  return mapping;
};

const urlNameToBeachCodeMapping = createUrlNameMapping();

// Utility function to transform API data to frontend format
const transformBeachData = (apiBeach) => {
  const beachInfo =
    beachCodeToInfo[apiBeach.beachCode] ||
    getDefaultBeachInfo(apiBeach.beachCode);

  return {
    id: apiBeach.id,
    code: apiBeach.beachCode,
    name: beachInfo.name,
    location: beachInfo.location,
    coordinates: beachInfo.coordinates,
    date_sampled: apiBeach.samplingDate,
    values: [apiBeach.enterococcusCount],
    is_safe: apiBeach.isWithinSafetyThreshold,
    sampling_frequency: apiBeach.samplingFrequency,
  };
};

const useBeachData = (beachUrlName = null) => {
  const [beaches, setBeaches] = useState([]);
  const [selectedBeach, setSelectedBeach] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert URL-friendly name to BeachCode
  const getBeachCode = useCallback((urlName) => {
    if (!urlName) return null;
    return urlNameToBeachCodeMapping[urlName.toLowerCase()] || urlName;
  }, []);

  // Fetch all beaches
  const fetchAllBeaches = useCallback(async () => {
    try {
      setIsLoading(true);
      // Use the actual API URL from your environment or default to localhost
      const API_URL =
        import.meta.env.VITE_API_URL ||
        "https://waterqualityapi20250427235311.azurewebsites.net/";
      console.log("API URL from hook:", API_URL); // Add this line for debugging
      const response = await axios.get(`${API_URL}/beach`);

      // Transform the API response to match the format expected by the frontend
      const transformedBeaches = response.data.map(transformBeachData);

      setBeaches(transformedBeaches);
      setError(null);
    } catch (err) {
      console.error("Error fetching beaches:", err);
      setError("Failed to load beach data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch specific beach by name
  const fetchBeachByName = useCallback(
    async (urlName) => {
      if (!urlName) return;

      try {
        setIsLoading(true);
        const beachCode = getBeachCode(urlName);

        if (!beachCode) {
          setError(`Could not find beach with name: ${urlName}`);
          setIsLoading(false);
          return;
        }

        const API_URL =
          import.meta.env.VITE_API_URL ||
          "https://waterqualityapi20250427235311.azurewebsites.net/";
        const response = await axios.get(`${API_URL}/beach/${beachCode}`);

        // Transform the single beach data
        const transformedBeach = transformBeachData(response.data);
        setSelectedBeach(transformedBeach);
        setError(null);
      } catch (err) {
        console.error(`Error fetching beach ${urlName}:`, err);
        setError(
          `Failed to fetch data for ${urlName}. Please try again later.`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [getBeachCode]
  );

  // Initial fetch based on provided beach name
  useEffect(() => {
    if (beachUrlName) {
      fetchBeachByName(beachUrlName);
    } else {
      fetchAllBeaches();
    }
  }, [beachUrlName, fetchBeachByName, fetchAllBeaches]);

  return {
    beaches,
    selectedBeach,
    isLoading,
    error,
    fetchAllBeaches,
    fetchBeachByName,
  };
};

export default useBeachData;

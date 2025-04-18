import { useState, useEffect, useCallback } from "react";
import { beachesApi } from "@/services/api";
import { beachLocationsData } from "@/services/mockData";

export const useBeachData = (beachName = null) => {
  const [beaches, setBeaches] = useState([]);
  const [selectedBeach, setSelectedBeach] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all beaches
  const fetchAllBeaches = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await beachesApi.getAllBeaches();

      // Combine beach data with location data
      const beachesWithLocations = response.data.map((beach) => {
        const locationData =
          beachLocationsData.find(
            (loc) => loc.name.toLowerCase() === beach.name.toLowerCase()
          ) || {};

        return {
          ...beach,
          ...locationData,
        };
      });

      setBeaches(beachesWithLocations);
      setError(null);
    } catch (err) {
      console.error("Error fetching beaches:", err);
      setError("Failed to fetch beaches data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch specific beach by name
  const fetchBeachByName = useCallback(async (name) => {
    if (!name) return;

    try {
      setIsLoading(true);
      const response = await beachesApi.getBeachByName(name);

      // Find location data for this beach
      const locationData =
        beachLocationsData.find(
          (loc) => loc.name.toLowerCase() === response.data.name.toLowerCase()
        ) || {};

      // Combine beach data with location data
      const beachWithLocation = {
        ...response.data,
        ...locationData,
      };

      setSelectedBeach(beachWithLocation);
      setError(null);
    } catch (err) {
      console.error(`Error fetching beach ${name}:`, err);
      setError(`Failed to fetch data for ${name}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch based on provided beach name
  useEffect(() => {
    if (beachName) {
      fetchBeachByName(beachName);
    } else {
      fetchAllBeaches();
    }
  }, [beachName, fetchBeachByName, fetchAllBeaches]);

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

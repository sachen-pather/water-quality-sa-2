import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7111";

export const beachService = {
  getAllBeaches: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/BeachManagement`);
      return response;
    } catch (error) {
      console.error("Error fetching beaches:", error);
      throw error;
    }
  },

  getBeachByCode: async (beachCode) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/BeachManagement/${beachCode}`
      );
      return response;
    } catch (error) {
      console.error(`Error fetching beach with code ${beachCode}:`, error);
      throw error;
    }
  },

  updateBeachReading: async (beachCode, readingData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/BeachManagement/${beachCode}`,
        readingData
      );
      return response;
    } catch (error) {
      console.error(
        `Error updating beach reading with code ${beachCode}:`,
        error
      );
      throw error;
    }
  },
};

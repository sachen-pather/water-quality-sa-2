// src/services/geminiService.js
import axios from "axios";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const geminiService = {
  getBeachDescription: async (beachName, location) => {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Please provide a detailed description of ${beachName} beach located in ${location}. Include information about its characteristics, notable features, and what visitors can expect. Keep the description between 50 - 80 words.`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract the generated text from the response based on the actual structure
      const description = response.data.candidates[0].content.parts[0].text;
      return description;
    } catch (error) {
      console.error("Error fetching beach description from Gemini:", error);
      // Return a default description if the API call fails
      return `${beachName} is one of Cape Town's beautiful beaches offering visitors a chance to enjoy the stunning coastline of South Africa.`;
    }
  },
}; //

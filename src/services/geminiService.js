import axios from "axios";

const PRIMARY_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const FALLBACK_API_KEY = "AIzaSyCZgvS6GFPnkB01aLzYjPDj3K6JgayqK8k";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const geminiService = {
  getBeachDescription: async (beachName, location) => {
    // Try with primary API key first
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${PRIMARY_API_KEY}`,
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

      const description = response.data.candidates[0].content.parts[0].text;
      return description;
    } catch (primaryError) {
      console.warn(
        "Primary API key failed, attempting with fallback key:",
        primaryError.message
      );

      // Try with fallback API key
      try {
        const fallbackResponse = await axios.post(
          `${GEMINI_API_URL}?key=${FALLBACK_API_KEY}`,
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

        const description =
          fallbackResponse.data.candidates[0].content.parts[0].text;
        return description;
      } catch (fallbackError) {
        console.error("Both API keys failed:", fallbackError);
        // Return default description if both API calls fail
        return `${beachName} is one of Cape Town's beautiful beaches offering visitors a chance to enjoy the stunning coastline of South Africa.`;
      }
    }
  },
};

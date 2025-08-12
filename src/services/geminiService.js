import axios from "axios";

const PRIMARY_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const FALLBACK_API_KEY = "AIzaSyCZgvS6GFPnkB01aLzYjPDj3K6JgayqK8k";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const geminiService = {
  getBeachDescription: async (beachName, location) => {
    // Your existing beach description code stays the same
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
        return `${beachName} is one of Cape Town's beautiful beaches offering visitors a chance to enjoy the stunning coastline of South Africa.`;
      }
    }
  },

  // Simple moderation function - returns true to approve, false to reject
  shouldApprovePost: async (content, beachName) => {
    const moderationPrompt = `
You are moderating a post for ${beachName} beach in Cape Town. 

Post content: "${content}"

Should this post be APPROVED or REJECTED?

APPROVE if it contains:
- Beach experiences, conditions, or observations
- Helpful information about the beach
- Questions about beach activities
- Constructive feedback

REJECT if it contains:
- Hate speech, spam, inappropriate content
- Content unrelated to beaches
- Offensive language

Respond with only: APPROVE or REJECT
`;

    try {
      const response = await this.makeGeminiRequest(moderationPrompt);
      const decision = response.data.candidates[0].content.parts[0].text
        .trim()
        .toUpperCase();

      return decision === "APPROVE";
    } catch (error) {
      console.error("Moderation failed:", error);
      // If AI fails, reject by default for safety
      return false;
    }
  },

  // Helper function with fallback API key
  makeGeminiRequest: async (prompt) => {
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${PRIMARY_API_KEY}`,
        requestBody,
        { headers }
      );
      return response;
    } catch (primaryError) {
      console.warn("Primary API key failed, trying fallback");
      const fallbackResponse = await axios.post(
        `${GEMINI_API_URL}?key=${FALLBACK_API_KEY}`,
        requestBody,
        { headers }
      );
      return fallbackResponse;
    }
  },
};

import axios from "axios";

// API Configuration
const GEMINI_PRIMARY_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_FALLBACK_API_KEY = "AIzaSyCZgvS6GFPnkB01aLzYjPDj3K6JgayqK8k";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// URLs
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Get Gemini API key with fallback
const getGeminiApiKey = () => {
  if (
    GEMINI_PRIMARY_API_KEY &&
    GEMINI_PRIMARY_API_KEY !== "undefined" &&
    GEMINI_PRIMARY_API_KEY.trim() !== ""
  ) {
    return GEMINI_PRIMARY_API_KEY;
  }
  console.warn("Primary Gemini API key not found, using fallback key");
  return GEMINI_FALLBACK_API_KEY;
};

// Rate limiting for Gemini (keep this for moderation only)
let lastRequestTime = 0;
let requestCount = 0;
let rateLimitResetTime = 0;
const MIN_REQUEST_INTERVAL = 3000; // 3 seconds between requests
const MAX_REQUESTS_PER_MINUTE = 10;

const isRateLimited = () => {
  const now = Date.now();
  if (now - rateLimitResetTime > 60000) {
    requestCount = 0;
    rateLimitResetTime = now;
  }
  return requestCount >= MAX_REQUESTS_PER_MINUTE;
};

const waitForRateLimit = async () => {
  if (isRateLimited()) {
    throw new Error("RATE_LIMITED");
  }

  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();
  requestCount++;
};

export const geminiService = {
  // NEW: Beach description using Groq (much more reliable)
  getBeachDescription: async (beachName, location) => {
    // Check if Groq API key is available
    if (!GROQ_API_KEY) {
      console.warn(
        "Groq API key not found, falling back to static description"
      );
      return `${beachName} is one of Cape Town's beautiful beaches offering visitors a chance to enjoy the stunning coastline of South Africa.`;
    }

    try {
      const systemPrompt = `You are a Cape Town beach expert. Provide a detailed, engaging description of the requested beach.

Guidelines:
- Keep description between 50-80 words
- Include unique characteristics and features
- Mention what visitors can expect
- Use an informative but engaging tone
- Focus on factual details about the beach`;

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Please provide a detailed description of ${beachName} beach located in ${location}. Include information about its characteristics, notable features, and what visitors can expect.`,
            },
          ],
          max_tokens: 120,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Beach description error:", error.message);
      // Fallback to static description
      return `${beachName} is one of Cape Town's beautiful beaches offering visitors a chance to enjoy the stunning coastline of South Africa.`;
    }
  },

  // Keep moderation with Gemini (less frequently used)
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
      await waitForRateLimit();
      const response = await this.makeGeminiRequest(moderationPrompt);
      const decision = response.data.candidates[0].content.parts[0].text
        .trim()
        .toUpperCase();

      return decision === "APPROVE";
    } catch (error) {
      console.error("Moderation failed:", error);
      // If AI fails, approve by default for better user experience
      return true;
    }
  },

  // Remove the old beachChatbot function since we're using Groq directly in the component

  // Keep Gemini helper for moderation only
  makeGeminiRequest: async (prompt, options = {}) => {
    await waitForRateLimit();

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
        ...options.generationConfig,
      },
      ...options,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const apiKey = getGeminiApiKey();

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
        requestBody,
        {
          headers,
          timeout: 10000,
        }
      );
      return response;
    } catch (error) {
      console.error(
        "Gemini request failed:",
        error.response?.status,
        error.message
      );
      throw error;
    }
  },

  // Utility function to check API status
  checkApiKeyStatus: async () => {
    const results = {
      groq: { status: "unknown" },
      gemini: { status: "unknown" },
    };

    // Test Groq
    if (GROQ_API_KEY) {
      try {
        const response = await fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 10,
          }),
        });

        results.groq.status = response.ok ? "working" : "failed";
      } catch (error) {
        results.groq.status = "failed";
        results.groq.error = error.message;
      }
    } else {
      results.groq.status = "no_key";
    }

    // Test Gemini
    try {
      const apiKey = getGeminiApiKey();
      await axios.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: "Hello" }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      results.gemini.status = "working";
      results.gemini.key =
        apiKey === GEMINI_PRIMARY_API_KEY ? "primary" : "fallback";
    } catch (error) {
      results.gemini.status = "failed";
      results.gemini.error = error.response?.status || error.message;
    }

    return results;
  },
};

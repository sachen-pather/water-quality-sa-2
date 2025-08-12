import axios from "axios";

// API Configuration with better fallback handling
const PRIMARY_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const FALLBACK_API_KEY = "AIzaSyCZgvS6GFPnkB01aLzYjPDj3K6JgayqK8k";

// Use fallback if primary is not set
const getApiKey = () => {
  if (
    PRIMARY_API_KEY &&
    PRIMARY_API_KEY !== "undefined" &&
    PRIMARY_API_KEY.trim() !== ""
  ) {
    return PRIMARY_API_KEY;
  }
  console.warn("Primary API key not found, using fallback key");
  return FALLBACK_API_KEY;
};

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Rate limiting to prevent 429 errors
let lastRequestTime = 0;
let requestCount = 0;
let rateLimitResetTime = 0;
const MIN_REQUEST_INTERVAL = 1500; // 1.5 seconds between requests
const MAX_REQUESTS_PER_MINUTE = 15; // Reduced from potential higher limits

const isRateLimited = () => {
  const now = Date.now();

  // Reset counter every minute
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
    console.log(`Rate limiting: waiting ${waitTime}ms`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();
  requestCount++;
};

export const geminiService = {
  getBeachDescription: async (beachName, location) => {
    try {
      await waitForRateLimit();

      const apiKey = getApiKey();
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
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
          timeout: 10000, // 10 second timeout
        }
      );

      const description = response.data.candidates[0].content.parts[0].text;
      return description;
    } catch (error) {
      console.error("Beach description error:", error.message);
      return `${beachName} is one of Cape Town's beautiful beaches offering visitors a chance to enjoy the stunning coastline of South Africa.`;
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
      await waitForRateLimit();
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

  // Simplified chatbot function with better error handling
  beachChatbot: async (userMessage, conversationHistory = []) => {
    try {
      // Check for rate limiting first
      await waitForRateLimit();
    } catch (error) {
      if (error.message === "RATE_LIMITED") {
        // Provide immediate helpful response without API call
        return getOfflineResponse(userMessage);
      }
      throw error;
    }

    // Simplified system prompt to reduce token usage
    const systemPrompt = `You are SeaClear AI, a Cape Town beach safety expert. 

KEY INFO:
- Safe: E. coli < 250 cfu/100ml
- Caution: E. coli 250-500 cfu/100ml  
- Unsafe: E. coli > 500 cfu/100ml

BEACHES:
- Camps Bay: Popular, mountain views
- Clifton: Exclusive, clear water
- Muizenberg: Surfing, family-friendly
- Fish Hoek: Safe swimming, warm water
- Bloubergstrand: Kitesurfing, Table Mountain views

Keep responses under 100 words. Be friendly and safety-focused. Use emojis.`;

    try {
      const apiKey = getApiKey();

      // Simplified conversation structure to reduce API load
      const contents = [];

      // Add system context
      contents.push({
        role: "user",
        parts: [{ text: systemPrompt }],
      });

      contents.push({
        role: "model",
        parts: [
          { text: "I'm SeaClear AI, ready to help with beach safety! 🌊" },
        ],
      });

      // Add only recent conversation (last 4 messages to reduce token usage)
      if (conversationHistory.length > 0) {
        const recentHistory = conversationHistory.slice(-4);
        recentHistory.forEach((msg) => {
          contents.push({
            role: msg.role,
            parts: [{ text: msg.text }],
          });
        });
      }

      // Add current user message
      contents.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      const requestBody = {
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 150, // Reduced token limit
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      };

      console.log(
        "Making chatbot request with API key:",
        apiKey ? "✓ Available" : "✗ Missing"
      );

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000, // 15 second timeout
        }
      );

      if (
        response.data.candidates &&
        response.data.candidates[0] &&
        response.data.candidates[0].content
      ) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(
        "Chatbot API Error:",
        error.response?.status,
        error.message
      );

      // Smart fallback responses based on error type and user message
      if (error.response?.status === 429) {
        return getOfflineResponse(userMessage);
      } else if (error.response?.status === 400) {
        return "There's a technical issue with my connection. For current beach safety info, please check the live water quality data on our app! 💧";
      }

      // Return offline response for any API error
      return getOfflineResponse(userMessage);
    }
  },

  // Simplified helper function
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
        maxOutputTokens: 200,
        ...options.generationConfig,
      },
      ...options,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const apiKey = getApiKey();

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

  // Utility function to check API key status
  checkApiKeyStatus: async () => {
    try {
      const apiKey = getApiKey();
      const testPrompt = "Hello";

      await axios.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: testPrompt }],
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

      return {
        status: "working",
        key: apiKey === PRIMARY_API_KEY ? "primary" : "fallback",
        apiKey: apiKey ? "Available" : "Missing",
      };
    } catch (error) {
      return {
        status: "failed",
        error: error.response?.status || error.message,
        apiKey: getApiKey() ? "Available" : "Missing",
      };
    }
  },
};

// Offline response function for when API is rate limited or unavailable
const getOfflineResponse = (userMessage) => {
  const message = userMessage.toLowerCase();

  // E. coli / Water quality questions
  if (
    message.includes("coli") ||
    message.includes("water quality") ||
    message.includes("levels")
  ) {
    return "E. coli levels show how safe the water is for swimming. Safe levels are below 250 cfu/100ml, which appear as green markers on our map. Yellow markers show caution levels between 250-500 cfu/100ml, and red markers indicate unsafe levels above 500 cfu/100ml. You can check the live data in our app to see current conditions at any Cape Town beach! 🌊";
  }

  // Safety questions
  if (message.includes("safe") || message.includes("swim")) {
    return "To stay safe while swimming, always check the current water quality before entering the water. Look for green markers which mean it's safe to swim, yellow markers that suggest using caution, and red markers where you should avoid swimming. Our app displays live E. coli levels for all Cape Town beaches, so you can make informed decisions about where to swim today! 🏊‍♂️";
  }

  // Beach recommendations
  if (
    message.includes("beach") &&
    (message.includes("best") || message.includes("recommend"))
  ) {
    return "Cape Town has some amazing beaches to choose from! Camps Bay is really popular with stunning mountain views, Muizenberg is perfect for surfing with its colorful beach huts, Fish Hoek is great for families with warm water and lifeguards, Clifton offers exclusive vibes with crystal clear water, and Bloubergstrand is fantastic for kitesurfing with incredible Table Mountain views. Just remember to check the current water quality for whichever beach you choose! 🏖️";
  }

  // Family beach questions
  if (
    message.includes("family") ||
    message.includes("kids") ||
    message.includes("children")
  ) {
    return "For families with kids, I'd definitely recommend Fish Hoek Beach. It's known for safe swimming conditions, warm water, and has shark spotters for extra safety. Muizenberg is also great for families because it has gentle waves perfect for learning to surf, plus those famous colorful beach huts kids love. Camps Bay is popular too with good facilities nearby. Just make sure to check the current water quality ratings before your visit! 👨‍👩‍👧‍👦";
  }

  // Rip current questions
  if (
    message.includes("rip") ||
    message.includes("current") ||
    message.includes("dangerous")
  ) {
    return "Rip currents can be dangerous, so it's important to know how to spot them. Look for channels of churning, choppy water, lines of foam or debris moving away from the shore, or areas where the water looks different in color. If you ever get caught in one, don't try to swim directly back to shore against it. Instead, swim parallel to the beach until you're out of the current, then swim back to shore. Always try to swim near lifeguards when possible! 🌊";
  }

  // Weather/conditions
  if (
    message.includes("weather") ||
    message.includes("wind") ||
    message.includes("conditions")
  ) {
    return "Weather definitely affects beach safety! Strong winds can create rough seas and dangerous conditions. Recent rainfall often leads to poor water quality because of runoff. Hot weather can also increase bacteria levels in the water. That's why it's important to check both the weather forecast and current water quality before heading to the beach. Our app shows the latest conditions to help you plan your visit safely! 🌤️";
  }

  // Specific beach questions
  if (message.includes("camps bay")) {
    return "Camps Bay is one of Cape Town's most iconic beaches! It's famous for its stunning white sand and incredible views of the Twelve Apostles mountains. It gets quite busy, especially during summer, and has a vibrant atmosphere with lots of restaurants and cafes nearby. The water can be quite cold since it's on the Atlantic side, but it's absolutely beautiful. Just make sure to check the current water quality in our app before taking a dip! 🏖️";
  }

  if (message.includes("muizenberg")) {
    return "Muizenberg Beach is such a special place! It's known as the birthplace of surfing in South Africa and those colorful beach huts are absolutely iconic. The water is warmer than the Atlantic beaches, making it more comfortable for swimming and surfing. It's perfect for beginners learning to surf because of the gentle waves. The whole area has a really relaxed, artistic vibe. Always check our app for current water quality before getting in the water though! 🏄‍♂️";
  }

  if (message.includes("clifton")) {
    return "Clifton is definitely the premium beach experience in Cape Town! There are actually four separate beaches called 1st through 4th Beach, each with its own character. They're known for crystal clear water, white sand, and those massive granite boulders that provide shelter from the wind. It tends to attract a more upscale crowd and can get quite busy. The water is cold but incredibly clear. Check our app for current water quality at whichever Clifton beach you're planning to visit! 💎";
  }

  // Conservation/environment
  if (
    message.includes("pollution") ||
    message.includes("environment") ||
    message.includes("protect")
  ) {
    return "Protecting our beautiful beaches is so important! You can help by always picking up your litter and maybe even some extra pieces you find. Use reef-safe sunscreen to protect marine life, avoid feeding seagulls or other wildlife, and report any pollution you notice. Many organizations run beach cleanup events that are great to join. Every small action helps keep Cape Town's coastline pristine for everyone to enjoy! 🌍";
  }

  // General greeting
  if (
    message.includes("hi") ||
    message.includes("hello") ||
    message.includes("hey")
  ) {
    return "Hello there! I'm your SeaClear beach safety assistant and I'm here to help you enjoy Cape Town's beaches safely. I can tell you about water quality, recommend beaches for different activities, share safety tips, and give you info about specific beaches. What would you like to know? Don't forget to check our live beach data for the most current conditions! 👋";
  }

  // Default response
  if (
    message.includes("more") ||
    message.includes("tell me") ||
    message.includes("explain")
  ) {
    return "I'd love to help you learn more about beach safety! I can explain how we measure water quality using E. coli levels, recommend the best beaches for different activities like surfing or family outings, share important safety tips like how to spot rip currents, or tell you about specific Cape Town beaches and what makes each one special. What particular aspect interests you most? And remember, our app has live data showing current conditions at all the beaches! 🌊";
  }

  // Fallback
  return "I'm here to help with anything related to beach safety and Cape Town's beautiful coastline! Whether you want to know about water quality, need beach recommendations, want safety tips, or have questions about specific beaches, just ask away. For the most up-to-date conditions, always check the live data in our app before heading out. What would you like to know? 🏖️";
};

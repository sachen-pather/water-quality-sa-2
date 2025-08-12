import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  HelpCircle,
  AlertCircle,
  Zap,
} from "lucide-react";

const SeaClearChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [errorCount, setErrorCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Groq API configuration
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

  // Debug: Log API key status (remove this after testing)
  console.log("Environment variables:", {
    hasGroqKey: !!GROQ_API_KEY,
    keyLength: GROQ_API_KEY?.length || 0,
    allEnvVars: import.meta.env,
  });

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: "Hi! I'm your SeaClear beach safety assistant 🌊 I can help you understand water quality, beach safety, and Cape Town beaches. What would you like to know?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Update conversation history for Groq (OpenAI format)
  useEffect(() => {
    if (messages.length > 0) {
      const history = messages
        .filter((msg) => msg.sender !== "system" && msg.sender !== "error")
        .slice(-8) // Keep last 8 messages for context
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));
      setConversationHistory(history);
    }
  }, [messages]);

  // Call Groq API
  const callGroqAPI = async (userMessage) => {
    // Check if API key is available with fallback
    if (!GROQ_API_KEY) {
      console.error("Groq API key missing. Environment vars:", import.meta.env);
      throw new Error("Groq API key not configured. Please contact support.");
    }

    const systemPrompt = `You are SeaClear AI, a Cape Town beach safety expert specializing in:
Do not use any words in bold or all caps or styled. Specifically do not use asterisks in responses. Keep responses relatively short unless necessary.

WATER QUALITY KNOWLEDGE:
- Safe: Enterococcus < 250 cfu/100ml (Green markers)
- Caution: Enterococcus 250-500 cfu/100ml (Yellow markers)  
- Unsafe: Enterococcus > 500 cfu/100ml (Red markers)

CAPE TOWN BEACHES:
- Camps Bay: Popular, mountain views, Atlantic side
- Clifton: Exclusive, 4 beaches, granite boulders
- Muizenberg: Surfing, colorful huts, False Bay
- Fish Hoek: Family-friendly, warm water, safe
- Bloubergstrand: Kitesurfing, Table Mountain views

BEACH SAFETY:
- Rip current identification and escape techniques
- Sun protection and reef-safe sunscreen
- Swimming near lifeguards
- Weather impact on conditions

ADMIN:
- Admins can upload and parse document from the City of Cape Town, try the feature by logging in with demo credentials.
- State how the backend uses pdf parsing in C# to extract beach data from municipal reports.
- State that the admin can edit beach details and manage user comments.
- state that the admin can use AI to auto moderate comments.
Keep responses conversational, under 150 words, safety-focused, and use relevant emojis. Always remind users to check live data in the app.`;

    try {
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage },
      ];

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: messages,
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Groq API Error:", error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message
    const newUserMessage = {
      id: Date.now(),
      sender: "user",
      text: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Use Groq API instead of Gemini
      const aiResponse = await callGroqAPI(userMessage);

      // Add AI response
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Reset error count on successful response
      setErrorCount(0);
      setIsRateLimited(false);
    } catch (error) {
      console.error("Chat error:", error);

      const newErrorCount = errorCount + 1;
      setErrorCount(newErrorCount);

      let errorMessage =
        "I'm having trouble connecting right now. Please check our app for current beach conditions! 🔄";

      // Handle specific error types
      if (error.response?.status === 429 || error.message === "RATE_LIMITED") {
        setIsRateLimited(true);
        errorMessage =
          "I'm getting lots of questions right now! 😅 Please wait a moment and try again. 🌊";

        // Reset rate limit after 30 seconds
        setTimeout(() => {
          setIsRateLimited(false);
        }, 30000);
      } else if (error.response?.status === 400) {
        errorMessage =
          "There's a technical issue. For current beach info, check the live data on our app! 💧";
      } else if (newErrorCount >= 3) {
        errorMessage =
          "I'm having connection issues. Please check our live beach data directly! 🌊";
      }

      const errorMsg = {
        id: Date.now() + 1,
        sender: "error",
        text: errorMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading && !isRateLimited) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What do Enterococcus levels mean?",
    "What does the admin do?",
    "Best beach for families?",
    "How to spot rip currents?",
    "What causes poor water quality?",
    "Tell me about Camps Bay",
  ];

  const handleSuggestedQuestion = (question) => {
    if (!isRateLimited && !isLoading) {
      setInputMessage(question);
    }
  };

  // Get status indicator
  const getStatusIndicator = () => {
    if (isRateLimited) {
      return (
        <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full flex items-center justify-center">
          <AlertCircle size={8} className="mr-1" />
          <span className="hidden sm:inline">Rate limited - please wait</span>
          <span className="sm:hidden">Please wait</span>
        </span>
      );
    } else if (errorCount >= 2) {
      return (
        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full flex items-center justify-center">
          <AlertCircle size={8} className="mr-1" />
          <span className="hidden sm:inline">Connection issues</span>
          <span className="sm:hidden">Issues</span>
        </span>
      );
    } else {
      return (
        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center justify-center">
          <Zap size={8} className="mr-1" />
          <span className="hidden sm:inline">Groq AI • Fast & Reliable</span>
          <span className="sm:hidden">Groq AI</span>
        </span>
      );
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          aria-label="Open beach safety chat"
        >
          <div className="relative">
            <MessageCircle size={24} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            Ask me about beach safety & water quality! 🌊
            <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[calc(100vw-2rem)] max-w-96 h-[85vh] max-h-[500px] sm:w-96 sm:h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-3 sm:p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={12} className="sm:w-4 sm:h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-xs sm:text-sm">
              SeaClear Assistant
            </h3>
            <p className="text-xs text-blue-100 flex items-center">
              <Zap size={8} className="mr-1 sm:w-2.5 sm:h-2.5" />
              <span className="hidden sm:inline">Powered by Groq AI</span>
              <span className="sm:hidden">Groq AI</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors p-1"
        >
          <X size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user"
                    ? "bg-blue-500"
                    : message.sender === "error"
                    ? "bg-red-500"
                    : "bg-cyan-500"
                }`}
              >
                {message.sender === "user" ? (
                  <User size={16} className="text-white" />
                ) : message.sender === "error" ? (
                  <AlertCircle size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-white" />
                )}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : message.sender === "error"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions (show when no conversation or errors) */}
      {(messages.length <= 1 || errorCount >= 2) && !isLoading && (
        <div className="px-3 pb-2 sm:px-4">
          <p className="text-xs text-gray-500 mb-2 flex items-center">
            <HelpCircle size={10} className="mr-1" />
            Try asking:
          </p>
          <div className="grid grid-cols-1 gap-1">
            {suggestedQuestions.slice(0, 3).map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedQuestion(question)}
                disabled={isRateLimited || isLoading}
                className="text-left text-xs p-2 bg-cyan-50 hover:bg-cyan-100 rounded text-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-cyan-200"
              >
                "{question}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isRateLimited
                ? "Please wait before sending..."
                : "Ask about beach safety, water quality..."
            }
            disabled={isLoading || isRateLimited}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim() || isRateLimited}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-lg hover:from-cyan-700 hover:to-blue-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>

        {/* Status indicator */}
        <div className="mt-2 text-center">{getStatusIndicator()}</div>
      </div>
    </div>
  );
};

export default SeaClearChatbot;

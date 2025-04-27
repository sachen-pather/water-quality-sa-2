import axios from "axios";
import {
  beachesData,
  communityPostsData,
  pendingPostsData,
  discussionsData,
  commentsData,
} from "./mockData";

// Simulated delay to mimic network requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API implementation using local data

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7111";

// Helper function to transform beach data
const transformBeachData = (data) => {
  return {
    id: data.Id,
    name: data.BeachCode, // We'll map this to proper names later
    code: data.BeachCode,
    date_sampled: data.SamplingDate,
    values: [data.EnterococcusCount], // Array of readings
    is_safe: data.IsWithinSafetyThreshold === 1, // Convert 1 to true, anything else to false
    sampling_frequency: data.SamplingFrequency,
  };
};

export const beachesApi = {
  getAllBeaches: async () => {
    try {
      const response = await axios.get(`${API_URL}/beach`);
      // Transform each beach record
      const transformedData = response.data.map(transformBeachData);
      return { data: transformedData };
    } catch (error) {
      console.error("Error fetching beaches:", error);
      throw error;
    }
  },

  getBeachByName: async (beachCode) => {
    try {
      const response = await axios.get(`${API_URL}/beach/${beachCode}`);
      // Transform single beach record
      const transformedData = transformBeachData(response.data);
      return { data: transformedData };
    } catch (error) {
      console.error("Error fetching beach:", error);
      throw error;
    }
  },

  // Add new method to get latest readings for a beach
  getBeachReadings: async (beachCode) => {
    try {
      const response = await axios.get(
        `${API_URL}/beach/${beachCode}/readings`
      );
      return {
        data: response.data.map((reading) => ({
          date: reading.SamplingDate,
          value: reading.EnterococcusCount,
          is_safe: reading.IsWithinSafetyThreshold === 1,
        })),
      };
    } catch (error) {
      console.error("Error fetching beach readings:", error);
      throw error;
    }
  },
};

// Community API
// Community API
export const communityApi = {
  getPostsByBeach: async (beachCode) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/Community?beachCode=${beachCode}`
      );
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching posts for beach:", error);
      // Fall back to mock data if API fails
      return { data: [] };
    }
  },

  createPost: async (postData) => {
    try {
      // Make sure the postData has beachCode instead of beachName
      const payload = {
        beachCode: postData.beachCode || postData.beachName, // Handle both formats
        content: postData.content,
      };

      const response = await axios.post(`${API_URL}/api/Community`, payload);
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  getPendingPosts: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/Community/pending`);
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching pending posts:", error);
      // Fall back to mock data if API fails
      return { data: [] };
    }
  },

  approvePost: async (postId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/Community/${postId}/approve`
      );
      return response.data;
    } catch (error) {
      console.error("Error approving post:", error);
      throw error;
    }
  },

  disapprovePost: async (postId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/Community/${postId}/reject`
      );
      return response.data;
    } catch (error) {
      console.error("Error rejecting post:", error);
      throw error;
    }
  },
};
// General Discussions API
// In your api.js file
export const discussionsApi = {
  getAllDiscussions: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/CommunityDiscussion`);
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching discussions:", error);
      throw error;
    }
  },

  getDiscussionById: async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/CommunityDiscussion/${id}`
      );
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching discussion:", error);
      throw error;
    }
  },

  createDiscussion: async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/CommunityDiscussion`,
        data
      );
      return { data: response.data };
    } catch (error) {
      console.error("Error creating discussion:", error);
      throw error;
    }
  },
  getCommentsByDiscussion: async (discussionId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/CommunityDiscussion/${discussionId}/comments`
      );
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  createComment: async (discussionId, comment) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/CommunityDiscussion/${discussionId}/comments`,
        { content: comment }
      );
      return { data: response.data };
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },
};

// Authentication API - Mock version
export const authApi = {
  login: async (credentials) => {
    await delay(1000);
    // Simple mock validation
    if (
      credentials.email === "admin@example.com" &&
      credentials.password === "password"
    ) {
      return {
        data: {
          status: "success",
          user: "Admin User",
        },
      };
    } else {
      throw {
        response: {
          data: {
            message: "Invalid email or password",
          },
        },
      };
    }
  },

  logout: async () => {
    await delay(500);
    return { data: { status: "success" } };
  },

  checkAuth: async () => {
    await delay(500);
    // Check if user is "logged in" based on localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      return {
        data: {
          authenticated: true,
          user: "Admin User",
        },
      };
    } else {
      return {
        data: {
          authenticated: false,
        },
      };
    }
  },
};

export default {
  beachesApi,
  communityApi,
  discussionsApi,
  authApi,
};

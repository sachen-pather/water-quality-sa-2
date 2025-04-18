import {
  beachesData,
  communityPostsData,
  pendingPostsData,
  discussionsData,
  commentsData,
} from "./mockdata";

// Simulated delay to mimic network requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API implementation using local data
export const beachesApi = {
  getAllBeaches: async () => {
    await delay(500); // Simulate network delay
    return { data: beachesData };
  },

  getBeachByName: async (beachName) => {
    await delay(700);
    const formattedName = beachName.replace(/-/g, " ");
    const beach = beachesData.find(
      (b) => b.name.toLowerCase() === formattedName.toLowerCase()
    );

    if (!beach) {
      throw new Error(`Beach not found: ${beachName}`);
    }

    return { data: beach };
  },
};

// Community API
export const communityApi = {
  getPostsByBeach: async (beachName) => {
    await delay(600);
    const posts = communityPostsData[beachName] || [];
    return { data: posts };
  },

  createPost: async (postData) => {
    await delay(800);
    // In a real API this would save the post
    return {
      data: {
        status: "success",
        message: "Post submitted for moderation",
      },
    };
  },

  getPendingPosts: async () => {
    await delay(500);
    return { data: pendingPostsData };
  },

  approvePost: async (postId) => {
    await delay(600);
    // In a real API this would change the post status
    return { data: { status: "success" } };
  },

  disapprovePost: async (postId) => {
    await delay(600);
    // In a real API this would reject/delete the post
    return { data: { status: "success" } };
  },
};

// General Discussions API
export const discussionsApi = {
  getAllDiscussions: async () => {
    await delay(500);
    return { data: discussionsData };
  },

  getDiscussionById: async (id) => {
    await delay(600);
    const discussion = discussionsData.find((d) => d._id === id);
    if (!discussion) {
      throw new Error(`Discussion not found: ${id}`);
    }
    return { data: discussion };
  },

  createDiscussion: async (data) => {
    await delay(700);
    // In a real API this would save the discussion
    const newDiscussion = {
      _id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
    };

    return { data: newDiscussion };
  },

  getCommentsByDiscussion: async (id) => {
    await delay(500);
    const comments = commentsData[id] || [];
    return { data: comments };
  },

  createComment: async (id, data) => {
    await delay(600);
    // In a real API this would save the comment
    const newComment = {
      _id: `c${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    };

    return { data: newComment };
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

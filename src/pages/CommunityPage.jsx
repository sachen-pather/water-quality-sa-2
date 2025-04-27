import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { discussionsApi } from "@/services/api";
import { formatDate } from "@/utils/formatters";
import { MessageSquare, Search, Filter, PlusCircle } from "lucide-react";

const DISCUSSION_CATEGORIES = {
  GENERAL: "General",
  WATER_QUALITY: "Water Quality",
  CRIME: "Crime & Safety",
  SEA_CREATURES: "Sea Creature Sightings",
  BEACH_EXPERIENCES: "Beach Experiences",
  EVENTS: "Beach Events & Cleanups",
  WEATHER: "Weather & Conditions",
  FACILITIES: "Beach Facilities",
  CONSERVATION: "Conservation",
  ACTIVITIES: "Beach Activities",
};

const CommunityPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: DISCUSSION_CATEGORIES.GENERAL,
  });
  const [activeDiscussion, setActiveDiscussion] = useState(null);
  const [comments, setComments] = useState({});
  const [isLoadingComments, setIsLoadingComments] = useState({});

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      setIsLoading(true);
      const response = await discussionsApi.getAllDiscussions();
      setDiscussions(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      setError("Failed to load discussions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async (discussionId) => {
    try {
      setIsLoadingComments((prev) => ({ ...prev, [discussionId]: true }));
      const response = await discussionsApi.getCommentsByDiscussion(
        discussionId
      );
      setComments((prev) => ({ ...prev, [discussionId]: response.data }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments((prev) => ({ ...prev, [discussionId]: false }));
    }
  };

  const handleNewDiscussionChange = (e) => {
    const { name, value } = e.target;
    setNewDiscussion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDiscussion = async () => {
    if (
      newDiscussion.title.trim() === "" ||
      newDiscussion.content.trim() === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await discussionsApi.createDiscussion(newDiscussion);
      setNewDiscussion({
        title: "",
        content: "",
        category: DISCUSSION_CATEGORIES.GENERAL,
      });
      setShowDiscussionForm(false);
      fetchDiscussions();
    } catch (error) {
      console.error("Error creating discussion:", error);
      alert("Failed to create discussion. Please try again.");
    }
  };

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || discussion.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const CommentsSection = ({ discussionId }) => {
    const [commentText, setCommentText] = useState("");
    const discussionComments = comments[discussionId] || [];
    const isLoading = isLoadingComments[discussionId];

    const handleLocalComment = async () => {
      if (!commentText.trim()) {
        alert("Please enter a comment");
        return;
      }

      try {
        const response = await discussionsApi.createComment(
          discussionId,
          commentText
        );
        setComments((prev) => ({
          ...prev,
          [discussionId]: [...(prev[discussionId] || []), response.data],
        }));
        setCommentText("");
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("Failed to add comment. Please try again.");
      }
    };

    return (
      <div className="mt-4 border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-4">Comments</h4>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600 mx-auto"></div>
          </div>
        ) : (
          <>
            {discussionComments.length > 0 ? (
              <div className="space-y-4">
                {discussionComments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700">{comment.content}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No comments yet. Be the first to comment!
              </p>
            )}

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-xl"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleLocalComment();
                  }
                }}
              />
              <button
                className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                onClick={handleLocalComment}
              >
                Post
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-blue-700">
            Loading discussions...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton title="Community" backLink="/" />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Community Discussions
          </h1>
          <p className="text-gray-600">
            Share your beach experiences and join the conversation about water
            quality.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              className="w-full pl-10 p-2 border rounded-xl"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative min-w-[200px]">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              className="w-full pl-10 p-2 border rounded-xl appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {Object.values(DISCUSSION_CATEGORIES).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <button
            className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
            onClick={() => setShowDiscussionForm(!showDiscussionForm)}
          >
            <PlusCircle size={20} />
            {showDiscussionForm ? "Cancel" : "New Discussion"}
          </button>
        </div>

        {showDiscussionForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Start a New Discussion
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                className="w-full p-2 border rounded-xl"
                placeholder="Discussion Title"
                value={newDiscussion.title}
                onChange={handleNewDiscussionChange}
              />
              <textarea
                name="content"
                className="w-full p-2 border rounded-xl h-32"
                placeholder="Discussion Content"
                value={newDiscussion.content}
                onChange={handleNewDiscussionChange}
              />
              <select
                name="category"
                className="w-full p-2 border rounded-xl"
                value={newDiscussion.category}
                onChange={handleNewDiscussionChange}
              >
                {Object.values(DISCUSSION_CATEGORIES).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:opacity-90 transition-opacity"
                onClick={handleAddDiscussion}
              >
                Create Discussion
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mx-auto max-w-2xl mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {filteredDiscussions.map((discussion) => (
            <div
              key={discussion.id}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {discussion.title}
              </h2>
              <p className="text-gray-700 mb-4">{discussion.content}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm">
                  {discussion.category}
                </span>
                <span>{formatDate(discussion.createdAt)}</span>
              </div>

              <button
                className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                onClick={() => {
                  if (activeDiscussion === discussion.id) {
                    setActiveDiscussion(null);
                  } else {
                    setActiveDiscussion(discussion.id);
                    fetchComments(discussion.id);
                  }
                }}
              >
                <MessageSquare size={16} />
                {activeDiscussion === discussion.id
                  ? "Hide Comments"
                  : "Show Comments"}
              </button>

              {activeDiscussion === discussion.id && (
                <CommentsSection discussionId={discussion.id} />
              )}
            </div>
          ))}

          {filteredDiscussions.length === 0 && !error && (
            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== "All"
                  ? "No discussions found matching your criteria."
                  : "No discussions found. Be the first to start a discussion!"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;

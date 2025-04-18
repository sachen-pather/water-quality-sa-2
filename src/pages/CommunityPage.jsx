import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { discussionsApi } from "@/services/api";
import { formatDate } from "@/utils/formatters";
import "@/styles/CommunityPage.css";

const CommunityPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    description: "",
    category: "Beach Experiences",
  });
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [activeDiscussion, setActiveDiscussion] = useState(null);
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all discussions on component mount
  useEffect(() => {
    fetchDiscussions();
  }, []);

  // Filter discussions when dependencies change
  useEffect(() => {
    filterDiscussions();
  }, [discussions, searchQuery, selectedCategory]);

  // Fetch discussions from the API
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

  // Filter discussions based on search query and category
  const filterDiscussions = () => {
    if (!discussions.length) {
      setFilteredDiscussions([]);
      return;
    }

    let updatedDiscussions = [...discussions];

    // Filter by search query
    if (searchQuery) {
      updatedDiscussions = updatedDiscussions.filter(
        (discussion) =>
          discussion.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          discussion.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected category
    if (selectedCategory !== "All") {
      updatedDiscussions = updatedDiscussions.filter(
        (discussion) => discussion.category === selectedCategory
      );
    }

    setFilteredDiscussions(updatedDiscussions);
  };

  // Handle input changes in the new discussion form
  const handleNewDiscussionChange = (e) => {
    const { name, value } = e.target;
    setNewDiscussion({ ...newDiscussion, [name]: value });
  };

  // Add a new discussion
  const handleAddDiscussion = async () => {
    if (
      newDiscussion.title.trim() === "" ||
      newDiscussion.description.trim() === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const payload = {
        title: newDiscussion.title,
        content: newDiscussion.description,
        category: newDiscussion.category,
        author: "Anonymous",
      };

      await discussionsApi.createDiscussion(payload);

      // Reset form and refresh discussions
      setNewDiscussion({
        title: "",
        description: "",
        category: "Beach Experiences",
      });
      setShowDiscussionForm(false);
      fetchDiscussions();
    } catch (error) {
      console.error("Error adding discussion:", error);
      alert("Failed to add discussion. Please try again.");
    }
  };

  // Fetch comments for a discussion
  const fetchComments = async (discussionId) => {
    try {
      const response = await discussionsApi.getCommentsByDiscussion(
        discussionId
      );
      // Sort comments by date (oldest first)
      const sortedComments = response.data.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      setComments({ ...comments, [discussionId]: sortedComments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Set empty array if error to prevent repeated failed requests
      setComments({ ...comments, [discussionId]: [] });
    }
  };

  // Add a new comment to a discussion
  const handleAddComment = async (discussionId) => {
    if (newComment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const payload = {
        content: newComment,
        author: "Anonymous",
      };

      const response = await discussionsApi.createComment(
        discussionId,
        payload
      );

      // Update comments state with the new comment
      setComments((prevComments) => {
        const updatedComments = prevComments[discussionId]
          ? [...prevComments[discussionId]]
          : [];
        updatedComments.push(response.data);
        return { ...prevComments, [discussionId]: updatedComments };
      });

      setNewComment(""); // Reset comment input
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  // Reset view to discussion list
  const handleBackToDiscussions = () => {
    setActiveDiscussion(null);
    setNewComment("");
  };

  // Loading state
  if (isLoading && !discussions.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-blue-800">
            Loading discussions...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="community-page">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            SeaClear
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="text-white hover:text-blue-200">
              Home
            </Link>
            <Link
              to="/community"
              className="text-white hover:text-blue-200 font-bold"
            >
              Community
            </Link>
            <Link to="/education" className="text-white hover:text-blue-200">
              Learn
            </Link>
          </div>
        </div>
      </nav>

      <div className="community-header">
        <h1>Community Discussions</h1>
        <p>
          Share your beach experiences and join the conversation about water
          quality.
        </p>
        <div className="community-controls">
          <input
            type="text"
            className="search-bar"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Beach Experiences">Beach Experiences</option>
            <option value="Water Quality Awareness">
              Water Quality Awareness
            </option>
            <option value="Beach Events and Cleanups">
              Beach Events and Cleanups
            </option>
          </select>
          <button
            className="button"
            onClick={() => setShowDiscussionForm(!showDiscussionForm)}
          >
            {showDiscussionForm ? "Cancel" : "Start a New Discussion"}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-2xl mb-4">
          {error}
        </div>
      )}

      {/* New Discussion Form */}
      {showDiscussionForm && (
        <div className="new-discussion-form">
          <h3>Add a New Discussion</h3>
          <input
            type="text"
            name="title"
            placeholder="Discussion Title"
            value={newDiscussion.title}
            onChange={handleNewDiscussionChange}
          />
          <textarea
            name="description"
            placeholder="Discussion Description"
            value={newDiscussion.description}
            onChange={handleNewDiscussionChange}
          />
          <select
            name="category"
            value={newDiscussion.category}
            onChange={handleNewDiscussionChange}
          >
            <option value="Beach Experiences">Beach Experiences</option>
            <option value="Water Quality Awareness">
              Water Quality Awareness
            </option>
            <option value="Beach Events and Cleanups">
              Beach Events and Cleanups
            </option>
          </select>
          <button className="button" onClick={handleAddDiscussion}>
            Add Discussion
          </button>
        </div>
      )}

      {/* Back to Discussions Button */}
      {activeDiscussion && (
        <button
          className="back-button mx-auto block mb-4"
          onClick={handleBackToDiscussions}
        >
          Back to Discussions
        </button>
      )}

      <div className="discussion-list">
        {filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => (
            <div key={discussion._id} className="discussion-card">
              <h2>{discussion.title || "Discussion"}</h2>
              <p className="discussion-category">
                Category: {discussion.category}
              </p>
              <p>{discussion.content}</p>
              <div className="discussion-info">
                <span>Author: {discussion.author || "Anonymous"}</span>
                <span className="time-posted">
                  Time Posted: {formatDate(discussion.created_at)}
                </span>
              </div>
              <button
                onClick={() => {
                  if (activeDiscussion === discussion._id) {
                    setActiveDiscussion(null);
                  } else {
                    setActiveDiscussion(discussion._id);
                    fetchComments(discussion._id);
                  }
                }}
              >
                {activeDiscussion === discussion._id
                  ? "Hide Comments"
                  : "View Comments"}
              </button>

              {/* Display comments for active discussion */}
              {activeDiscussion === discussion._id &&
                comments[discussion._id] && (
                  <div className="comments-section">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {comments[discussion._id].length > 0
                        ? `Comments (${comments[discussion._id].length})`
                        : "No comments yet"}
                    </h4>

                    {comments[discussion._id].map((comment) => (
                      <div key={comment._id} className="comment">
                        <p>{comment.content}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span className="comment-author">
                            By {comment.author || "Anonymous"}
                          </span>
                          <span className="time-posted">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Comment input box */}
                    <div className="comment-box">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                      />
                      <button onClick={() => handleAddComment(discussion._id)}>
                        Add Comment
                      </button>
                    </div>
                  </div>
                )}
            </div>
          ))
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <p>
              {searchQuery || selectedCategory !== "All"
                ? "No discussions found matching your criteria."
                : "No discussions found. Be the first to start a discussion!"}
            </p>
          </div>
        )}
      </div>

      <footer className="bg-blue-800 text-white py-6 mt-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">SeaClear</h3>
              <p className="text-blue-200">Keeping beaches safe</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="text-blue-200 hover:text-white">
                Home
              </Link>
              <Link to="/education" className="text-blue-200 hover:text-white">
                Learn
              </Link>
              <Link to="/login" className="text-blue-200 hover:text-white">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommunityPage;

import { useState, useEffect } from "react";
import { CheckSquare, XSquare } from "lucide-react";
import { communityApi } from "@/services/api";
import { formatDate } from "@/utils/formatters";

const PostsContent = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      setIsLoading(true);
      const response = await communityApi.getPendingPosts();
      setPendingPosts(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching pending posts:", error);
      setError("Failed to fetch pending posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (postId) => {
    try {
      await communityApi.approvePost(postId);
      fetchPendingPosts();
    } catch (error) {
      console.error("Error approving post:", error);
      alert("Failed to approve post. Please try again.");
    }
  };

  const handleDisapprove = async (postId) => {
    try {
      await communityApi.disapprovePost(postId);
      fetchPendingPosts();
    } catch (error) {
      console.error("Error disapproving post:", error);
      alert("Failed to disapprove post. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading pending posts...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-10 text-center">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Pending Community Posts
      </h2>
      {pendingPosts.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No pending posts at the moment.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beach
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingPosts.map((post) => (
                  <tr key={post.post_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {post.beach_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.author || "Anonymous"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {post.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                      <button
                        onClick={() => handleApprove(post.post_id)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        aria-label="Approve post"
                      >
                        <CheckSquare size={18} />
                      </button>
                      <button
                        onClick={() => handleDisapprove(post.post_id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        aria-label="Disapprove post"
                      >
                        <XSquare size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsContent;

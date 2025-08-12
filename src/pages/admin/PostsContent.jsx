import { useState, useEffect } from "react";
import { CheckSquare, XSquare, Bot, Zap } from "lucide-react";
import { communityApi } from "@/services/api";
import { geminiService } from "@/services/geminiService";
import { formatDate } from "@/utils/formatters";

// Helper function to get beach name from code
const getBeachNameFromCode = (beachCode) => {
  const beachMap = {
    XCN08: "Silverstroomstrand Tidal Pool",
    XCN14: "Silverstroomstrand Lifeguard Building",
    XCN07: "Melkbosstrand",
    XCN12: "Blouberg Big Bay Lifeguard Building",
    CN37: "Small Bay",
    XCN06: "Tableview",
    XCN04: "Milnerton Lighthouse",
    CN22: "Lagoon Beach",
    CN04: "Mouille Point Beach (Thermopoli)",
    CN36: "Three Anchor Bay Beach",
    CN06C: "Rocklands Beach",
    CN18I: "Milton Beach Tidal Pool Inside",
    CN34: "Queen's Beach Tidal Pool",
    CN35: "Queen's Beach Gully",
    CN16O: "Saunders Rocks Tidal Pool Outside",
    CN16I: "Saunders Rocks Tidal Pool Inside",
    CN42: "Clifton Second Beach",
    CN09: "Clifton Fourth Beach",
    CN10: "Maidens Cove North Sandy Cove",
    CN19I: "Maidens Cove Tidal Pool West Inside",
    CN20I: "Maidens Cove Tidal Pool East Inside",
    CN31: "Glen Beach",
    CN30: "Camps Bay North",
    CN41: "Camps Bay Central",
    CN11: "Camps Bay South",
    CN12A: "Camps Bay Tidal Pool Inside",
    CN14: "Barley Bay",
    CN40: "Beta Beach",
    CN21: "Bakoven Beach",
    CN39: "Cosy Bay",
    XCN09: "Oudekraal",
    XCN03: "Llandudno",
    HB13: "Hout Bay Mariners Wharf",
    XCN10: "Hout Bay Chapmans Peak",
    CS40: "Hoek, Noordhoek Beach",
    XCN02: "Long Beach Kommetjie",
    CS39: "Inner Kom",
    XCN11: "Scarborough Beach",
    CS37: "Miller's Point Tidal Pool",
    XCS12: "Fishermans Beach",
    CS36: "Windmill Beach",
    XCS32: "Boulders Beach",
    XCS13: "Seaforth Beach",
    XCS14: "Simons Town Long Beach",
    CS38: "Glencairn Tidal Pool",
    XCS15: "Glencairn Beach",
    CS35: "Fish Hoek Corner Of The Beach",
    CS41: "Fish Hoek Beach Lifesaving Club",
    XCS17: "Clovelly Beach Silvermine Mouth",
    CS42: "Woolley's Tidal Pool",
    CS01A: "Kalk Bay Harbour Beach",
    CS02: "Kalk Bay Tidal Pool Inside",
    CS03: "Dalebrook Tidal Pool",
    CS44: "Dangers Beach",
    CS04: "St James Tidal Pool",
    CS34: "Muizenberg Surfers Corner",
    CS16: "Muizenberg Pavilion",
    CS07: "Sunrise Beach Parking Area",
    CS11: "Ribbon Road Parking Area",
    CS17: "Strandfontein Tidal Pool",
    CS45: "Strandfontein Beach",
    CS46: "Blue Waters Resort",
    CS19: "Mnandi Beach",
    XCS18: "Monwabisi Tidal Pool",
    XCS30: "Monwabisi Beach",
    XCS19: "Macassar Beach",
    XCS34: "Strand Pipe Surfing",
    XCS26: "Strand Lifesaving Club",
    XCS29: "Strand Harmonie Park Jetty",
    XCS05: "Gordons Bay East Beach",
    CS29: "Gordons Bay Milkwoods",
    XCS08: "Gordons Bay Bikini Beach",
    XCS09: "Kogel Bay Beach",
  };

  return beachMap[beachCode] || beachCode;
};

const PostsContent = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moderatingPosts, setModeratingPosts] = useState(new Set());

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      setIsLoading(true);
      const response = await communityApi.getPendingPosts();

      const transformedPosts = response.data.map((post) => ({
        post_id: post.id,
        beach_name: getBeachNameFromCode(post.beachCode),
        beach_code: post.beachCode,
        author: "Anonymous",
        content: post.content,
        created_at: post.createdAt,
      }));

      setPendingPosts(transformedPosts);
      setError(null);
    } catch (error) {
      console.error("Error fetching pending posts:", error);
      setError("Failed to fetch pending posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIModerate = async (post) => {
    const postId = post.post_id;
    setModeratingPosts((prev) => new Set(prev).add(postId));

    try {
      // Let Gemini decide
      const shouldApprove = await geminiService.shouldApprovePost(
        post.content,
        post.beach_name
      );

      if (shouldApprove) {
        await communityApi.approvePost(postId);
      } else {
        await communityApi.disapprovePost(postId);
      }

      // Refresh the list
      fetchPendingPosts();
    } catch (error) {
      console.error("Error during AI moderation:", error);
      alert("AI moderation failed. Try manual review.");
    } finally {
      setModeratingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleBulkAIModerate = async () => {
    for (const post of pendingPosts) {
      await handleAIModerate(post);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Pending Community Posts
        </h2>
        {pendingPosts.length > 0 && (
          <button
            onClick={handleBulkAIModerate}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Zap className="w-4 h-4 mr-2" />
            AI Moderate All
          </button>
        )}
      </div>

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
                    Actions
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
                        onClick={() => handleAIModerate(post)}
                        disabled={moderatingPosts.has(post.post_id)}
                        className="text-purple-600 hover:text-purple-900 transition-colors disabled:opacity-50"
                        aria-label="AI Moderate"
                      >
                        {moderatingPosts.has(post.post_id) ? (
                          <Bot size={18} className="animate-pulse" />
                        ) : (
                          <Bot size={18} />
                        )}
                      </button>
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

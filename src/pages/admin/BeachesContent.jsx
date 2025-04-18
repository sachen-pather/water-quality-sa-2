import { useState, useEffect } from "react";
import { beachesApi } from "@/services/api";
import { formatDate } from "@/utils/formatters";

const BeachesContent = () => {
  const [beaches, setBeaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBeaches();
  }, []);

  const fetchBeaches = async () => {
    try {
      setIsLoading(true);
      const response = await beachesApi.getAllBeaches();
      setBeaches(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching beaches:", error);
      setError("Failed to fetch beaches data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBeach = (beachId) => {
    // In a real app, this would open a modal or navigate to an edit page
    alert(`Edit beach with ID: ${beachId}`);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading beaches data...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-10 text-center">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Manage Beaches</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={() => alert("Add new beach functionality would go here")}
        >
          Add New Beach
        </button>
      </div>

      {beaches.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No beaches found in the database.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Sampled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {beaches.map((beach) => (
                  <tr key={beach.id || beach.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {beach.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          beach.is_safe
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {beach.is_safe ? "Safe" : "Unsafe"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {beach.date_sampled
                        ? formatDate(beach.date_sampled)
                        : "No data"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditBeach(beach.id || beach.name)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        Edit
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

export default BeachesContent;

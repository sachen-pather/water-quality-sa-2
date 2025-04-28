import { useState } from "react";
import { beachService } from "@/services/BeachService";
import { formatDate } from "@/utils/formatters";
import BeachEditModal from "@/components/BeachEditModal";
import useBeachData from "@/hooks/useBeachData";

const BeachesContent = () => {
  const { beaches, isLoading, error, fetchAllBeaches } = useBeachData();
  const [editingBeach, setEditingBeach] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditBeach = (beach) => {
    setEditingBeach(beach);
    setIsModalOpen(true);
  };

  const handleSaveBeach = async (updatedBeach) => {
    try {
      // Transform the data back to backend format
      const beachData = {
        id: updatedBeach.id,
        beachCode: updatedBeach.code,
        samplingDate: updatedBeach.date_sampled,
        enterococcusCount: updatedBeach.enterococcus_count,
        samplingFrequency: updatedBeach.sampling_frequency,
        isWithinSafetyThreshold: updatedBeach.is_safe ? 1 : 0,
      };

      await beachService.updateBeachReading(updatedBeach.code, beachData);
      await fetchAllBeaches(); // Refresh the list using the hook's fetch function
      setIsModalOpen(false);
      setEditingBeach(null);
    } catch (error) {
      console.error("Error saving beach:", error);
      // Handle error (you might want to show an error message to the user)
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBeach(null);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading beaches data...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-10 text-center">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Beach Management
      </h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beach Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sampled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enterococcus Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {beaches.map((beach) => (
                <tr key={beach.code}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {beach.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {beach.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {beach.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(beach.date_sampled)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {beach.values[0]} cfu/100ml
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        beach.is_safe
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {beach.is_safe ? "Safe" : "Unsafe"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditBeach(beach)}
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

      {isModalOpen && (
        <BeachEditModal
          beach={editingBeach}
          onClose={handleCloseModal}
          onSave={handleSaveBeach}
        />
      )}
    </div>
  );
};

export default BeachesContent;

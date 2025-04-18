import { useState, useEffect } from "react";

const ReportsContent = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch reports from your backend
    // For now we'll use mock data
    setIsLoading(true);
    setTimeout(() => {
      const mockReports = [
        {
          id: 1,
          date: "2024-09-15",
          beach: "Clifton Beach",
          type: "Water Quality",
          status: "Pending",
        },
        {
          id: 2,
          date: "2024-09-14",
          beach: "Muizenberg Beach",
          type: "Litter",
          status: "Resolved",
        },
        {
          id: 3,
          date: "2024-09-13",
          beach: "Camps Bay Beach",
          type: "Facilities",
          status: "In Progress",
        },
        {
          id: 4,
          date: "2024-09-12",
          beach: "Fish Hoek Beach",
          type: "Safety",
          status: "Pending",
        },
        {
          id: 5,
          date: "2024-09-11",
          beach: "Bloubergstrand",
          type: "Water Quality",
          status: "Resolved",
        },
      ];
      setReports(mockReports);
      setIsLoading(false);
    }, 800); // Simulate network delay
  }, []);

  const handleViewDetails = (reportId) => {
    // In a real app, this would open a modal or navigate to a details page
    alert(`View details for report ID: ${reportId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading reports...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">View Reports</h2>
        <div>
          <select className="bg-white border border-gray-300 rounded px-3 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <select className="bg-white border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Types</option>
            <option>Water Quality</option>
            <option>Litter</option>
            <option>Facilities</option>
            <option>Safety</option>
          </select>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No reports found.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beach
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.beach}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(report.id)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        View Details
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

export default ReportsContent;

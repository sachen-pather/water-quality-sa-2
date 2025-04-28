import { useState, useEffect } from "react";
import { Droplet, MessageSquare } from "lucide-react";
import { beachService } from "@/services/BeachService";
import { communityApi } from "@/services/api";

// Dashboard card component
const DashboardCard = ({ title, value, icon: Icon, isLoading }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className="rounded-full bg-blue-100 p-3 mr-4">
      <Icon size={24} className="text-blue-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {isLoading ? (
        <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    beaches: 0,
    pendingComments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch beaches data
        const beachesResponse = await beachService.getAllBeaches();
        const beachesCount = beachesResponse.data
          ? beachesResponse.data.length
          : 0;

        // Fetch pending comments
        const pendingPostsResponse = await communityApi.getPendingPosts();
        const pendingCommentsCount = pendingPostsResponse.data
          ? pendingPostsResponse.data.length
          : 0;

        setStats({
          beaches: beachesCount,
          pendingComments: pendingCommentsCount,
        });

        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
        <p className="font-medium">Error loading dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Total Beaches"
          value={stats.beaches}
          icon={Droplet}
          isLoading={isLoading}
        />
        <DashboardCard
          title="Pending Comments"
          value={stats.pendingComments}
          icon={MessageSquare}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;

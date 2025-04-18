import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Droplet, MessageSquare, AlertTriangle } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PostsContent from "./PostsContent";
import UploadContent from "./UploadContent";
import BeachesContent from "./BeachesContent";
import ReportsContent from "./ReportsContent";

// Dashboard card component
const DashboardCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className="rounded-full bg-blue-100 p-3 mr-4">
      <Icon size={24} className="text-blue-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Dashboard overview component
const Dashboard = () => {
  const [stats, setStats] = useState({
    beaches: "0",
    pendingComments: "0",
    reports: "0",
  });

  useEffect(() => {
    // In a real app, you'd fetch this data from your API
    // For now, we'll use mock data
    setStats({
      beaches: "75",
      pendingComments: "12",
      reports: "5",
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Beaches"
          value={stats.beaches}
          icon={Droplet}
        />
        <DashboardCard
          title="Pending Comments"
          value={stats.pendingComments}
          icon={MessageSquare}
        />
        <DashboardCard
          title="Recent Reports"
          value={stats.reports}
          icon={AlertTriangle}
        />
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, isLoading, logout, checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your credentials.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={logout} title="Admin Dashboard" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/posts" element={<PostsContent />} />
              <Route path="/upload" element={<UploadContent />} />
              <Route path="/beaches" element={<BeachesContent />} />
              <Route path="/reports" element={<ReportsContent />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

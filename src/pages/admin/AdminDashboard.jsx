import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PostsContent from "./PostsContent";
import UploadContent from "./UploadContent";
import BeachesContent from "./BeachesContent";
import Dashboard from "./Dashboard"; // Import the updated Dashboard component

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
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

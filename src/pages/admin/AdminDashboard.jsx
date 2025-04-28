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
            {/* Admin Overview Section */}
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Dashboard />
                    <div className="mt-8">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        Admin Responsibilities Overview
                      </h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Community Moderation Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                          <h3 className="text-lg font-semibold text-blue-600 mb-4">
                            Community Post Moderation
                          </h3>
                          <ul className="space-y-2 text-gray-600">
                            <li>• Monitor and review user discussions</li>
                            <li>• Remove inappropriate content</li>
                            <li>• Ensure discussions remain constructive</li>
                            <li>• Address user reports promptly</li>
                          </ul>
                          <button
                            onClick={() => navigate("/admin/posts")}
                            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Go to Post Moderation →
                          </button>
                        </div>

                        {/* Beach Data Management Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                          <h3 className="text-lg font-semibold text-green-600 mb-4">
                            Beach Data Management
                          </h3>
                          <ul className="space-y-2 text-gray-600">
                            <li>• Edit beach information if needed</li>
                            <li>• Update water quality status</li>
                            <li>• Correct any data discrepancies</li>
                            <li>• Verify location coordinates</li>
                          </ul>
                          <button
                            onClick={() => navigate("/admin/beaches")}
                            className="mt-4 text-green-600 hover:text-green-800 font-medium"
                          >
                            Manage Beaches →
                          </button>
                        </div>

                        {/* Data Upload Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                          <h3 className="text-lg font-semibold text-purple-600 mb-4">
                            Water Quality Updates
                          </h3>
                          <ul className="space-y-2 text-gray-600">
                            <li>• Upload official PDF reports</li>
                            <li>• Monitor City of Cape Town updates</li>
                            <li>• Verify parsed data accuracy</li>
                            <li>• Maintain update schedule</li>
                          </ul>
                          <button
                            onClick={() => navigate("/admin/upload")}
                            className="mt-4 text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Upload Reports →
                          </button>
                        </div>
                      </div>

                      {/* General Guidelines */}
                      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                          Important Guidelines
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                              Regular Maintenance
                            </h4>
                            <ul className="list-disc pl-5 text-gray-600 space-y-1">
                              <li>
                                Check the dashboard daily for new user posts
                              </li>
                              <li>Review water quality data weekly</li>
                              <li>Verify beach information monthly</li>
                              <li>Document any significant changes made</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                              Best Practices
                            </h4>
                            <ul className="list-disc pl-5 text-gray-600 space-y-1">
                              <li>Always verify data before making updates</li>
                              <li>
                                Maintain professional communication in
                                moderation
                              </li>
                              <li>Keep detailed records of all changes</li>
                              <li>Report technical issues immediately</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                }
              />
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

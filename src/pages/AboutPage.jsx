import React from "react";
import Header from "../components/Header";
import { Shield, Users, FileText, MapPin, MessageSquare } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton title="About SeaClear" backLink="/" />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Developer Introduction */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Developer's Note
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Hello! I'm Sachen Pather, the developer behind this application.
              This project evolved from a final year computer science project
              idea, and I've developed it into a fully functional application
              that serves a crucial public health need.
            </p>
          </section>

          {/* Application Purpose */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Our Mission
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The SeaClear App addresses a critical environmental and public
                health concern in South Africa: monitoring beach water quality
                through Enterococcus Count measurements. This scientific
                indicator helps users make informed decisions about beach safety
                for swimming and recreational activities.
              </p>
              <div className="flex items-start gap-3 mt-4">
                <Shield className="text-cyan-600 mt-1" />
                <p className="text-gray-700">
                  <strong className="text-blue-700">Safety First:</strong> We
                  provide real-time Enterococcus Count data that aligns with
                  official safety regulations, helping you make informed
                  decisions about beach activities.
                </p>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              How to Use
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-cyan-600 mt-1" />
                <p className="text-gray-700">
                  <strong className="text-blue-700">Find Your Beach:</strong>{" "}
                  Simply click on the interactive map, use the search bar, or
                  browse through our beach cards to find your desired location.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="text-cyan-600 mt-1" />
                <p className="text-gray-700">
                  <strong className="text-blue-700">
                    Community Engagement:
                  </strong>{" "}
                  Share your beach experiences in the comments section. For
                  quality control, all comments are reviewed before being
                  published.
                </p>
              </div>
            </div>
          </section>

          {/* Admin Features */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Administrative Features
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="text-cyan-600 mt-1" />
                <p className="text-gray-700">
                  <strong className="text-blue-700">Admin Access:</strong> For
                  demonstration purposes, users can access admin privileges to
                  explore features like editing beach details and managing user
                  comments.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="text-cyan-600 mt-1" />
                <p className="text-gray-700">
                  <strong className="text-blue-700">Data Management:</strong>{" "}
                  Administrators can upload and parse the latest City of Cape
                  Town municipal reports, ensuring our beach safety data stays
                  current and accurate.
                </p>
              </div>
            </div>
          </section>

          {/* Demo Admin Login */}
          <section className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Try Admin Features
            </h2>
            <p className="text-gray-700 mb-4">
              Experience the administrative features of the application using
              our demo admin access:
            </p>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-700">
                <strong className="text-blue-700">Username:</strong>{" "}
                admin@demo.com
              </p>
              <p className="text-gray-700">
                <strong className="text-blue-700">Password:</strong> demo123
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Note: This is a demonstration account. In a production
              environment, admin access would be strictly controlled.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;

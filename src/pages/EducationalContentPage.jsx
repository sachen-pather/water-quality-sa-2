"use client";

import { Link } from "react-router-dom";
import {
  Droplet,
  Shield,
  Leaf,
  ArrowLeft,
  Info,
  AlertTriangle,
  Heart,
} from "lucide-react";

// Educational card component with improved styling
const EducationCard = ({ icon, title, content }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
    <div className="flex justify-center mb-4 text-blue-500">{icon}</div>
    <h2 className="text-xl font-semibold mb-3 text-center text-blue-800">
      {title}
    </h2>
    <p className="text-gray-600 flex-grow">{content}</p>
  </div>
);

// Section header component for consistency
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center mb-4 gap-2">
    {icon}
    <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
  </div>
);

const EducationalContentPage = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      <header className="beach-header">
        <div className="container mx-auto px-6">
          <Link
            to="/"
            className="back-button"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Learn About Beach Safety and Conservation
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <EducationCard
            icon={<Droplet className="w-12 h-12" />}
            title="Understanding Water Quality"
            content="Learn about the factors that affect water quality and how it's measured. Understand the importance of clean water for both human health and marine ecosystems."
          />
          <EducationCard
            icon={<Shield className="w-12 h-12" />}
            title="Beach Safety Guidelines"
            content="Discover essential beach safety tips, including how to recognize and avoid rip currents, the importance of sun protection, and what different beach flags mean."
          />
          <EducationCard
            icon={<Leaf className="w-12 h-12" />}
            title="Environmental Conservation"
            content="Explore ways to protect our beaches and marine life. Learn about the impact of pollution on coastal ecosystems and how you can contribute to conservation efforts."
          />
        </div>

        <div className="content-grid grid md:grid-cols-2 gap-6 mb-12">
          <section className="content-card bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <SectionHeader
              icon={<Info className="text-blue-500 w-6 h-6" />}
              title="Water Quality Explained"
            />

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">
                  What Affects Water Quality?
                </h3>
                <p className="mb-3 text-gray-700">
                  Water quality can be influenced by various factors, including:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li>Rainfall and stormwater runoff</li>
                  <li>Sewage and wastewater discharge</li>
                  <li>Agricultural runoff</li>
                  <li>Industrial pollution</li>
                  <li>Natural phenomena like algal blooms</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">
                  How is Water Quality Measured?
                </h3>
                <p className="mb-3 text-gray-700">
                  Water quality is typically assessed through various
                  parameters, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Bacterial levels (e.g., E. coli and Enterococci)</li>
                  <li>pH levels</li>
                  <li>Dissolved oxygen</li>
                  <li>Turbidity (water clarity)</li>
                  <li>Presence of nutrients and pollutants</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="content-card bg-white rounded-lg shadow-md p-6">
            <SectionHeader
              icon={<AlertTriangle className="text-yellow-500 w-6 h-6" />}
              title="Understanding E. coli in Beach Water"
            />

            <div className="space-y-6">
              <p className="text-gray-700">
                E. coli (Escherichia coli) is a type of bacteria commonly found
                in the intestines of humans and animals. While most strains are
                harmless, their presence in water indicates fecal contamination.
              </p>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">
                  Why E. coli Matters
                </h3>
                <p className="mb-3 text-gray-700">
                  E. coli is used as an indicator organism for water quality
                  testing because:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li>
                    It indicates the possible presence of disease-causing
                    organisms
                  </li>
                  <li>
                    High levels suggest recent sewage or animal waste
                    contamination
                  </li>
                  <li>It can be easily tested for and quantified</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">
                  Safety Thresholds
                </h3>
                <p className="mb-3 text-gray-700">
                  South African guidelines for coastal waters typically consider
                  these thresholds:
                </p>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="font-semibold text-green-600">Safe:</span>
                    <span className="text-gray-700">
                      E. coli levels below 250 cfu/100ml
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="font-semibold text-yellow-600">
                      Caution:
                    </span>
                    <span className="text-gray-700">
                      E. coli levels between 250-500 cfu/100ml
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="font-semibold text-red-600">Unsafe:</span>
                    <span className="text-gray-700">
                      E. coli levels above 500 cfu/100ml
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="content-card bg-white rounded-lg shadow-md p-6">
            <SectionHeader
              icon={<Heart className="text-red-500 w-6 h-6" />}
              title="How You Can Help"
            />

            <div className="space-y-4">
              <p className="text-gray-700">
                Everyone can play a role in maintaining beach cleanliness and
                protecting our coastal environments. Here are some ways you can
                contribute:
              </p>

              <div className="grid gap-3">
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-800">
                    Participate in beach clean-up events
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Join organized clean-ups or start your own initiative with
                    friends
                  </p>
                </div>

                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-800">
                    Properly dispose of trash
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Never leave litter on the beach and recycle when possible
                  </p>
                </div>

                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-800">
                    Use reef-safe sunscreen
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Choose products without oxybenzone and octinoxate to protect
                    marine life
                  </p>
                </div>

                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-800">Report issues</h4>
                  <p className="text-gray-700 text-sm">
                    Use our platform to report water quality concerns or beach
                    pollution
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8 mt-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">SeaClear</h3>
              <p className="text-blue-200">Keeping beaches safe and clean</p>
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-2">
              <Link
                to="/"
                className="text-blue-200 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/community"
                className="text-blue-200 hover:text-white transition-colors"
              >
                Community
              </Link>
              <Link
                to="/login"
                className="text-blue-200 hover:text-white transition-colors"
              >
                Admin
              </Link>
              <Link
                to="/beaches"
                className="text-blue-200 hover:text-white transition-colors"
              >
                Beaches
              </Link>
              <Link
                to="/about"
                className="text-blue-200 hover:text-white transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-blue-200 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-blue-600 text-center text-blue-200 text-sm">
            &copy; {new Date().getFullYear()} SeaClear. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EducationalContentPage;

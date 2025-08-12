import React from "react";
import Header from "../components/Header";
import {
  Droplet,
  Shield,
  Leaf,
  Info,
  AlertTriangle,
  Heart,
} from "lucide-react";

// Educational card component with improved styling
const EducationCard = ({ icon, title, content }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
    <div className="flex justify-center mb-4 text-cyan-600">{icon}</div>
    <h2 className="text-xl font-semibold mb-3 text-center text-blue-700">
      {title}
    </h2>
    <p className="text-gray-700 flex-grow">{content}</p>
  </div>
);

// Section header component for consistency
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center mb-4 gap-2">
    {icon}
    <h2 className="text-2xl font-bold text-blue-700">{title}</h2>
  </div>
);

const EducationalContentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton title="Learn More" backLink="/" />

      <main className="container mx-auto px-6 py-8">
        {/* Top Cards */}
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

        {/* Main Content Sections */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-sm p-6">
            <SectionHeader
              icon={<Info className="text-cyan-600 w-6 h-6" />}
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
                  <li>Bacterial levels (e.g., Enterococcus and E. coli)</li>
                  <li>pH levels</li>
                  <li>Dissolved oxygen</li>
                  <li>Turbidity (water clarity)</li>
                  <li>Presence of nutrients and pollutants</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6">
            <SectionHeader
              icon={<AlertTriangle className="text-yellow-500 w-6 h-6" />}
              title="Understanding Enterococcus in Beach Water"
            />

            <div className="space-y-6">
              <p className="text-gray-700">
                Enterococcus is a type of bacteria commonly found in the
                intestines of humans and animals. While some strains are
                harmless, their presence in water indicates fecal contamination
                and potential health risks.
              </p>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">
                  Why Enterococcus Matters
                </h3>
                <p className="mb-3 text-gray-700">
                  Enterococcus is used as an indicator organism for marine water
                  quality testing because:
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
                  <li>
                    It survives longer in saltwater than other indicator
                    bacteria
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
                      Enterococcus levels below 250 cfu/100ml
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="font-semibold text-yellow-600">
                      Caution:
                    </span>
                    <span className="text-gray-700">
                      Enterococcus levels between 250-500 cfu/100ml
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="font-semibold text-red-600">Unsafe:</span>
                    <span className="text-gray-700">
                      Enterococcus levels above 500 cfu/100ml
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">
                  Health Risks
                </h3>
                <p className="mb-3 text-gray-700">
                  Swimming in water with high Enterococcus levels can lead to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Gastrointestinal illness (stomach upset, diarrhea)</li>
                  <li>Skin and eye infections</li>
                  <li>Respiratory problems</li>
                  <li>Ear infections</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6">
            <SectionHeader
              icon={<Shield className="text-cyan-600 w-6 h-6" />}
              title="Beach Safety Guidelines"
            />

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">
                  Rip Current Safety
                </h3>
                <p className="mb-3 text-gray-700">
                  Rip currents are powerful, channeled currents of water flowing
                  away from shore. Here's how to stay safe:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                  <li>Look for channels of churning, choppy water</li>
                  <li>Watch for lines of foam or debris moving seaward</li>
                  <li>If caught in a rip current, don't fight it directly</li>
                  <li>
                    Swim parallel to the shore until you escape the current
                  </li>
                  <li>Then swim at an angle back to shore</li>
                  <li>Always swim near lifeguards when possible</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">
                  Sun Protection
                </h3>
                <p className="mb-3 text-gray-700">
                  South African sun is intense, especially with reflection off
                  water:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Use broad-spectrum SPF 30+ sunscreen</li>
                  <li>Reapply every 2 hours and after swimming</li>
                  <li>Seek shade during peak hours (10am-4pm)</li>
                  <li>Wear protective clothing and hats</li>
                  <li>Choose reef-safe sunscreen to protect marine life</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">
                  Beach Flag System
                </h3>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="font-semibold text-green-600">
                      Green Flag:
                    </span>
                    <span className="text-gray-700">
                      Safe swimming conditions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="font-semibold text-yellow-600">
                      Yellow Flag:
                    </span>
                    <span className="text-gray-700">
                      Use caution, moderate risk
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="font-semibold text-red-600">
                      Red Flag:
                    </span>
                    <span className="text-gray-700">
                      Dangerous conditions, no swimming
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span className="font-semibold text-purple-600">
                      Purple Flag:
                    </span>
                    <span className="text-gray-700">
                      Marine life hazard (sharks, jellyfish)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6">
            <SectionHeader
              icon={<Heart className="text-cyan-600 w-6 h-6" />}
              title="How You Can Help"
            />

            <div className="space-y-4">
              <p className="text-gray-700">
                Everyone can play a role in maintaining beach cleanliness and
                protecting our coastal environments. Here are some ways you can
                contribute:
              </p>

              <div className="grid gap-3">
                <div className="p-3 border-l-4 border-cyan-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-700">
                    Participate in beach clean-up events
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Join organized clean-ups or start your own initiative with
                    friends
                  </p>
                </div>

                <div className="p-3 border-l-4 border-cyan-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-700">
                    Properly dispose of trash
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Never leave litter on the beach and recycle when possible
                  </p>
                </div>

                <div className="p-3 border-l-4 border-cyan-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-700">
                    Use reef-safe sunscreen
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Choose products without oxybenzone and octinoxate to protect
                    marine life
                  </p>
                </div>

                <div className="p-3 border-l-4 border-cyan-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-700">Report issues</h4>
                  <p className="text-gray-700 text-sm">
                    Use our platform to report water quality concerns or beach
                    pollution
                  </p>
                </div>

                <div className="p-3 border-l-4 border-cyan-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-700">
                    Respect marine life
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Don't feed wildlife, maintain distance from marine animals,
                    and avoid disturbing nesting areas
                  </p>
                </div>

                <div className="p-3 border-l-4 border-cyan-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-700">
                    Conserve water
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Reduce water pollution by using eco-friendly products and
                    minimizing runoff
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6">
            <SectionHeader
              icon={<Info className="text-cyan-600 w-6 h-6" />}
              title="About SeaClear"
            />

            <div className="space-y-4">
              <p className="text-gray-700">
                SeaClear is a comprehensive beach water quality monitoring
                system for Cape Town's coastline. Our mission is to provide
                real-time, accurate information to help beachgoers make informed
                decisions about water safety.
              </p>

              <div className="grid gap-3">
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-700">
                    Real-time Monitoring
                  </h4>
                  <p className="text-gray-700 text-sm">
                    We track Enterococcus levels at beaches across Cape Town,
                    updating data regularly
                  </p>
                </div>

                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-700">
                    Scientific Standards
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Our measurements follow South African water quality
                    guidelines and international best practices
                  </p>
                </div>

                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                  <h4 className="font-semibold text-blue-700">
                    Community Engagement
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Share your beach experiences and help build a community
                    focused on coastal protection
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                <h4 className="font-semibold text-blue-700 mb-2">
                  Developer's Note
                </h4>
                <p className="text-gray-700 text-sm">
                  SeaClear was developed by Sachen Pather as part of a computer
                  science project, evolved into a fully functional application
                  addressing critical public health needs in South Africa's
                  coastal communities.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EducationalContentPage;

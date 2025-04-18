import { Link } from "react-router-dom";
import { Droplet, Shield, Leaf } from "lucide-react";

// Educational card component
const EducationCard = ({ icon, title, content }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
    <div className="flex justify-center mb-4">{icon}</div>
    <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
    <p className="text-gray-600">{content}</p>
  </div>
);

const EducationalContentPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-6 py-4">
          <Link
            to="/"
            className="text-white hover:text-blue-200 inline-block mb-2"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold">
            Learn About Beach Safety and Conservation
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <EducationCard
            icon={<Droplet className="w-12 h-12 text-blue-500" />}
            title="Understanding Water Quality"
            content="Learn about the factors that affect water quality and how it's measured. Understand the importance of clean water for both human health and marine ecosystems."
          />
          <EducationCard
            icon={<Shield className="w-12 h-12 text-green-500" />}
            title="Beach Safety Guidelines"
            content="Discover essential beach safety tips, including how to recognize and avoid rip currents, the importance of sun protection, and what different beach flags mean."
          />
          <EducationCard
            icon={<Leaf className="w-12 h-12 text-yellow-500" />}
            title="Environmental Conservation"
            content="Explore ways to protect our beaches and marine life. Learn about the impact of pollution on coastal ecosystems and how you can contribute to conservation efforts."
          />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Water Quality Explained</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">
              What Affects Water Quality?
            </h3>
            <p className="mb-4">
              Water quality can be influenced by various factors, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Rainfall and stormwater runoff</li>
              <li>Sewage and wastewater discharge</li>
              <li>Agricultural runoff</li>
              <li>Industrial pollution</li>
              <li>Natural phenomena like algal blooms</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">
              How is Water Quality Measured?
            </h3>
            <p className="mb-2">
              Water quality is typically assessed through various parameters,
              including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Bacterial levels (e.g., E. coli and Enterococci)</li>
              <li>pH levels</li>
              <li>Dissolved oxygen</li>
              <li>Turbidity (water clarity)</li>
              <li>Presence of nutrients and pollutants</li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Understanding E. coli in Beach Water
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="mb-4">
              E. coli (Escherichia coli) is a type of bacteria commonly found in
              the intestines of humans and animals. While most strains are
              harmless, their presence in water indicates fecal contamination.
            </p>

            <h3 className="text-xl font-semibold mb-2">Why E. coli Matters</h3>
            <p className="mb-4">
              E. coli is used as an indicator organism for water quality testing
              because:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                It indicates the possible presence of disease-causing organisms
              </li>
              <li>
                High levels suggest recent sewage or animal waste contamination
              </li>
              <li>It can be easily tested for and quantified</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">Safety Thresholds</h3>
            <p className="mb-2">
              South African guidelines for coastal waters typically consider
              these thresholds:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-semibold text-green-600">Safe:</span> E.
                coli levels below 250 cfu/100ml
              </li>
              <li>
                <span className="font-semibold text-yellow-600">Caution:</span>{" "}
                E. coli levels between 250-500 cfu/100ml
              </li>
              <li>
                <span className="font-semibold text-red-600">Unsafe:</span> E.
                coli levels above 500 cfu/100ml
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">How You Can Help</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="mb-4">
              Everyone can play a role in maintaining beach cleanliness and
              protecting our coastal environments. Here are some ways you can
              contribute:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">
                  Participate in beach clean-up events
                </span>{" "}
                - Join organized clean-ups or start your own initiative with
                friends
              </li>
              <li>
                <span className="font-semibold">Properly dispose of trash</span>{" "}
                - Never leave litter on the beach and recycle when possible
              </li>
              <li>
                <span className="font-semibold">Use reef-safe sunscreen</span> -
                Choose products without oxybenzone and octinoxate to protect
                marine life
              </li>
              <li>
                <span className="font-semibold">Conserve water</span> - Reduce
                your water usage to help minimize runoff and wastewater
              </li>
              <li>
                <span className="font-semibold">Educate others</span> - Share
                your knowledge about beach conservation with friends and family
              </li>
              <li>
                <span className="font-semibold">Report issues</span> - Use our
                platform to report water quality concerns or beach pollution
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-blue-800 text-white py-6 mt-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">SeaClear</h3>
              <p className="text-blue-200">Keeping beaches safe</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="text-blue-200 hover:text-white">
                Home
              </Link>
              <Link to="/community" className="text-blue-200 hover:text-white">
                Community
              </Link>
              <Link to="/login" className="text-blue-200 hover:text-white">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EducationalContentPage;

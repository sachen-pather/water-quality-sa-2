import { useState } from "react";
import axios from "axios";

const UploadContent = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setMessage(`Selected file: ${selectedFile.name}`);
    } else {
      setFile(null);
      setMessage("Please select a valid PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadUrl =
        import.meta.env.VITE_UPLOAD_API_URL ||
        "https://waterqualityapi20250427235311.azurewebsites.net/upload";
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message || "File uploaded successfully");
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred during upload"
      );
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
      setFile(null);
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Upload Water Quality Data
      </h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select PDF file to upload
            </label>
            <input
              type="file"
              id="file-upload"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !file}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {message && (
          <div
            className={`mt-4 p-3 rounded-md ${
              message.includes("error") || message.includes("Please select")
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Admin Responsibilities
        </h2>
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Data Source
            </h3>
            <p className="text-gray-600">
              Official water quality data should be obtained from the{" "}
              <a
                href="https://www.capetown.gov.za/Explore%20and%20enjoy/nature-and-outdoors/our-precious-biodiversity/coastal-water-quality"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                City of Cape Town's Coastal Water Quality page
              </a>
              . Download the latest water quality review table in PDF format.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Upload Guidelines
            </h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    The system includes an automated PDF parsing service. It's
                    crucial to upload the correct PDF format to ensure accurate
                    data extraction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Key Responsibilities
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                Regular monitoring of the City of Cape Town's website for new
                water quality data updates
              </li>
              <li>
                Verification of PDF content before upload to ensure it contains
                the correct water quality review table
              </li>
              <li>
                Immediate update of the system when new water quality data
                becomes available
              </li>
              <li>
                Cross-verification of parsed data after upload to ensure
                accuracy
              </li>
              <li>
                Maintaining a record of uploads and any issues encountered
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Update Schedule
            </h3>
            <div className="bg-blue-50 p-4 rounded-md">
              <ul className="list-none space-y-2 text-blue-800">
                <li>• Weekly updates for key recreational nodes</li>
                <li>• Bi-weekly updates for all other sampling sites</li>
                <li>
                  • Special updates during summer season and holiday periods
                </li>
                <li>
                  • Immediate updates following significant water quality events
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Support
            </h3>
            <p className="text-gray-600">
              For technical issues with the upload process or PDF parsing,
              please contact the development team through the appropriate
              channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadContent;

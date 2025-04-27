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
      // Use the environment variable for API URL
      const uploadUrl =
        import.meta.env.VITE_UPLOAD_API_URL || "https://localhost:7111/upload";
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
      // Reset the file input
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
    </div>
  );
};

export default UploadContent;

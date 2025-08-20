import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const BeachEditModal = ({ beach, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    code: "",
    values: [0],
    date_sampled: "",
    sampling_frequency: "Weekly",
    is_safe: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (beach) {
      console.log("Beach data received:", beach); // Debug log
      setFormData({
        id: beach.id,
        code: beach.code,
        values: beach.values || [0],
        date_sampled: beach.date_sampled
          ? new Date(beach.date_sampled).toISOString().split("T")[0]
          : "",
        sampling_frequency: beach.sampling_frequency || "Weekly",
        is_safe: beach.is_safe,
      });
    }
  }, [beach]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError(""); // Clear any previous errors

    if (name === "enterococcus_count") {
      const numValue = parseFloat(value) || 0;
      setFormData((prev) => ({
        ...prev,
        values: [numValue],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const calculateSafetyStatus = (enterococcusCount) => {
    const count = parseFloat(enterococcusCount);
    if (isNaN(count)) return true;

    // Using your 250/500 threshold system
    if (count < 250) return true; // Safe
    else if (count >= 250 && count <= 500)
      return true; // Caution (still considered "safe" boolean)
    else return false; // Unsafe
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.date_sampled) {
        setError("Please select a sampling date");
        setIsSubmitting(false);
        return;
      }

      if (formData.values[0] < 0) {
        setError("Enterococcus count cannot be negative");
        setIsSubmitting(false);
        return;
      }

      // Calculate safety status based on enterococcus count
      const calculatedSafety = calculateSafetyStatus(formData.values[0]);

      const submissionData = {
        id: formData.id,
        code: formData.code,
        enterococcus_count: formData.values[0],
        values: formData.values, // Keep both for compatibility
        date_sampled: formData.date_sampled,
        sampling_frequency: formData.sampling_frequency,
        is_safe: calculatedSafety, // Auto-calculate based on count
      };

      console.log("Submitting data:", submissionData); // Debug log

      // Call the onSave function and wait for it
      await onSave(submissionData);

      // If we reach here, save was successful
      onClose();
    } catch (error) {
      console.error("Error saving beach data:", error);
      setError(error.message || "Failed to save beach data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get safety status color and text for display
  const getSafetyDisplay = (count) => {
    if (count < 250) return { color: "text-green-600", text: "Safe" };
    else if (count >= 250 && count <= 500)
      return { color: "text-yellow-600", text: "Caution" };
    else return { color: "text-red-600", text: "Unsafe" };
  };

  const safetyDisplay = getSafetyDisplay(formData.values[0]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Beach Reading
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Beach Code
              </label>
              <input
                type="text"
                readOnly
                value={formData.code}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enterococcus Count (cfu/100ml)
              </label>
              <input
                type="number"
                name="enterococcus_count"
                value={formData.values[0]}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
                required
              />
              <div className="mt-1 text-xs">
                Status:{" "}
                <span className={`font-semibold ${safetyDisplay.color}`}>
                  {safetyDisplay.text}
                </span>
                <span className="text-gray-500 ml-2">
                  (Safe: &lt;250, Caution: 250-500, Unsafe: &gt;500)
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Sampling Date
              </label>
              <input
                type="date"
                name="date_sampled"
                value={formData.date_sampled}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Sampling Frequency
              </label>
              <select
                name="sampling_frequency"
                value={formData.sampling_frequency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Daily">Daily</option>
              </select>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

BeachEditModal.propTypes = {
  beach: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default BeachEditModal;

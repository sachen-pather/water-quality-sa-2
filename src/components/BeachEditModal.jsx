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

  useEffect(() => {
    if (beach) {
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

    if (name === "enterococcus_count") {
      setFormData((prev) => ({
        ...prev,
        values: [parseFloat(value) || 0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      enterococcus_count: formData.values[0], // Add this field for the backend
    };
    onSave(submissionData);
  };

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
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_safe"
                  checked={formData.is_safe}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700 text-sm font-bold">
                  Water is safe for swimming
                </span>
              </label>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
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

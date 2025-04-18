/**
 * Format a date string without seconds
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "Unknown";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(dateString).toLocaleString(undefined, options);
};

/**
 * Get CSS class for water quality status
 * @param {string} quality - The water quality status
 * @returns {string} CSS class for text color
 */
export const getWaterQualityColor = (quality) => {
  switch (quality) {
    case "Excellent":
    case "Good":
    case true:
      return "text-green-500";
    case "Sufficient":
      return "text-yellow-500";
    case "Poor":
    case false:
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

/**
 * Get water quality description based on status
 * @param {string} quality - The water quality status
 * @returns {string} Description of the water quality
 */
export const getWaterQualityDescription = (quality) => {
  switch (quality) {
    case "Excellent":
    case "Good":
    case true:
      return "This beach is safe to swim in. The water quality is good for your health.";
    case "Sufficient":
      return "This beach is generally safe, but caution is advised. The water quality is acceptable.";
    case "Poor":
    case false:
      return "This beach is unsafe to swim in due to pollution. The water quality is affected.";
    default:
      return "Water quality information is not available for this beach.";
  }
};

/**
 * Convert a beach name to URL-friendly format
 * @param {string} name - The beach name
 * @returns {string} URL-friendly beach name
 */
export const beachNameToUrl = (name) => {
  if (!name) return "";
  return name.toLowerCase().replace(/\s+/g, "-");
};

/**
 * Convert a URL-friendly beach name back to display format
 * @param {string} urlName - The URL-friendly beach name
 * @returns {string} Human-readable beach name
 */
export const urlToBeachName = (urlName) => {
  if (!urlName) return "";
  return urlName
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

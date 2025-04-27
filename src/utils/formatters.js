/**
 * Format a date string into a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "Unknown";

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date Error";
  }
};

/**
 * Get CSS class for water quality status
 */
export const getWaterQualityColor = (quality) => {
  if (quality === 1) return "text-green-500";
  if (quality === 0) return "text-red-500";

  // Handle string values as fallback
  switch (quality) {
    case "Excellent":
    case "Good":
    case "Safe":
      return "text-green-500";
    case "Sufficient":
      return "text-yellow-500";
    case "Poor":
    case "Unsafe":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

/**
 * Get water quality description based on status
 */
export const getWaterQualityDescription = (quality) => {
  if (quality === 1) return "This beach is safe to swim in.";
  if (quality === 0)
    return "This beach is unsafe to swim in due to pollution. The water quality is affected.";

  // String values as fallback
  switch (quality) {
    case "Excellent":
    case "Good":
    case "Safe":
      return "This beach is safe to swim in.";
    case "Sufficient":
      return "This beach is generally safe, but caution is advised. The water quality is acceptable.";
    case "Poor":
    case "Unsafe":
      return "This beach is unsafe to swim in due to pollution. The water quality is affected.";
    default:
      return "Water quality information is not available for this beach.";
  }
};

/**
 * Formats enterococcus count with appropriate units
 * @param {number|string} count - Enterococcus count value
 * @returns {string} Formatted count with units
 */
export const formatEnterococcusCount = (count) => {
  if (count === null || count === undefined || count === "") return "N/A";

  // Format as number with cfu/100ml units
  return `${count} cfu/100ml`;
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

/**
 * Determines if enterococcus count indicates safe water quality
 * @param {number} count - Enterococcus count value
 * @returns {boolean} Safety status
 */
export const isCountSafe = (count) => {
  // The standard threshold for Enterococcus is typically 104 cfu/100ml
  if (count === null || count === undefined) return null;
  return count <= 104;
};

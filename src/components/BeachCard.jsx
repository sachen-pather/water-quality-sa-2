import PropTypes from "prop-types";
import {
  formatDate,
  getWaterQualityColor,
  getWaterQualityDescription,
} from "@/utils/formatters";

// Beach images array (keeping your original images)
const beachImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1535262412227-85541e910204?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1501950183564-3c8b915a5c74?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1528150230181-99bbf7b22162?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1536759808958-bccfbc1ec1d2?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&h=300&fit=crop",
];

// Get a random beach image or use the provided one
const getBeachImage = (image, code) => {
  if (image) return image;

  // Use a consistent image based on beach code for each beach
  if (code) {
    const hashCode = code.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const index = Math.abs(hashCode) % beachImages.length;
    return beachImages[index];
  }

  return beachImages[Math.floor(Math.random() * beachImages.length)];
};

// Function to determine safety status based on enterococcus count
const getSafetyStatus = (beach, providedWaterQuality) => {
  // If water quality is explicitly provided as a string, use it
  if (typeof providedWaterQuality === "string") {
    return providedWaterQuality;
  }

  // If beach has values, determine status based on enterococcus count
  if (beach.values && beach.values.length > 0) {
    const ecoliCount = beach.values[0];

    if (ecoliCount < 250) {
      return "Safe";
    } else if (ecoliCount >= 250 && ecoliCount <= 500) {
      return "Caution";
    } else if (ecoliCount > 500) {
      return "Unsafe";
    }
  }

  // Fall back to is_safe boolean if available
  if (typeof beach.is_safe === "boolean" || typeof beach.is_safe === "number") {
    return beach.is_safe === true || beach.is_safe === 1 ? "Safe" : "Unsafe";
  }

  // If we still don't have a status
  return "Unknown";
};

// Function to get color class based on safety status
const getStatusColorClass = (status) => {
  switch (status) {
    case "Safe":
      return "text-green-600 font-semibold";
    case "Caution":
      return "text-yellow-600 font-semibold";
    case "Unsafe":
      return "text-red-600 font-semibold";
    default:
      return "text-gray-600";
  }
};

// Function to get safety description based on status
const getSafetyDescription = (status) => {
  switch (status) {
    case "Safe":
      return "This beach is safe for swimming with low E. coli levels (below 250 cfu/100ml).";
    case "Caution":
      return "Swimming at this beach requires caution. E. coli levels are moderate (250-500 cfu/100ml).";
    case "Unsafe":
      return "Swimming is not recommended. E. coli levels are high (above 500 cfu/100ml).";
    default:
      return "Water quality information is not available for this beach.";
  }
};

const BeachCard = ({
  beach,
  onSelect,
  image,
  waterQuality,
  lastSampled,
  enterococcusCount,
}) => {
  // Handle case when beach data might be incomplete
  if (!beach || typeof beach !== "object") {
    return null;
  }

  // Generate a unique key for this beach card
  const beachId = beach.id || `beach-${beach.code || ""}`;

  // Determine safety status
  const safetyStatus = getSafetyStatus(beach, waterQuality);

  // Get color class for status
  const statusColorClass = getStatusColorClass(safetyStatus);

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect(beach)}
      key={beachId}
    >
      <div className="w-full h-48 bg-gray-200 overflow-hidden">
        <img
          src={getBeachImage(image, beach.code)}
          alt={beach.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = beachImages[0];
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{beach.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {beach.location || "Cape Town"}
        </p>

        <div className="mt-3 space-y-2">
          <div>
            <span className="font-semibold text-sm">Status: </span>
            <span className={statusColorClass}>{safetyStatus}</span>
          </div>

          <div>
            <span className="font-semibold text-sm">Last Sampled: </span>
            <span className="text-sm text-gray-700">
              {lastSampled ||
                (beach.date_sampled
                  ? formatDate(beach.date_sampled)
                  : "Unknown")}
            </span>
          </div>

          <div>
            <span className="font-semibold text-sm">E. coli: </span>
            <span className="text-sm text-gray-700">
              {enterococcusCount ||
                (beach.values && beach.values.length > 0
                  ? `${beach.values[0]} cfu/100ml`
                  : "N/A")}
            </span>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          {getSafetyDescription(safetyStatus)}
        </p>
      </div>
    </div>
  );
};

BeachCard.propTypes = {
  beach: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    code: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    coordinates: PropTypes.array,
    date_sampled: PropTypes.string,
    values: PropTypes.array,
    is_safe: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    sampling_frequency: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  image: PropTypes.string,
  waterQuality: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  lastSampled: PropTypes.string,
  enterococcusCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default BeachCard;

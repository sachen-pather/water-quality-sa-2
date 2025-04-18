import PropTypes from "prop-types";
import {
  getWaterQualityColor,
  getWaterQualityDescription,
} from "@/utils/formatters";

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
const getBeachImage = (image) => {
  if (image) return image;
  return beachImages[Math.floor(Math.random() * beachImages.length)];
};

const BeachCard = ({ beach, onSelect, image, waterQuality }) => {
  return (
    <div className="beach-card" onClick={() => onSelect(beach)}>
      <div className="w-full h-48 bg-gray-200 overflow-hidden">
        <img
          src={getBeachImage(image)}
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
          {beach.address || beach.location}
        </p>
        <span className={`${getWaterQualityColor(waterQuality)} font-medium`}>
          {waterQuality === true
            ? "Safe"
            : waterQuality === false
            ? "Unsafe"
            : waterQuality || "Unknown"}
        </span>
        <p className="mt-2 text-sm text-gray-600">
          {getWaterQualityDescription(waterQuality)}
        </p>
      </div>
    </div>
  );
};

BeachCard.propTypes = {
  beach: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string,
    location: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  image: PropTypes.string,
  waterQuality: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default BeachCard;

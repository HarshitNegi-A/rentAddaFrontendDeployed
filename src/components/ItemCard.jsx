import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  if (!item) return null;

  // ✅ Use Cloudinary URL directly
  const imageUrl = item.image
    ? item.image
    : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <Link
      to={`/items/${item.id}`}
      className="
        block bg-white rounded-xl shadow-md border 
        hover:shadow-xl hover:border-blue-400 transition duration-300
        overflow-hidden group
      "
    >
      {/* ✅ Image Section */}
      <div className="w-full h-48 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.title}
          className="
            w-full h-full object-cover 
            group-hover:scale-110 transition-transform duration-300
          "
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
      </div>

      {/* ✅ Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {item.title}
        </h3>

        <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-md">
          {item.category || "General"}
        </span>

        <p className="mt-3 text-xl font-bold text-gray-900">
          ₹{item.pricePerDay}
          <span className="text-sm text-gray-500 font-normal"> / day</span>
        </p>

        <p className="text-xs text-gray-500 mt-1">
          Owner: {item.User?.name || "Unknown"}
        </p>

        <span className="mt-3 inline-block text-blue-600 font-medium text-sm group-hover:underline">
          View Details →
        </span>
      </div>
    </Link>
  );
};

export default ItemCard;

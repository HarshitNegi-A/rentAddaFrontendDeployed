import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// ✅ API for local or production
const API ="https://rentaddabackenddeployed.up.railway.app"

const ItemDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Decode user ID from JWT
  const getUserIdFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const loggedInUserId = getUserIdFromToken();

  // ✅ Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${API}/items/${id}`);
        setItem(res.data.item);
      } catch (err) {
        console.error("Item fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!item) return <p className="p-6">Item not found</p>;

  // ✅ Use Cloudinary URL directly
  const imageUrl = item.image
    ? item.image
    : "https://via.placeholder.com/400x300?text=No+Image";

  // ✅ Booking Logic
  const bookNow = async () => {
    try {
      await axios.post(
        `${API}/bookings`,
        { itemId: item.id, startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Booking successful!");
      navigate("/my-bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const isOwner = loggedInUserId === item.User?.id;

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* ✅ Hero Image */}
      <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl bg-gray-200">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />

        <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow">
          {item.category}
        </span>
      </div>

      {/* ✅ Title + Owner */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>

        <p className="text-gray-600 text-sm mt-2 sm:mt-0">
          Owner: <span className="font-semibold">{item.User?.name}</span>
        </p>
      </div>

      {/* ✅ Description */}
      <p className="mt-4 text-gray-700 leading-relaxed text-lg">
        {item.description}
      </p>

      {/* ✅ Price */}
      <div className="mt-6 bg-white p-5 rounded-xl shadow-lg border">
        <p className="text-2xl font-bold text-gray-900">
          ₹{item.pricePerDay}
          <span className="text-sm font-normal text-gray-500"> / day</span>
        </p>
      </div>

      {/* ✅ If Owner */}
      {isOwner ? (
        <div className="mt-8 bg-yellow-100 border border-yellow-300 p-6 rounded-xl shadow">
          <p className="text-yellow-800 font-semibold text-lg">
            ✅ This is your item. You cannot book it.
          </p>
          <button
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => navigate(`/edit-item/${item.id}`)}
          >
            Edit Item
          </button>
        </div>
      ) : (
        <>
          {/* ✅ Booking Section */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Book Now
            </h3>

            <div className="flex flex-col sm:flex-row gap-4">

              <div className="flex-1">
                <label className="block mb-1 text-gray-600 font-medium">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label className="block mb-1 text-gray-600 font-medium">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* ✅ Booking Button or Sign Up */}
            {token ? (
              <button
                onClick={bookNow}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Confirm Booking
              </button>
            ) : (
              <Link to="/signup">
                <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md">
                  Sign up to book
                </button>
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ItemDetails;

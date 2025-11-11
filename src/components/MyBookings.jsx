import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MyBookings = () => {
  // ✅ Backend base URL
  const API_BASE ="https://rentaddabackenddeployed.up.railway.app"

  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const loadBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/bookings/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(res.data.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [token]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (bookings.length === 0)
    return (
      <p className="p-6 text-gray-600 text-center">
        You have no bookings yet.
      </p>
    );

  // ✅ Status Badge
  const statusBadge = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
      case "pending":
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">My Bookings</h2>

      <div className="space-y-5">
        {bookings.map((b) => {
          const imgUrl = b.Item?.image
            ? `${API_BASE}/uploads/${b.Item.image}`
            : "https://via.placeholder.com/200x150?text=No+Image";

          return (
            <div
              key={b.id}
              className="flex flex-col sm:flex-row gap-4 bg-white shadow-lg p-5 rounded-xl border"
            >
              {/* ✅ Image */}
              <div className="w-full sm:w-40 h-32 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imgUrl}
                  className="w-full h-full object-cover"
                  alt={b.Item?.title}
                />
              </div>

              {/* ✅ Info */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{b.Item?.title}</h3>

                <p className="text-sm text-gray-700 mt-2">
                  {b.startDate} → {b.endDate}
                </p>

                <p className="font-semibold text-lg mt-2">
                  Total: ₹{b.totalPrice}
                </p>

                <Link
                  to={`/items/${b.itemId}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Item →
                </Link>

                {/* ✅ Chat button only if accepted */}
                {b.status === "accepted" && (
                  <Link
                    to={`/chat/${b.id}`}
                    className="block text-blue-600 mt-2 font-medium hover:underline text-sm"
                  >
                    Open Chat →
                  </Link>
                )}
              </div>

              {/* ✅ Status Badge */}
              <div
                className={`px-3 py-1 text-xs font-semibold rounded-full h-fit ${statusBadge(
                  b.status
                )}`}
              >
                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;

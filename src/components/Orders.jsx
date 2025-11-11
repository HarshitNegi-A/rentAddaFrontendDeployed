import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Orders = () => {
  // ✅ Backend URL variable here
  const API_BASE ="https://rentaddabackenddeployed.up.railway.app"

  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await axios.get(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data.orders);
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(
        `${API_BASE}/orders/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    if (token) loadOrders();
  }, [token]);

  if (orders.length === 0)
    return <p className="p-6">No bookings for your items yet.</p>;

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
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Orders (Bookings on Your Items)</h2>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.bookingId} className="bg-white shadow-md p-5 rounded-xl border">

            <h3 className="text-xl font-semibold">{o.itemTitle}</h3>

            <p className="text-gray-600 text-sm">
              Booked by <b>{o.renterName}</b> ({o.renterEmail})
            </p>

            <p className="mt-1 text-gray-700">
              {o.startDate} → {o.endDate}
            </p>

            <p className="mt-2 font-bold text-lg">₹{o.totalPrice}</p>

            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-3 ${statusBadge(
                o.status
              )}`}
            >
              {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
            </span>

            {/* ✅ Action buttons */}
            {o.status === "pending" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateStatus(o.bookingId, "accepted")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(o.bookingId, "rejected")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}

            {/* ✅ Chat button if accepted */}
            {o.status === "accepted" && (
              <Link
                to={`/chat/${o.bookingId}`}
                className="block text-blue-600 mt-3 text-sm hover:underline"
              >
                Open Chat →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

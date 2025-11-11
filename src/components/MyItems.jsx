import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const MyItems = () => {
  // ✅ Backend API base URL
  const API_BASE = "https://rentaddabackenddeployed-production.up.railway.app"

  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const loadItems = async () => {
    const res = await axios.get(`${API_BASE}/items/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(res.data.items);
  };

  useEffect(() => {
    if (!token) return;
    loadItems();
  }, [token]);

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;

    await axios.delete(`${API_BASE}/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    loadItems();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        My Listed Items
      </h2>

      {items.length === 0 && (
        <p className="text-gray-600 text-center text-lg">
          You haven't listed any items yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div
            key={it.id}
            className="
              bg-white rounded-xl shadow-md border 
              hover:shadow-xl hover:border-blue-400 transition duration-300 
              overflow-hidden
            "
          >
            {/* ✅ Image */}
            <div className="w-full h-48 overflow-hidden bg-gray-100">
              <img
                src={`${API_BASE}/uploads/${it.image}`}
                className="w-full h-full object-cover hover:scale-110 transition duration-500"
              />
            </div>

            {/* ✅ Content */}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 truncate">
                {it.title}
              </h3>

              <p className="mt-1 text-gray-500 text-sm">{it.category}</p>

              <p className="mt-3 text-lg font-bold text-gray-900">
                ₹{it.pricePerDay}
                <span className="text-sm text-gray-500 font-normal">
                  {" "}
                  / day
                </span>
              </p>

              {/* ✅ Action buttons */}
              <div className="flex gap-3 mt-5">
                {/* Edit Button */}
                <button
                  onClick={() => navigate(`/edit-item/${it.id}`)}
                  className="
                    flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white 
                    font-semibold hover:bg-blue-700 transition
                  "
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteItem(it.id)}
                  className="
                    flex-1 px-4 py-2 rounded-lg bg-red-600 text-white 
                    font-semibold hover:bg-red-700 transition
                  "
                >
                  Delete
                </button>
              </div>

              {/* ✅ View Button */}
              <Link
                to={`/items/${it.id}`}
                className="
                  mt-3 inline-block text-blue-600 text-sm font-medium 
                  hover:underline
                "
              >
                View Item →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyItems;

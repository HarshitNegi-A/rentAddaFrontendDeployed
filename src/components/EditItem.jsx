import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EditItem = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Backend base URL
  const API_BASE ="https://rentaddabackenddeployed.up.railway.app"

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    pricePerDay: "",
  });

  const [existingImage, setExistingImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const loadItem = async () => {
      const res = await axios.get(`${API_BASE}/items/${id}`);
      const item = res.data.item;

      setForm({
        title: item.title,
        description: item.description,
        category: item.category,
        pricePerDay: item.pricePerDay,
      });

      setExistingImage(item.image);
    };

    loadItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("category", form.category);
    data.append("pricePerDay", form.pricePerDay);

    if (newImage) {
      data.append("image", newImage);
    }

    await axios.put(`${API_BASE}/items/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/my-items");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Item</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Title</label>
          <input
            name="title"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:ring-2 transition"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Description</label>
          <textarea
            name="description"
            className="w-full border border-gray-300 p-3 rounded-lg h-24 focus:ring-blue-500 focus:ring-2 transition"
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Category</label>
          <select
            name="category"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:ring-2 transition"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Tools">Tools & Equipment</option>
            <option value="Sports">Sports</option>
            <option value="Home Appliances">Home Appliances</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">
            Price Per Day (₹)
          </label>
          <input
            type="number"
            name="pricePerDay"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:ring-2 transition"
            value={form.pricePerDay}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image Section */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">Current Image</label>

          {existingImage && (
            <img
              src={`${API_BASE}/uploads/${existingImage}`}
              alt="current"
              className="w-full h-48 object-cover rounded-lg mb-3 shadow"
            />
          )}

          <label className="block mb-1 font-medium text-gray-600">
            Upload New Image
          </label>
          <input
            type="file"
            name="image"
            className="w-full border border-gray-300 p-2 rounded-lg"
            onChange={handleChange}
            accept="image/*"
          />

          {/* New Image Preview */}
          {preview && (
            <img
              src={preview}
              className="w-full h-48 object-cover rounded-lg mt-3 shadow"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default EditItem;

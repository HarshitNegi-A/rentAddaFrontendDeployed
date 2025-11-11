import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

// ✅ API BASE URL (local or production)
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const AddItem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerDay: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("pricePerDay", formData.pricePerDay);
    data.append("category", formData.category);
    data.append("image", image);

    setLoading(true);

    try {
      const res = await axios.post(`${API}/items`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Item Added Successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        pricePerDay: "",
        category: "",
      });
      setImage(null);
      setPreview(null);

    } catch (err) {
      console.error("UPLOAD FAILED:", err.response?.data || err);
      alert("❌ Unable to add item. Check console.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Add New Item for Rent
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div>
          <label className="block font-medium mb-1 text-gray-600">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border border-gray-300 p-3 rounded-lg"
            placeholder="Ex: DSLR Camera, Study Table..."
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1 text-gray-600">Description</label>
          <textarea
            name="description"
            className="w-full border border-gray-300 p-3 rounded-lg h-24"
            placeholder="Brief item description..."
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-1 text-gray-600">Price Per Day (₹)</label>
          <input
            type="number"
            name="pricePerDay"
            className="w-full border border-gray-300 p-3 rounded-lg"
            placeholder="Ex: 200"
            value={formData.pricePerDay}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1 text-gray-600">Category</label>
          <select
            name="category"
            className="w-full border border-gray-300 p-3 rounded-lg"
            value={formData.category}
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

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1 text-gray-600">Upload Image</label>
          <input
            type="file"
            className="w-full border border-gray-300 p-2 rounded-lg cursor-pointer"
            onChange={handleImageChange}
            accept="image/*"
            required
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 w-full h-48 object-cover rounded-lg shadow-md"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-md 
          ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
        `}
        >
          {loading ? "Uploading..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItem;

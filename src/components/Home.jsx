import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";

const API_BASE = "https://rentaddabackenddeployed-production.up.railway.app"

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // ✅ Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE}/items`, {
        params: { search, category, minPrice, maxPrice, sort },
      });
      setItems(res.data.items || []);
    } catch (error) {
      setErr("Failed to load items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, category, minPrice, maxPrice, sort]);

  if (loading) return <p className="p-6">Loading items…</p>;
  if (err) return <p className="p-6 text-red-600">{err}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ✅ Catchy Hero Line */}
      <div className="text-center mb-10">
        <p className="text-2xl font-semibold text-gray-800">
          Rent What You Need. Earn from What You Don’t.
        </p>
        <p className="text-gray-600 mt-1">
          Find items near you — save money, reduce waste, and earn by sharing.
        </p>
      </div>

      {/* ✅ Search + Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-8 flex flex-wrap gap-4 items-center">

        {/* Search */}
        <input
          type="text"
          placeholder="Search items..."
          className="border p-2 rounded-md flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category */}
        <select
          className="border p-2 rounded-md"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Furniture">Furniture</option>
          <option value="Tools">Tools</option>
          <option value="Sports">Sports</option>
        </select>

        {/* Min price */}
        <input
          type="number"
          className="border p-2 rounded-md w-28"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        {/* Max price */}
        <input
          type="number"
          className="border p-2 rounded-md w-28"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        {/* Sort */}
        <select
          className="border p-2 rounded-md"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: Low → High</option>
          <option value="priceDesc">Price: High → Low</option>
        </select>
      </div>

      {/* ✅ Items Grid */}
      {items.length === 0 ? (
        <p className="text-center text-gray-600">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <ItemCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

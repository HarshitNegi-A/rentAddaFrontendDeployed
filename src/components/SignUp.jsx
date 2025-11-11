import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SignUp = () => {
  const API_BASE = "https://rentaddabackenddeployed.up.railway.app"


  const [login, setLogin] = useState(false); // false = signup | true = login
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { loginAuth } = useContext(AuthContext);
  const navi = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = login ? "login" : "signup";

      // ✅ Use API_BASE instead of localhost
      const res = await axios.post(`${API_BASE}/${endpoint}`, form);

      loginAuth(res.data.token, res.data.userName, res.data.userId);
      navi("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          {login ? "Welcome Back!" : "Create Your RentAdda Account"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {!login && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                required={!login}
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
          >
            {login ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          {login ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => setLogin(!login)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {login ? "Create an account" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

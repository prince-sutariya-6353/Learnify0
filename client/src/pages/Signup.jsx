import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/signup`, form);
      alert("Signup successful! Please login now.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">📝 Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2 mb-3 w-full rounded"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 mb-3 w-full rounded"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full rounded"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Signup
        </button>
        <p
          className="text-center text-sm text-gray-500 mt-4 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}

export default Signup;

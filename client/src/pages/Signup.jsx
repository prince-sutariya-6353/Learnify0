import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup`, // ✅ Correct route
        form
      );
      alert("Signup successful! You can now login.");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-80"
    >
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        className="border p-2 mb-3 w-full rounded"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border p-2 mb-3 w-full rounded"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border p-2 mb-3 w-full rounded"
        onChange={handleChange}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Signup
      </button>
    </form>
  );
}

export default Signup;

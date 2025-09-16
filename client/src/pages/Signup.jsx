// src/page/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

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
      alert(err.response?.data?.msg || err.response?.data?.message || "Error");
    }
  };

  // NEW: handle google credential (id_token) returned by Google
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const id_token = credentialResponse?.credential;
      if (!id_token) return alert("Google login failed");

      const res = await axios.post(`${backendUrl}/google-login`, { id_token });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        alert("Signed up / logged in with Google!");
        navigate("/preview");
      } else {
        alert("Google login failed on server");
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert(err.response?.data?.message || "Google auth error");
    }
  };

  const handleGoogleError = () => {
    alert("Google Sign-In failed. Try again.");
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
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 mb-3"
        >
          Signup
        </button>

        <div className="text-center text-sm text-gray-500 mb-3">or</div>

        {/* Google button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

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

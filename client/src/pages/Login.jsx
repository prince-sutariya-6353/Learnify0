// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // ✅ Google Sign-In setup
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleLoad = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("g_id_signin"),
        { theme: "outline", size: "large", width: "100%" }
      );
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = handleLoad;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ✅ Handle Google login response
  async function handleGoogleResponse(response) {
    try {
      const res = await axios.post(
        `${backendUrl}/api/auth/google`,
        { credential: response.credential },
        { withCredentials: true }
      );

      if (res.data.user) {
        localStorage.setItem("token", res.data.token || "google-cookie");
        setIsAuthenticated(true);
        alert(`Welcome, ${res.data.user.name} 🎉`);
        navigate("/preview");
      }
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed ❌");
    }
  }

  // ✅ Handle email/password login
  const handleLogin = async () => {
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.msg || data.error || "Login failed ❌");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        alert("Login success ✅");
        navigate("/preview");
      } else {
        alert("Login failed: no token returned ❌");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">🔑 Login</h2>

        {/* Email/Password Login */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {/* Divider */}
        <div className="my-4 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-sm text-gray-500">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Sign-In Button */}
        <div id="g_id_signin" className="flex justify-center" />

        {/* Signup link */}
        <p
          className="text-center text-sm text-gray-500 mt-4 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Don't have an account? Signup
        </p>
      </div>
    </div>
  );
}

export default Login;

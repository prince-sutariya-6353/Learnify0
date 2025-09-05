import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Preview from "./pages/Preview";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <Routes>
      {/* Default → Signup */}
      <Route path="/" element={<Navigate to="/signup" />} />

      {/* Signup Page */}
      <Route path="/signup" element={<Signup />} />

      {/* Login Page */}
      <Route
        path="/login"
        element={<Login setIsAuthenticated={setIsAuthenticated} />}
      />

      {/* Protected Upload & Preview */}
      <Route
        path="/preview"
        element={
          isAuthenticated ? <Preview /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;

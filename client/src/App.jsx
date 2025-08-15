import React from 'react'
import { useEffect, useState } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="p-10 text-center text-xl">
      <h1>Frontend + Backend Connection</h1>
      <p>Message from Backend: <strong>{message}</strong></p>
    </div>
  );
}

export default App;



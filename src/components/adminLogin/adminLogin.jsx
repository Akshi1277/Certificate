"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock } from "react-icons/fa";

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      router.push("/admin/create-certificate");
    } catch (err) {
      setError("Server error. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#3a1247] p-4">
      <div className="bg-[#241246] p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-red-300 text-center mb-6">Admin Login</h1>
        {error && (
          <p className="text-[#F34213] bg-red-900 bg-opacity-30 p-2 rounded text-center mb-4 animate-pulse">
            {error}
          </p>
        )}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-4 text-[#E0CA3C]" />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 pl-10 bg-[#3e136f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0CA3C]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-4 text-[#E0CA3C]" />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 pl-10 bg-[#321356] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0CA3C]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full p-3 bg-pink-900 hover:bg-red-950 text-white font-bold rounded-lg transition flex items-center justify-center"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;

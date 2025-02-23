"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AdminCreateCertificate = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [course, setCourse] = useState("Full Stack Developer");
  const [loading, setLoading] = useState(false);

  const formatDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    return dateObj.toLocaleDateString("en-GB"); // Converts to DD/MM/YYYY format
  };

  const handleGenerateCertificate = async () => {
    if (!name || !date || !course) {
      alert("Please enter all details!");
      return;
    }
  
    setLoading(true);
    const certificateId = Date.now().toString(); // Generate unique ID
  
    try {
      const response = await fetch("http://localhost:5000/api/certificates/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          certificateId,
          course,
          date: formatDate(date), // Send formatted date
          fileUrls: {
            png: `/certificates/${certificateId}.png`,
            pdf: `/certificates/${certificateId}.pdf`,
          },
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Certificate created successfully!");
        setTimeout(() => {
          router.push("/admin/certificates"); // Redirect to admin certificates page
        }, 1500);
      } else {
        alert(data.message || "Error creating certificate");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create certificate");
    }
  
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3a1247] text-white">
      <div className="w-full max-w-lg p-8 bg-[#241246]  rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-300 ">Create Certificate</h1>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter Name"
          className="w-full p-3 rounded-md bg-[#321356] text-white mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Date Input */}
        <input
          type="date"
          className="w-full p-3 rounded-md bg-[#321356] text-white mb-4"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Course Dropdown */}
        <select
          className="w-full p-3 rounded-md bg-[#321356] hover:bg- text-white mb-4"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="Digital Marketing">Digital Marketing</option>
        </select>

        {/* Generate Button */}
        <button
          onClick={handleGenerateCertificate}
          className="w-full bg-pink-950 hover:bg-red-900 text-white font-bold py-3 rounded-md transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Certificate"}
        </button>
      </div>
    </div>
  );
};

export default AdminCreateCertificate;

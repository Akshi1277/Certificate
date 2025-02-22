'use client';

import { useState } from "react";

const UserCertificate = () => {
  const [username, setUsername] = useState("");
  const [uniqueKey, setUniqueKey] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState(null);

  const handleAccessCertificate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/certificates/${uniqueKey}`);
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.certificate.username.toLowerCase() === username.toLowerCase()) {
          setCertificate(data.certificate);
          setError(null);
        } else {
          setError("Invalid username or certificate key. Please try again.");
          setCertificate(null);
        }
      } else {
        setError(data.message || "Certificate not found.");
        setCertificate(null);
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      setError("Failed to fetch certificate. Please try again.");
      setCertificate(null);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-purple-400 text-center mb-6">Access Your Certificate</h1>

        <input
          type="text"
          placeholder="Enter your username"
          className="bg-gray-700 text-white p-3 w-full mb-3 rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your certificate key"
          className="bg-gray-700 text-white p-3 w-full mb-3 rounded-lg"
          value={uniqueKey}
          onChange={(e) => setUniqueKey(e.target.value)}
        />
        <button
          onClick={handleAccessCertificate}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full hover:bg-purple-800 transition duration-300"
        >
          View Certificate
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {certificate && (
          <div className="mt-6 text-center bg-gray-700 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-400 mb-2">{certificate.username}</h2>
            <p className="text-gray-300">{certificate.course}</p>
            <p className="text-gray-400 text-sm">Certificate ID: {certificate.certificateId}</p>

            <div className="mt-4">
            
              <a
                href={certificate.fileUrls.png}
                download
                className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Download PNG
              </a>
              <a
                href={certificate.fileUrls.pdf}
                download
                className="mt-4 ml-2 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Download PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCertificate;

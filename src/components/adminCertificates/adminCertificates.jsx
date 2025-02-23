"use client";

import { useState, useEffect } from "react";

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/certificates/all");
        const data = await response.json();
        if (data.success) {
          setCertificates(data.certificates);
        } else {
          console.error("Error fetching certificates:", data.message);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#321356]  text-white">
      <div className="w-full max-w-4xl p-8 bg-[#321356]  rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">View Certificates</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading certificates...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700 text-gray-300">
                  <th className="p-3">Name</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Unique Key</th>
                  <th className="p-3">Download</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, index) => (
                  <tr key={index} className="text-center border-b border-gray-700 hover:bg-gray-600 transition">
                    <td className="p-3">{cert.username}</td>
                    <td className="p-3">{cert.course}</td>
                    <td className="p-3">{cert.certificateId}</td>
                    <td className="p-3">
                    <a
                       href={cert.fileUrls?.pdf ? `http://localhost:5000${cert.fileUrls.pdf}` : "#"}
                                download
                                className="bg-blue-500 hover:bg-blue-600 px-2 py-0.5 rounded-md mr-4"
                          >
                               Download PDF
                    </a>

                    <a
                             href={cert.fileUrls?.png ? `http://localhost:5000${cert.fileUrls.png}` : "#"}
                            download
                                className="bg-blue-500 hover:bg-blue-600 px-2 py-0.5 rounded-md mr-4"
                                >
                                      Download PNG
                        </a>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCertificates;

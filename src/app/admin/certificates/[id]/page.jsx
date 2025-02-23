"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const CertificatePage = () => {
  const { id: certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!certificateId) return;

    const fetchCertificate = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/certificates/${certificateId}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setCertificate(data.certificate);
        } else {
          setError(data.message || "Certificate not found.");
        }
      } catch (err) {
        setError("Failed to fetch certificate.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#321356]  text-white p-8">
      <div className="w-full max-w-2xl p-8 bg-white text-gray-900 rounded-lg shadow-xl border-4 border-gray-300 text-center">
        <h1 className="text-4xl font-bold text-blue-600">Certificate of Completion</h1>
        <p className="mt-4 text-xl">This is to certify that</p>
        <h2 className="text-3xl font-semibold text-gray-800 mt-2">{certificate?.username}</h2>
        <p className="mt-4 text-lg">has successfully completed the course</p>
        <h3 className="text-2xl font-medium text-gray-700 mt-2">{certificate?.course}</h3>
        <p className="mt-4 text-lg">on</p>
        <h3 className="text-xl font-medium text-gray-700">{certificate?.date || "N/A"}</h3>

        <p className="mt-6 text-lg font-semibold text-gray-600">Certificate ID: {certificate?.certificateId}</p>

        <div className="mt-8 flex justify-between px-8">
          <div className="text-left">
            <p className="font-semibold">Instructor</p>
            <div className="border-t border-gray-700 w-40 mt-2"></div>
          </div>
          <div className="text-right">
            <p className="font-semibold">Authorized Signature</p>
            <div className="border-t border-gray-700 w-40 mt-2"></div>
          </div>
        </div>

        <button
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.print()}
        >
          Print Certificate
        </button>
      </div>
    </div>
  );
};

export default CertificatePage;

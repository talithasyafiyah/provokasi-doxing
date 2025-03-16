import React, { useState } from "react";
import axios from "axios";

function LandingPage() {
  const [sentence, setSentence] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // mencegah reload halaman
    setLoading(true);
    try {
      const response = await axios.post("http://194.163.40.96/identification", {
        text: sentence,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Terjadi kesalahan saat identifikasi" });
    }
    setLoading(false);
  };

  return (
    <div className="overflow-x-hidden">
      <div className="container my-20 mx-auto">
        <h1 className="text-2xl font-bold">User Input</h1>
        <p className="text-base font-medium mt-4">
          Masukkan kalimat untuk mengidentifikasi.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex mt-4 space-x-4 items-center relative">
            <textarea
              id="sentence"
              name="sentence"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ketik di sini..."
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="bg-[#71B8BA] w-48 px-4 py-3.5 text-white text-base font-medium rounded-lg hover:bg-[#5A9395] cursor-pointer absolute bottom-2 right-8"
            >
              Identifikasi
            </button>
          </div>
        </form>
        {loading && <p className="mt-4">Memproses...</p>}
        {result && (
          <div className="mt-4">
            {result.classification === "Non-Provokasi" ? (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Kalimat yang diinputkan tidak mengandung
                    <a
                      href="#"
                      className="font-bold italic text-green-700 hover:text-green-600"
                    >
                      {" "}
                      Provokasi Doxing
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Kalimat yang diinputkan mengandung
                      <a
                        href="#"
                        className="font-bold italic text-red-700 hover:text-red-600"
                      >
                        {" "}
                        {result.classification}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;

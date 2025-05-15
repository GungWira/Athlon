import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronDown, Activity } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [sport, setSport] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (city && city !== "Pilih Kota") params.append("city", city);
    if (sport && sport !== "Pilih Olah Raga") params.append("sport", sport);

    navigate(`/search?${params.toString()}`);
  };

  const isSearchDisabled =
    !name &&
    (!city || city === "Pilih Kota") &&
    (!sport || sport === "Pilih Olah Raga");

  return (
    <section className="relative overflow-hidden mt-8 rounded-xl bg-indigo-600">
      <div className="py-20 relative z-10">
        <div className="text-center text-white mb-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Going Sport Today?
          </h2>
          <p className="text-base opacity-80 mt-4">
            Temukan berbagai jenis fasilitas olahraga terbaik untuk dirimu hanya
            di Athlon!
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl px-6 py-4 shadow-2xl max-w-2xl lg:max-w-4xl mx-auto flex flex-row justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Input Nama */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama"
                className="pl-10 pr-4 py-2 w-full border border-[#202020]/40 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full border border-[#202020]/40 cursor-pointer rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  city === "" ? "text-gray-500" : "text-[#202020]"
                }`}
              >
                <option>Pilih Kota</option>
                <option>Denpasar</option>
                <option>Jakarta</option>
                <option>Surabaya</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* Select Olahraga */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full border border-[#202020]/40 cursor-pointer  rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${sport == "" ? "text-gray-500" : "text-[#202020]"}`}
              >
                <option>Pilih Olah Raga</option>
                <option>Badminton</option>
                <option>Tennis</option>
                <option>Soccer</option>
                <option>Voli</option>
                <option>Sepak bola</option>
                <option>Renang</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          {/* Tombol Cari */}
          <button
            disabled={isSearchDisabled}
            onClick={handleSearch}
            className={`bg-indigo-600 text-sm cursor-pointer hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex justify-center items-center`}
          >
            <Search className="h-5 w-5 mr-2" />
            Cari Sekarang
          </button>
          </div>
          
        </div>
      </div>
      {/* ORNAMENT */}
      <div className="absolute w-full h-full top-0 left-0">
        <img
          src="/hero-orn-1.webp"
          alt=""
          className="h-[60%] absolute bottom-0 left-0"
        />
        <img
          src="/hero-orn-2.webp"
          alt=""
          className="h-[60%] absolute top-0 right-0"
        />
        <img
          src="/hero-orn-3.webp"
          alt=""
          className="h-full absolute top-0 left-0"
        />
        <img
          src="/hero-orn-3.webp"
          alt=""
          className="h-full absolute top-0 right-0"
        />
      </div>
    </section>
  );
}

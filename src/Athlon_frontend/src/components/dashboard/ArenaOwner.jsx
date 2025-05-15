import React, { useEffect, useState } from "react";
import { CardArena } from "../home/CardArena";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function ArenaOwner({ datas, userData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArenas, setFilteredArenas] = useState(datas.arenas || []);

  useEffect(() => {
    if (datas) {
      setFilteredArenas(datas.arenas);
    }
  }, [datas]);

  useEffect(() => {
    const filtered = datas.arenas.filter((arena) =>
      arena.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArenas(filtered);
  }, [searchQuery, datas.arenas]);

  return (
    <div className="w-full flex flex-col justify-start items-start gap-6">
      <div className="flex flex-col justify-start items-start gap-2">
        <h1 className="text-xl text-[#202020]/95">
          Hi, <span className="font-bold">{userData.username}👋</span>
        </h1>
        <p className="text-base text-[#202020]/70">
          Lihat daftar arena olahraga yang kamu miliki disini!
        </p>
      </div>
      <div className="flex flex-col justify-start items-start gap-3 w-full">
        <div className="w-full overflow-hidden rounded-xl bg-indigo-600 px-8 py-6 relative flex flex-col justify-start items-start gap-2">
          <p className="text-white font-semibold text-xl">Buat Arena</p>
          <p className="text-white opacity-80 text-base">
            Kelola lapangan, atur harga, dan pantau semua dalam <br /> satu
            dashboard.
          </p>
          <Link
            to={"/owner/create-arena"}
            className="px-7 mt-2 cursor-pointer hover:bg-slate-50 py-2 rounded-md text-indigo-600 bg-white font-semibold"
          >
            Buat Arena
          </Link>
          <img
            src="hero-orn-2.webp"
            alt="orn"
            className="absolute -top-1 -right-1 h-[90%]"
          />
        </div>
      </div>
      <div className="flex flex-col justify-start items-start gap-3 w-full">
        <p className="text-base text-[#202020] font-semibold">List Arena</p>
        {/* SEARCHBAR */}
        <div className="w-full border border-[#202020]/20 rounded-md px-4 py-3 flex flex-row justify-start items-center gap-3">
          <Search className="w-5 text-[#202020]/60" />
          <input
            type="text"
            className="font-base text-[#202020]/90 w-full outline-0"
            placeholder="Cari arena disini..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* BOX CARD */}
        {filteredArenas.length == 0 ? (
          <div className="w-full px-4 py-5 aspect-video flex justify-center items-center gap-2 flex-col">
            <img src="/character-2.webp" alt="character img" className="w-64" />
            <p className="text-lg font-bold text-[#202020] text-center mt-5">
              Arena Tidak Ditemukan
            </p>
            <p className="text-sm text-[#202020]/70 text-center">
              Yah belum ada nama arena yang sesuai dengan kata kunci yang kamu
              input nih! Yuk buat arena sekarang juga!
            </p>
            <Link
              to={"/owner/create-arena"}
              className="text-[#202020]/60 border border-[#202020]/30 px-8 py-2 rounded-full mt-4"
            >
              Buat Arena
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 justify-start items-start">
            {filteredArenas.map((arena) => (
              <CardArena
                key={arena.id}
                isOwner={true}
                id={arena.id}
                image={arena.images[0]}
                name={arena.name}
                location={arena.province}
                price={0}
                description={arena.description}
                tag={arena.sports}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

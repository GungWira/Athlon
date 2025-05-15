import { Check } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function Premium() {
  return (
    <div className="w-full max-w-6xl flex flex-col justify-start items-start gap-6 mt-8">
      <div className="flex flex-row justify-between items-center gap-8">
        <div className="flex flex-col justify-start items-start gap-3">
          <p className="text-[#202020]/95 text-3xl font-semibold">
            Buat Lebih Banyak, Jangkau Lebih Luas!
          </p>
          <p className="text-[#202020]/70 text-base max-w-[70%]">
            Tingkatkan akun kamu ke Premium dan nikmati kebebasan mengelola
            lebih banyak arena tanpa batas.Boost postingan kamu dan tarik lebih
            banyak penyewa setiap hari.
          </p>
        </div>
        <Link to={-1}>✕</Link>
      </div>

      <div className="w-full grid grid-cols-2 flex-row justify-between items-stretch gap-8">
        {/* GRATIS */}
        <div className="px-6 py-5 rounded-xl border border-[#202020]/20 flex flex-col justify-start items-start gap-4">
          <p className="text-[#202020] text-2xl font-semibold">Paket Gratis</p>
          <div className="w-full flex flex-row justify-start items-center gap-2">
            <img src="icp.webp" alt="" className="w-12" />
            <p className="text-[#202020] text-4xl font-bold">0</p>
            <p className="text-[#202020]/40 text-base">/bulan</p>
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <div className="flex flex-row justify-start items-center gap-2">
              <div className="p-1 rounded-full border border-[#202020]/50">
                <Check className="text-[#202020]/50 w-4 h-4" />
              </div>
              <p className="text-base text-[#202020]/70">
                Maksimal menambahkan 1 arena
              </p>
            </div>
            <div className="flex flex-row justify-start items-center gap-2">
              <div className="p-1 rounded-full border border-[#202020]/50">
                <Check className="text-[#202020]/50 w-4 h-4" />
              </div>
              <p className="text-base text-[#202020]/70">
                Maksimal menambahkan 3 lapangan
              </p>
            </div>
            <div className="flex flex-row justify-start items-center gap-2">
              <div className="p-1 rounded-full border border-[#202020]/50">
                <Check className="text-[#202020]/50 w-4 h-4" />
              </div>
              <p className="text-base text-[#202020]/70">
                Publish secara reguler
              </p>
            </div>
          </div>
          <button className="w-full py-2 mt-2 rounded-md border-indigo-600 border-2 text-indigo-600 font-semibold text-base bg-white">
            Sudah Memiliki
          </button>
        </div>
        {/* PREMIUM */}
        <div className="px-6 py-5 rounded-xl border border-[#202020]/20 bg-indigo-600 cursor-pointer hover:bg-indigo-700 flex flex-col justify-start items-start gap-4">
          <p className="text-white text-2xl font-semibold">Paket Gratis</p>
          <div className="w-full flex flex-row justify-start items-center gap-2">
            <img src="icp.webp" alt="" className="w-12" />
            <p className="text-white text-4xl font-bold">0.5</p>
            <p className="text-white/40 text-base">/bulan</p>
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <div className="flex flex-row justify-start items-center gap-2">
              <div className="p-1 rounded-full border border-white/50">
                <Check className="text-white/50 w-4 h-4" />
              </div>
              <p className="text-base text-white/70">
                Menambahkan arena tanpa batas
              </p>
            </div>
            <div className="flex flex-row justify-start items-center gap-2">
              <div className="p-1 rounded-full border border-white/50">
                <Check className="text-white/50 w-4 h-4" />
              </div>
              <p className="text-base text-white/70">
                Menambahkan lapangan tanpa batas
              </p>
            </div>
            <div className="flex flex-row justify-start items-center gap-2">
              <div className="p-1 rounded-full border border-white/50">
                <Check className="text-white/50 w-4 h-4" />
              </div>
              <p className="text-base text-white/70">Boosting Postingan</p>
            </div>
          </div>
          <button className="w-full py-2 mt-2 rounded-md border-indigo-600 border-2 text-indigo-600 font-semibold text-base bg-white">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}

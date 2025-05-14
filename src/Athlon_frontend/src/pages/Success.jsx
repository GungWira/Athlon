import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";

export default function Success() {
  const { userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!userData) {
        navigate("/");
      }
    }
  }, [userData, loading]);

  if (!userData) {
    navigate("/");
    return null;
  }
  if (loading) return <Loading />;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="flex flex-col justify-center items-center gap-2">
          <video
            src="/success.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-32 aspect-square mb-6"
          />
          <p className="font-semibold text-2xl text-[#202020]">
            Pembayaran Berhasil
          </p>
          <p className="text-[#202020]/70 text-base text-center">
            Data booking telah tercatat. Kamu bisa melihat detail lengkap dan
            statusnya melalui halaman dashboard
          </p>
        </div>
        <div className="border w-full  border-[#202020]/20 rounded-md px-8 py-4 grid grid-cols-2 justify-between items-end gap-3">
          {/* NAMA */}
          <p className="text-[#202020]/95">Nama</p>
          <p className="text-[#202020]/95">Wiradarma</p>
          {/* ARENA */}
          <p className="text-[#202020]/95">Arena</p>
          <p className="text-[#202020]/95">Arenaaaa</p>
          {/* LAPANGAN */}
          <p className="text-[#202020]/95">Lapangan</p>
          <p className="text-[#202020]/95">Arenaaaa</p>
          {/* WAKTU */}
          <div className="flex justify-start items-start h-full">
            <p className="text-[#202020]/95">Waktu</p>
          </div>
          <div className="flex flex-col justify-start items-start gap-3">
            <p className="text-[#202020]/95">Arenaaaa</p>
            <p className="text-[#202020]/95">Arenaaaa</p>
          </div>
          {/* TANGGAL */}
          <p className="text-[#202020]/95">Tanggal</p>
          <p className="text-[#202020]/95">Tangalll</p>
          {/* HARGA */}
          <p className="text-[#202020]/95">Harga</p>
          <div className="flex flex-row justify-start items-center gap-2">
            <p className="text-base text-[#202020]/90">1</p>
            <img src="icp.webp" alt="icp" className="w-7" />
            <p className="text-sm text-[#202020]/60 italic">~ Rp 10.000</p>
          </div>
          {/* STATUS */}
          <p className="text-[#202020]/95">Status</p>
          <p className="text-indigo-600 font-medium">Success</p>
        </div>
        <Link
          to={userData.userType == "owner" ? "/owner" : "/dashboard"}
          className="text-white bg-indigo-600 px-8 py-2 rounded-md"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}

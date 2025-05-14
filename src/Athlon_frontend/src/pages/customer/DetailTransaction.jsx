import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PaymentCard from "../../components/payment/PaymentCard";

export default function DetailTransaction() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-col justify-start items-start gap-6 mt-4">
      {/* HEAD */}
      <div className="w-full flex justify-between items-center gap-8">
        <div className="flex flex-col justify-start items-start gap-1">
          <p className="text-[#202020] font-semibold text-2xl">Order Details</p>
          <p className="text-[#202020]/80 text-base">
            Periksa kembali informasi lapangan yang dipilih sebelum melanjutkan
            pembayaran
          </p>
        </div>
        <button onClick={handleBack} className="cursor-pointer">
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="w-full flex flex-row justify-between items-start gap-8">
        <div className="flex flex-col justify-start items-start gap-8 w-full">
          {/* ARENA DETAIL */}
          <div className="flex flex-col justify-start items-start gap-1">
            <p className="text-[#202020]/95 text-lg font-semibold">Judulll</p>
            <p className="text-[#202020]/80 text-base">Lokasii</p>
          </div>
          {/* FIELD DETAIL */}
          <div className="flex flex-col justify-start items-start gap-2 w-full">
            <p className="text-[#202020]/95 text-lg font-semibold">
              Lapangaaann
            </p>
            <div className="flex flex-col justify-start items-start gap-2 w-full">
              <PaymentCard />
              <PaymentCard />
            </div>
          </div>
          {/* ACTION */}
          <div className="flex flex-col justify-start items-start gap-2 w-full">
            <Link to={-1} className="text-base font-semibold text-[#202020]">
              + Tambah Jadwal
            </Link>
          </div>
        </div>
        <div className="w-[50%] bg-indigo-600 rounded-xl px-5 py-6 flex flex-col justify-start items-start gap-5">
          <p className="text-white text-lg font-semibold">Rincian Biaya</p>
          <div className="w-full flex flex-col justify-start items-start gap-1">
            <div className="flex justify-between items-center gap-3 w-full">
              <p className="text-white text-base">Sewa Lapangan</p>
              <p className="text-white text-base flex justify-center items-center gap-1">
                1 <img src="icp.webp" alt="icp" className="w-6" />
              </p>
            </div>
            <div className="flex justify-between items-center gap-3 w-full">
              <p className="text-white text-base">Biaya Layanan</p>
              <p className="text-white text-base flex justify-center items-center gap-1">
                0.005 <img src="icp.webp" alt="icp" className="w-6" />
              </p>
            </div>
          </div>
          <div className="w-full h-[2px] bg-indigo-50/20 rounded-full"></div>
          <div className="flex justify-between items-start gap-3 w-full">
            <p className="text-white text-base">Total Biaya</p>
            <div className="flex flex-col justify-start items-end">
              <p className="text-white text-base flex justify-center items-center gap-1">
                1.005 <img src="icp.webp" alt="icp" className="w-6" />
              </p>
              <p className="text-white text-xs opacity-60">~ Rp 10.000</p>
            </div>
          </div>
          <div className="flex flex-col justify-start gap-2">
            <button className="w-full bg-white text-indigo-600 px-4 py-2 rounded-md cursor-pointer hover:bg-indigo-50 font-medium">
              Bayar Sekarang
            </button>
            <p className="text-white text-sm opacity-60">
              Dengan membayar berarti menyetujui Syarat & Ketentuan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

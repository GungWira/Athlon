import React from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="flex flex-col justify-start items-start gap-4 w-full">
          {/* ARENA DETAIL */}
          <div className="flex flex-col justify-start items-start gap-1">
            <p className="text-[#202020]/95 text-lg font-semibold">Judulll</p>
            <p className="text-[#202020]/80 text-base">Lokasii</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Trash } from "lucide-react";

export default function PaymentCard() {
  return (
    <div className="w-full px-4 py-3 rounded-xl flex justify-between items-center gap-6 border border-indigo-600 bg-indigo-50 hover:bg-indigo-100">
      <div className="flex flex-col justify-start items-start gap-1">
        <p className="text-[#202020] text-base font-medium">
          Senin, 21 Mei 2025 ~ 12:00 - 13:00
        </p>
        <div className="flex flex-row justify-start items-center gap-1">
          <p className="text-base text-[#202020]">1</p>
          <img src="icp.webp" alt="icp" className="w-6" />
          <p className="text-[#202020]/40 text-sm italic">~ Rp 60.000</p>
        </div>
      </div>
      <button className="group cursor-pointer">
        <Trash className="w-8 text-[#202020]/80 group-hover:text-indigo-600" />
      </button>
    </div>
  );
}

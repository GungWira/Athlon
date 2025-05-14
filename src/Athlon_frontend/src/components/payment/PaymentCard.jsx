import { Trash } from "lucide-react";

export default function PaymentCard({ date, time, price, rate }) {
  const formatDate = (dateString) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    const day = dateString.slice(0, 2);
    const month = dateString.slice(2, 4);
    const year = dateString.slice(4);

    const dateObject = new Date(`${year}-${month}-${day}`);
    const dayName = days[dateObject.getDay()];
    const monthName = months[parseInt(month, 10) - 1];

    return `${dayName}, ${day} ${monthName} ${year}`;
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("id-ID").format(number);
  };

  return (
    <div className="w-full px-4 py-3 rounded-xl flex justify-between items-center gap-6 border border-indigo-600 bg-indigo-50 hover:bg-indigo-100">
      <div className="flex flex-col justify-start items-start gap-1">
        <p className="text-[#202020] text-base font-medium">
          {formatDate(date)} ~ {time}
        </p>
        <div className="flex flex-row justify-start items-center gap-1">
          <p className="text-base text-[#202020]">
            {formatNumber(Number(price) / 10000000)}
          </p>
          <img src="icp.webp" alt="icp" className="w-6" />
          <p className="text-[#202020]/40 text-sm italic">
            ~ Rp {formatNumber((Number(price) / 10000000) * rate)}
          </p>
        </div>
      </div>
      <button className="group cursor-pointer">
        <Trash className="w-8 text-[#202020]/80 group-hover:text-indigo-600" />
      </button>
    </div>
  );
}

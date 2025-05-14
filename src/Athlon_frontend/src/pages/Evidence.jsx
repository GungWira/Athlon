import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";

export default function Evidence() {
  const { idBook } = useParams();
  const { userData, loading, actor, icpIdrRate } = useAuth();
  const [datas, setDatas] = useState(null);
  const [process, setProcess] = useState(true);

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

  useEffect(() => {
    if (!loading) {
      const fetchData = async () => {
        setProcess(true);
        try {
          const res = await actor.getBookingById(idBook);
          if (!res) {
            navigate("/");
            return;
          }
          setDatas(res[0]);
        } catch (error) {
          console.error("Error fetching booking data:", error);
          navigate("/");
        } finally {
          setProcess(false);
        }
      };
      fetchData();
    }
  }, [actor, loading]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("id-ID").format(number);
  };

  if (loading) return <Loading />;

  if (process) return <Loading />;

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
            Booking Terkonfirmasi
          </p>
          <p className="text-[#202020]/70 text-base text-center">
            Data booking telah tercatat. Kamu bisa melihat detail lengkap dan
            statusnya melalui halaman dashboard
          </p>
        </div>
        <div className="border w-full  border-[#202020]/20 rounded-md px-8 py-4 grid grid-cols-2 justify-between items-end gap-3">
          {/* NAMA */}
          <p className="text-[#202020]/95">Nama</p>
          <p className="text-[#202020]/95">{datas.customerName}</p>
          {/* ARENA */}
          <p className="text-[#202020]/95">Arena</p>
          <p className="text-[#202020]/95">{datas.arenaName}</p>
          {/* LAPANGAN */}
          <p className="text-[#202020]/95">Lapangan</p>
          <p className="text-[#202020]/95">{datas.fieldName}</p>
          {/* WAKTU */}
          <div className="flex justify-start items-start h-full">
            <p className="text-[#202020]/95">Waktu</p>
          </div>
          <div className="flex flex-col justify-start items-start gap-3">
            {datas.timestamp.map((time, key) => (
              <p key={key} className="text-[#202020]/95">
                {time}
              </p>
            ))}
          </div>
          {/* TANGGAL */}
          <p className="text-[#202020]/95">Tanggal</p>
          <p className="text-[#202020]/95">{formatDate(datas.date)}</p>
          {/* HARGA */}
          <p className="text-[#202020]/95">Harga</p>
          <div className="flex flex-row justify-start items-center gap-2">
            <p className="text-base text-[#202020]/90">
              {Number(datas.totalPrice) / 10000000}
            </p>
            <img src="icp.webp" alt="icp" className="w-7" />
            <p className="text-sm text-[#202020]/60 italic">
              ~ Rp{" "}
              {formatNumber((Number(datas.totalPrice) / 10000000) * icpIdrRate)}
            </p>
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

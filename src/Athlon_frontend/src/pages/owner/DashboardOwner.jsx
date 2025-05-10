import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { LandPlot, LayoutDashboard, NotebookTabs, User } from "lucide-react";

export default function DashboardOwner() {
  const { actor, principal, userData } = useAuth();
  const navigate = useNavigate();
  const [arenas, setArenas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArena = async () => {
      try {
        if (actor) {
          const result = await actor.getDashboardOwner(principal);
          if (result) {
            setArenas(result.ok);
          } else {
            setArenas([]);
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArena();
  }, [actor]);

  if (loading && !arenas) return <Loading />;

  return (
    <div className="flex flex-row justify-start items-start gap-6 mt-4">
      {/* NAVIGATION */}
      <div className="flex flex-col px-4 py-6 rounded-xl border border-[#202020]/20 w-full max-w-xs">
        <h1 className="text-md font-semibold text-[#202020]">
          Dashboard Owner
        </h1>
        <div className="flex flex-col justify-start items-start gap-4 mt-4 px-1">
          <div className="flex flex-row justify-start items-center gap-3 cursor-pointer group">
            <LayoutDashboard className="text-[#202020]/75 group-hover:text-indigo-600" />
            <p className="text-base text-[#202020]/75 group-hover:text-indigo-600">
              Overview
            </p>
          </div>
          <div className="flex flex-row justify-start items-center gap-3 cursor-pointer group">
            <LandPlot className="text-[#202020]/75 group-hover:text-indigo-600" />
            <p className="text-base text-[#202020]/75 group-hover:text-indigo-600">
              Kelola Arena
            </p>
          </div>
          <div className="flex flex-row justify-start items-center gap-3 cursor-pointer group">
            <NotebookTabs className="text-[#202020]/75 group-hover:text-indigo-600" />
            <p className="text-base text-[#202020]/75 group-hover:text-indigo-600">
              Booking
            </p>
          </div>
          <div className="flex flex-row justify-start items-center gap-3 cursor-pointer group">
            <User className="text-[#202020]/75 group-hover:text-indigo-600" />
            <p className="text-base text-[#202020]/75 group-hover:text-indigo-600">
              Akun Saya
            </p>
          </div>
        </div>
      </div>
      {/* AREA DATA */}
      <div className="flex flex-col justify-start items-start gap-6">
        <div className="flex flex-col justify-start items-start gap-2">
          <h1 className="text-xl text-[#202020]/95">
            Hi, <span className="font-bold">{userData.username}👋</span>
          </h1>
          <p className="text-base text-[#202020]/70">
            Kelola lapangan dan pantau semua aktivitas booking di dashboard ini.
          </p>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <p className="text-base text-[#202020] font-semibold">
            Stat Overview
          </p>
          <div className="grid grid-cols-3 flex-row justify-start items-stretch gap-2">
            {/* ARENA */}
            <div className="flex flex-col justify-start items-start gap-3 border border-[#202020]/20 px-4 py-5 rounded-xl group bg-white hover:bg-indigo-600 transition-all duration-100">
              <p className="text-base text-[#202020] font-medium group-hover:text-white">
                Arena Kamu
              </p>
              <p className="text-3xl text-[#202020] font-bold group-hover:text-white">
                {arenas.arenas.length}
              </p>
              <p className="text-base text-[#202020]/70 group-hover:text-white/70">
                Kelola arena yang telah kamu daftarkan
              </p>
            </div>
            {/* BOOKING */}
            <div className="flex flex-col justify-start items-start gap-3 border border-[#202020]/20 px-4 py-5 rounded-xl group bg-white hover:bg-indigo-600 transition-all duration-100">
              <p className="text-base text-[#202020] font-medium group-hover:text-white">
                Booking Hari Ini
              </p>
              <p className="text-3xl text-[#202020] font-bold group-hover:text-white">
                {arenas.bookings.length}
              </p>
              <p className="text-base text-[#202020]/70 group-hover:text-white/70">
                Lihat detail penyewa dan jadwal mereka
              </p>
            </div>
            {/* BALANCE */}
            <div className="flex flex-col justify-start items-start gap-3 border border-[#202020]/20 px-4 py-5 rounded-xl group bg-white hover:bg-indigo-600 transition-all duration-100">
              <p className="text-base text-[#202020] font-medium group-hover:text-white">
                Saldo Masuk
              </p>
              <div className="flex flex-row justify-start items-center gap-3">
                <p className="text-3xl text-[#202020] font-bold group-hover:text-white">
                  {Number(arenas.balance) / 100000000}
                </p>
                <img src="/icp.webp" alt="icp icon" className="w-12" />
              </div>

              <p className="text-base text-[#202020]/70 group-hover:text-white/70">
                Hasil penyewaan arena kamu
              </p>
            </div>
          </div>
        </div>

        {/* BOOKING TABLE */}
        <div className="flex flex-col justify-start items-start gap-3 w-full">
          <p className="text-base text-[#202020] font-semibold">Last Booking</p>
          <div className="flex flex-col justify-start items-start w-full border border-[#202020]/20 rounded-xl">
            {/* HEAD */}
            <div className="grid flex-row justify-center items-center gap-3 grid-cols-5 w-full px-4 py-5">
              <p className="text-sm text-[#202020] font-semibold text-center">
                Penyewa
              </p>
              <p className="text-sm text-[#202020] font-semibold text-center">
                Arena
              </p>
              <p className="text-sm text-[#202020] font-semibold text-center">
                Lapangan
              </p>
              <p className="text-sm text-[#202020] font-semibold text-center">
                Waktu
              </p>
              <p className="text-sm text-[#202020] font-semibold text-center">
                Status
              </p>
            </div>
            {/* BODY */}
            <div className="flex flex-col justify-start items-start w-full">
              {arenas.bookings.map((books) =>
                books.timestamp.map((stamp, key) => (
                  <div
                    key={key}
                    className={`grid flex-row justify-center items-center gap-3 grid-cols-5 w-full px-4 py-3 ${
                      key % 2 == 1 ? "bg-white" : "bg-indigo-600/5"
                    }`}
                  >
                    <p className="text-sm text-[#202020] text-center">
                      {books.customerName}
                    </p>
                    <p className="text-sm text-[#202020] text-center">
                      {books.arenaName}
                    </p>
                    <p className="text-sm text-[#202020] text-center">
                      {books.fieldName}
                    </p>
                    <p className="text-sm text-[#202020] text-center">
                      {stamp}
                    </p>
                    <p className="text-sm text-[#202020] text-center">
                      {books.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

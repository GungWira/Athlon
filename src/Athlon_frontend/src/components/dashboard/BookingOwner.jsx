import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";

export default function BookingOwner({ datas, userData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBookings, setFilteredBookings] = useState(
    datas.bookings || []
  );
  const [series, setSeries] = useState([
    {
      name: "Booking",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
  ]);

  const getLast7Days = () => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const today = new Date().getDay();
    const last7Days = [];
    for (let i = 1; i < 8; i++) {
      last7Days.push(days[(today + i) % 7]);
    }
    return last7Days;
  };

  const options = {
    chart: {
      height: 350,
      background: "#5336E8",
      type: "area",
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#FFFFFF"],
    },
    grid: {
      borderColor: "#ffffff08",
    },
    title: {
      text: "",
      align: "left",
      style: {
        fontSize: "16px",
        fontFamily: "Poppins, sans-serif",
        color: "#202020",
      },
    },
    xaxis: {
      type: "category",
      categories: getLast7Days(),
      labels: {
        style: {
          colors: "#FFFFFF",
          fontSize: "16px",
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#FFFFFF",
          fontSize: "16px",
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  useEffect(() => {
    if (datas) {
      const now = new Date();
      const countByDay = new Array(7).fill(0);

      datas.bookings.forEach((booking) => {
        const createdAt = Number(booking.createdAt / BigInt(1_000_000)); // dari nanodetik ke milidetik
        const bookingDate = new Date(createdAt);

        const dayDiff = Math.floor(
          (now.setHours(0, 0, 0, 0) - bookingDate.setHours(0, 0, 0, 0)) /
            86400000
        );

        if (dayDiff >= 0 && dayDiff <= 6) {
          countByDay[6 - dayDiff] += 1;
        }
      });

      setSeries([
        {
          name: "Booking",
          data: countByDay,
        },
      ]);

      const filtered = datas.bookings.filter((books) => {
        const query = searchQuery.toLowerCase();
        return (
          books.customerName.toLowerCase().includes(query) ||
          books.arenaName.toLowerCase().includes(query) ||
          books.fieldName.toLowerCase().includes(query)
        );
      });

      setFilteredBookings(filtered);
    }
  }, [datas, searchQuery]);

  return (
    <div className="w-full flex flex-col justify-start items-start gap-6">
      <div className="flex flex-col justify-start items-start gap-2">
        <h1 className="text-xl text-[#202020]/95">
          Hi, <span className="font-bold">{userData.username}👋</span>
        </h1>
        <p className="text-base text-[#202020]/70">
          Periksa daftar booking customer kamu disini dengan mudah!
        </p>
      </div>
      <div className="flex flex-col justify-start items-start gap-3 w-full">
        <p className="text-base text-[#202020] font-semibold">Booking Chart</p>
        <div className="w-full rounded-xl overflow-hidden bg-[#5336E8]">
          <Chart
            options={options}
            series={series}
            type="line"
            height={250}
            width="100%"
          />
        </div>
      </div>

      <div className="flex flex-col justify-start items-start gap-3 w-full">
        <p className="text-base text-[#202020] font-semibold">
          Customer's Booking
        </p>
        {/* SEARCHBAR */}
        <div className="w-full border border-[#202020]/20 rounded-md px-4 py-3 flex flex-row justify-start items-center gap-3">
          <Search className="w-5 text-[#202020]/60" />
          <input
            type="text"
            className="font-base text-[#202020]/90 w-full outline-0"
            placeholder="Cari data booking customer disini..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* TABLE */}
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
          {filteredBookings.length == 0 ? (
            <div className="w-full px-4 py-5 aspect-video flex justify-center items-center gap-2 flex-col">
              <img
                src="/character-1.webp"
                alt="character img"
                className="w-64"
              />
              <p className="text-lg font-bold text-[#202020] text-center mt-5">
                Data Booking Tidak Ditemukan
              </p>
              <p className="text-sm text-[#202020]/70 text-center">
                Yah belum ada data booking yang sesuai dengan kata kunci kamu
                nih! Cek nanti lagi yaa, pasti udah ada yang booking!
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-start items-start w-full">
              {filteredBookings.map((books) =>
                books.timestamp.map((stamp, key) => (
                  <Link
                    to={"/evidence/" + books.id}
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
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import Loading from "../Loading";

export default function OverviewCustomer({ datas, userData }) {
  const getTotalActiveBookings = (bookings) => {
    const now = new Date();
    let total = 0;

    bookings.forEach((booking) => {
      const { date, timestamp } = booking;

      timestamp.forEach((timeStr) => {
        const status = getBookingStatus(date, timeStr);
        if (status === "Aktif") {
          total++;
        }
      });
    });

    return total;
  };

  const formatDate = (dateStr) => {
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
    const day = dateStr.slice(0, 2);
    const month = months[parseInt(dateStr.slice(2, 4)) - 1];
    const year = dateStr.slice(4, 8);

    return `${day} ${month} ${year}`;
  };

  const getBookingStatus = (dateStr, timeStr) => {
    const [startStr, endStr] = timeStr.split(" - ");
    const bookingDate = new Date(
      parseInt(dateStr.slice(4, 8)),
      parseInt(dateStr.slice(2, 4)) - 1,
      parseInt(dateStr.slice(0, 2))
    );

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const bookingStart = new Date(bookingDate);
    const [startHour, startMinute] = startStr.split(":").map(Number);
    bookingStart.setHours(startHour, startMinute, 0);

    const bookingEnd = new Date(bookingDate);
    const [endHour, endMinute] = endStr.split(":").map(Number);
    bookingEnd.setHours(endHour, endMinute, 0);

    if (bookingEnd < now) return "Passed";
    return "Aktif";
  };

  const getSpendingTotal = (bookings) => {
    let total = 0;

    bookings.forEach((booking) => {
      const { totalPrice } = booking;
      total += Number(totalPrice);
    });
    return total;
  };

  if (!datas && !userData) return <Loading />;

  return (
    <div className="flex flex-col justify-start items-start gap-6">
      <div className="flex flex-col justify-start items-start gap-2">
        <h1 className="text-xl text-[#202020]/95">
          Hi, <span className="font-bold">{userData.username}👋</span>
        </h1>
        <p className="text-base text-[#202020]/70">
          Kelola lapangan dan pantau semua aktivitas olahraga kamu di dashboard
          ini.
        </p>
      </div>
      <div className="flex flex-col justify-start items-start gap-3">
        <p className="text-base text-[#202020] font-semibold">Stat Overview</p>
        <div className="grid grid-cols-3 flex-row justify-start items-stretch gap-2">
          {/* BOOKING */}
          <div className="flex flex-col justify-start items-start gap-3 border border-[#202020]/20 px-4 py-5 rounded-xl group bg-white hover:bg-indigo-600 transition-all duration-100">
            <p className="text-base text-[#202020] font-medium group-hover:text-white">
              Booking Aktif
            </p>
            <p className="text-3xl text-[#202020] font-bold group-hover:text-white">
              {getTotalActiveBookings(datas.bookings)}
            </p>
            <p className="text-base text-[#202020]/70 group-hover:text-white/70">
              Booking yang sedang berlangsung
            </p>
          </div>
          {/* BOOKING TOTAL */}
          <div className="flex flex-col justify-start items-start gap-3 border border-[#202020]/20 px-4 py-5 rounded-xl group bg-white hover:bg-indigo-600 transition-all duration-100">
            <p className="text-base text-[#202020] font-medium group-hover:text-white">
              Total Booking
            </p>
            <p className="text-3xl text-[#202020] font-bold group-hover:text-white">
              {datas.bookings.length}
            </p>
            <p className="text-base text-[#202020]/70 group-hover:text-white/70">
              Total booking yang kamu lakukan
            </p>
          </div>
          {/* BALANCE */}
          <div className="flex flex-col justify-start items-start gap-3 border border-[#202020]/20 px-4 py-5 rounded-xl group bg-white hover:bg-indigo-600 transition-all duration-100">
            <p className="text-base text-[#202020] font-medium group-hover:text-white">
              Pengeluaran
            </p>
            <div className="flex flex-row justify-start items-center gap-3">
              <p className="text-3xl text-[#202020] font-bold group-hover:text-white">
                {Number(getSpendingTotal(datas.bookings)) / 100000000}
              </p>
              <img src="/icp.webp" alt="icp icon" className="w-12" />
            </div>

            <p className="text-base text-[#202020]/70 group-hover:text-white/70">
              Seluruh pengeluaran kamu selama ini
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
              Arena
            </p>
            <p className="text-sm text-[#202020] font-semibold text-center">
              Lapangan
            </p>
            <p className="text-sm text-[#202020] font-semibold text-center">
              Tanggal
            </p>
            <p className="text-sm text-[#202020] font-semibold text-center">
              Waktu
            </p>
            <p className="text-sm text-[#202020] font-semibold text-center">
              Status
            </p>
          </div>
          {/* BODY */}
          {datas.bookings.length == 0 ? (
            <div className="w-full px-4 py-5 aspect-video flex justify-center items-center gap-2 flex-col">
              <img
                src="/character-1.webp"
                alt="character img"
                className="w-64"
              />
              <p className="text-lg font-bold text-[#202020] text-center mt-5">
                Belum Ada Booking
              </p>
              <p className="text-sm text-[#202020]/70 text-center">
                Yah belum ada yang booking lapangan nih! Cek nanti lagi yaa,
                pasti udah ada yang booking!
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-start items-start w-full">
              {datas.bookings.map((books) =>
                books.timestamp.map((stamp, key) => (
                  <div
                    key={key}
                    className={`grid flex-row justify-center items-center gap-3 grid-cols-5 w-full px-4 py-3 ${
                      key % 2 == 1 ? "bg-white" : "bg-indigo-600/5"
                    }`}
                  >
                    <p className="text-sm text-[#202020] text-center">
                      {books.arenaName}
                    </p>
                    <p className="text-sm text-[#202020] text-center">
                      {books.fieldName}
                    </p>
                    <p className="text-sm text-[#202020] text-center">
                      {formatDate(books.date)}
                    </p>
                    <p className="text-sm text-[#202020] text-center">
                      {stamp}
                    </p>
                    <p className="text-sm text-[#202020] text-center">
                      {getBookingStatus(books.date, stamp)}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function BookingCustomer({ datas, userData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBookings, setFilteredBookings] = useState(
    datas.bookings || []
  );

  useEffect(() => {
    if (datas) {
      console.log(datas);
      const filtered = datas.bookings.filter((books) => {
        const query = searchQuery.toLowerCase();
        return (
          books.arenaName.toLowerCase().includes(query) ||
          books.fieldName.toLowerCase().includes(query)
        );
      });
      console.log(filtered);
      setFilteredBookings(filtered);
    }
  }, [datas, searchQuery]);

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

  return (
    <div className="w-full flex flex-col justify-start items-start gap-6">
      <div className="flex flex-col justify-start items-start gap-2">
        <h1 className="text-xl text-[#202020]/95">
          Hi, <span className="font-bold">{userData.username}👋</span>
        </h1>
        <p className="text-base text-[#202020]/70">
          Periksa daftar booking kamu disini dengan mudah!
        </p>
      </div>
      <div className="flex flex-col justify-start items-start gap-3 w-full">
        <p className="text-base text-[#202020] font-semibold">Your Booking</p>
        {/* SEARCHBAR */}
        <div className="w-full border border-[#202020]/20 rounded-md px-4 py-3 flex flex-row justify-start items-center gap-3">
          <Search className="w-5 text-[#202020]/60" />
          <input
            type="text"
            className="font-base text-[#202020]/90 w-full outline-0"
            placeholder="Cari data booking kamu disini..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* TABLE */}
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

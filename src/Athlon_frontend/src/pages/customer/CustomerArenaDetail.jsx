"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { getTodayFormattedDate } from "../../utils/formatedDate";
import toast, { Toaster } from "react-hot-toast";
import {
  MapPinned,
  ChevronDown,
  ChevronUp,
  EqualApproximately,
} from "lucide-react";
import Button from "../../components/ui/Button";

export default function CustomerArenaDetail() {
  const { idArena } = useParams();
  const navigate = useNavigate();
  const { principal, isAuthenticated, actor, userData, icpIdrRate } = useAuth();

  const [arenaData, setArenaData] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [visibleTimeSlotsFields, setVisibleTimeSlotsFields] = useState({});

  useEffect(() => {
    const fetchArena = async () => {
      try {
        const today = getTodayFormattedDate();
        const result = await actor.getArenaBookingDetail(idArena, today);
        if (!result) {
          navigate(-1);
          return;
        }
        if (principal) {
          if (result[0].arena.owner.toText() == principal.toText()) {
            navigate("/owner/arena/" + idArena);
            return;
          }
        }
        setArenaData(result[0].arena);
        setFieldData(result[0].arenaFields);
        setBookings(result[0].bookingDatas);
      } catch (err) {
        console.error("Error fetching arena:", err);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchArena();
  }, [idArena, principal, isAuthenticated, navigate]);

  const getBookedTimes = (fieldId) => {
    const data = bookings?.find(([id]) => id === fieldId);
    if (!data) return [];
    const [, bookingList] = data;

    const times = bookingList.flatMap((booking) => booking.timestamp);
    return times;
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("id-ID").format(number);
  };

  const toggleTime = (fieldId, time) => {
    setSelectedTimes((prev) => {
      const current = prev[fieldId] || [];
      const alreadySelected = current.includes(time);
      return {
        ...prev,
        [fieldId]: alreadySelected
          ? current.filter((t) => t !== time)
          : [...current, time],
      };
    });
  };

  const toggleTimeSlots = (fieldId) => {
    setVisibleTimeSlotsFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const getSportInfo = (sport) => {
    switch (sport.toLowerCase()) {
      case "football":
        return "⚽";
      case "badminton":
        return "🏸";
      case "basketball":
        return "🏀";
      case "volleyball":
        return "🏐";
      case "futsal":
        return "🥅";
      default:
        return "🎯";
    }
  };

  const handleSubmit = async () => {
    if (!userData) {
      toast.error("Login terlebih dahulu untuk melanjutkan booking");
      return;
    }
    const today = getTodayFormattedDate();
    let total = 0;
    const selectedDetails = [];

    fieldData.forEach((field) => {
      const times = selectedTimes[field.id] || [];
      const pricePerSlot = Number(field.price);
      total += times.length * pricePerSlot;

      if (times.length > 0) {
        selectedDetails.push({
          fieldId: field.id,
          fieldName: field.name,
          times,
          pricePerSlot,
        });
      }
    });

    if (selectedDetails.length === 0) {
      alert("Silakan pilih setidaknya satu waktu booking.");
      return;
    }

    const owner = arenaData.owner;

    try {
      for (const detail of selectedDetails) {
        const bookingData = {
          idArena,
          arenaName: arenaData.name,
          arenaLocation: arenaData.city,
          fieldId: detail.fieldId,
          times: detail.times,
          principal,
          username: userData.username,
          owner: owner.toText(),
          date: today,
          fieldName: detail.fieldName,
          pricePerSlot: detail.pricePerSlot,
        };

        navigate("/arena/payment", { state: { bookingData } });
      }
    } catch (err) {
      console.error("Error saat booking:", err);
      alert("Terjadi kesalahan saat booking.");
    }
  };

  const getAvailableTimesCount = (field) => {
    if (!bookings) return field.availableTimes.length;

    const bookedTimes = getBookedTimes(field.id);
    const availableTimes = field.availableTimes.filter(
      (time) => !bookedTimes.includes(time)
    );
    return availableTimes.length;
  };

  if (loading) return <Loading />;

  const roundNumber = (num) => {
    return Math.round(num * 100) / 100;
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto px-4 mt-6 pb-10">
        {arenaData && (
          <>
            {/* Arena Image */}
            <div className="rounded-lg overflow-hidden h-64 md:h-80 mb-6">
              <img
                src={arenaData.images[0] || "/placeholder.svg"}
                alt={arenaData.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Arena Details */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold">{arenaData.name}</h1>
                  <p className="text-gray-600">{arenaData.city}</p>

                  <div className="flex gap-2 mt-3">
                    {arenaData.sports.map((sport, key) => (
                      <span
                        key={key}
                        className="rounded-full bg-gray-100 text-gray-800 flex items-center gap-1 px-3 py-1"
                      >
                        <span className="bg-gray-200 p-1 rounded-full">
                          {getSportInfo(sport)}
                        </span>
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="font-semibold text-lg mb-2">Deskripsi</h2>
                  <p className="text-gray-600 text-sm whitespace-pre-line">
                    {arenaData.description || "deskripsi tidak ada"}
                  </p>
                </div>

                {/* Rules */}
                <div>
                  <h2 className="font-semibold text-lg mb-2">Aturan</h2>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>{arenaData.rules || "Tidak ada aturan"}</li>
                  </ul>
                </div>

                {/* Facilities */}
                <div>
                  <h2 className="font-semibold text-lg mb-2">Fasilitas</h2>
                  <ul className="text-gray-600 text-sm space-y-1">
                    {arenaData.facilities.map((facility, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">{index + 1 + "."}</span>{" "}
                        {facility}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Location Card */}
              <div>
                <div className="text-white p-4 rounded-lg bg-indigo-600">
                  <div className="flex items-start flex-col justify-start mb-2">
                    <h3 className="font-semibold">Alaya Futsal Arena</h3>
                    <p className="text-sm mb-4">
                      {arenaData.province}, {arenaData.city}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    rounded="md"
                    icon={<MapPinned />}
                  >
                    Lihat lokasi
                  </Button>
                </div>
              </div>
            </div>

            {/* Fields Section */}
            <div className="mt-8 ">
              <h2 className="font-semibold text-lg mb-4">Lapangan</h2>
              {fieldData.map((field, index) => {
                const bookedTimes = getBookedTimes(field.id);
                const availableCount = getAvailableTimesCount(field);
                const isTimeSlotsVisible = visibleTimeSlotsFields[field.id];

                return (
                  <div
                    key={index}
                    className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2"
                  >
                    <div className="bg-gray-200 rounded-lg h-64">
                      <img
                        src={field.image || "/placeholder.svg"}
                        alt={field.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="gap-4 mb-4">
                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-lg">{field.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {field.description}
                        </p>

                        <div className="mb-3">
                          <h4 className="font-medium text-sm mb-1">Harga</h4>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <span className="text-blue-600 flex justify-center items-center gap-2">
                                <img src="/icp.webp" className="h-4" />
                                {roundNumber(Number(field.price) / 10000000)}
                              </span>
                              <span className="text-gray-600/60">
                                <EqualApproximately className="h-4" />
                              </span>
                              <span className="text-gray-600/60">
                                {icpIdrRate
                                  ? "IDR " +
                                    formatNumber(
                                      Math.floor(
                                        icpIdrRate *
                                          (Number(field.price) / 10000000)
                                      )
                                    )
                                  : "Tidak tersedia"}
                              </span>
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleTimeSlots(field.id)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
                        >
                          {availableCount} Jadwal Tersedia{" "}
                          <span className="ml-1">
                            {isTimeSlotsVisible ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </span>
                        </button>

                        {/* Time Slots - Only visible when toggled */}
                        {isTimeSlotsVisible && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 transition-all duration-300">
                            {field.availableTimes.map((time, idx) => {
                              const isSelected =
                                selectedTimes[field.id]?.includes(time) ||
                                false;
                              const isBooked = bookedTimes.includes(time);

                              // Check if the time slot has already passed
                              const [startTime, endTime] = time.split(" - ");
                              const now = new Date();
                              const currentTime =
                                now.getHours() * 60 + now.getMinutes();
                              const [endHour, endMinute] = endTime
                                .split(":")
                                .map(Number);
                              const endTimeInMinutes = endHour * 60 + endMinute;

                              const isPast = currentTime >= endTimeInMinutes;

                              return (
                                <div
                                  key={idx}
                                  className="border-indigo-600/20 border rounded-md overflow-hidden"
                                >
                                  <button
                                    onClick={() =>
                                      !isBooked &&
                                      !isPast &&
                                      toggleTime(field.id, time)
                                    }
                                    className={`w-full py-4 text-center text-base  ${
                                      isBooked || isPast
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : isSelected
                                        ? "bg-indigo-500 text-white"
                                        : "bg-white hover:bg-gray-50"
                                    }`}
                                    disabled={isBooked || isPast}
                                  >
                                    <div className="py-2 text-center text-base font-semibold">
                                      60 Menit
                                    </div>
                                    {time}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md"
                >
                  Submit Booking
                </button>
              </div>
            </div>
          </>
        )}
      </main>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

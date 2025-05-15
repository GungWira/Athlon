import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { getTodayFormattedDate } from "../../utils/formatedDate";
import { MapPinned, ChevronDown, ChevronUp, EqualApproximately } from "lucide-react";
import Button from "../../components/ui/Button";
import toast, { Toaster } from "react-hot-toast";

export default function OwnerArenaDetail() {
  const { idArena } = useParams();
  const navigate = useNavigate();
  const { principal, isAuthenticated, actor, icpIdrRate } = useAuth();

  const [arenaData, setArenaData] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleTimeSlotsFields, setVisibleTimeSlotsFields] = useState({});

  useEffect(() => {
    if (!isAuthenticated || !principal) {
      navigate("/", { replace: true });
      return;
    }

    const fetchArena = async () => {
      try {
        const today = getTodayFormattedDate();
        const result = await actor.getArenaBookingDetail(idArena, today);
        if (!result) {
          navigate(-1);
          return;
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
  }, [idArena, principal, isAuthenticated, navigate, actor]);

  const getBookedTimes = (fieldId) => {
    const data = bookings?.find(([id]) => id === fieldId);
    if (!data) return [];
    const [, bookingList] = data;

    const times = bookingList.flatMap((booking) => booking.timestamp);
    return times;
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

  const toggleTimeSlots = (fieldId) => {
    setVisibleTimeSlotsFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const roundNumber = (num) => {
    return Math.round(num * 100) / 100;
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("id-ID").format(number);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 mt-6 pb-10">
        <Toaster position="top-right" reverseOrder={false} />

        {arenaData && (
          <>
            <div className="rounded-lg overflow-hidden h-64 md:h-80 mb-6">
              <img
                src={arenaData.images[0] || "/placeholder.svg"}
                alt={arenaData.name}
                className="w-full h-full object-cover"
              />
            </div>

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

                <div>
                  <h2 className="font-semibold text-lg mb-2">Deskripsi</h2>
                  <p className="text-gray-600 text-sm whitespace-pre-line">
                    {arenaData.description || "deskripsi tidak ada"}
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold text-lg mb-2">Aturan</h2>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>{arenaData.rules || "Tidak ada aturan"}</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-semibold text-lg mb-2">Fasilitas</h2>
                  <ul className="text-gray-600 text-sm space-y-1">
                    {arenaData.facilities.map((facility, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">{index + 1 + "."}</span> {facility}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="text-white p-4 rounded-lg bg-indigo-600">
                  <div className="flex items-start flex-col justify-start mb-2">
                    <h3 className="font-semibold">{arenaData.name}</h3>
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

            <div className="mt-8 ">
              <h2 className="font-semibold text-lg mb-4">Lapangan</h2>
              {fieldData.map((field, index) => {
                const bookedTimes = getBookedTimes(field.id);
                const availableTimes = field.availableTimes.filter(
                  (time) => !bookedTimes.includes(time)
                );
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
                          {availableTimes.length} Jadwal Tersedia {" "}
                          <span className="ml-1">
                            {isTimeSlotsVisible ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </span>
                        </button>

                        {isTimeSlotsVisible && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 transition-all duration-300">
                            {[...bookedTimes, ...availableTimes].map((time, idx) => {
                              const isBooked = bookedTimes.includes(time);

                              return (
                                <div
                                  key={idx}
                                  className="border-indigo-600/20 border rounded-md overflow-hidden"
                                >
                                  <div
                                    className={`w-full py-4 text-center text-base  ${
                                      isBooked
                                        ? "bg-gray-200 text-gray-500"
                                        : "bg-white"
                                    }`}
                                  >
                                    <div className="py-2 text-center text-base font-semibold">
                                      60 Menit
                                    </div>
                                    {time}
                                  </div>
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
            </div>
          </>
        )}
      </main>
    </div>
  );
}

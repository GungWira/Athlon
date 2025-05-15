import React, { act, useEffect, useState } from "react";
import { AlertTriangle, MapPin, Plus, ChevronDown, ChevronUp, EqualApproximately } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import Button from "../../components/ui/Button";
import toast, { Toaster } from "react-hot-toast";

export default function OwnerArenaDetail() {
  const { idArena } = useParams();
  const navigate = useNavigate();
  const { principal, isAuthenticated, actor, icpIdrRate } = useAuth();
  const [bookings, setBookings] = useState(null);
  const [visibleTimeSlotsFields, setVisibleTimeSlotsFields] = useState({});
  const [arenaData, setArenaData] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !principal) {
      navigate("/", { replace: true });
      return;
    }

    const fetchArena = async () => {
      try {
        const result = await actor.getArenaById(idArena);
        if (!result) {
          navigate(-1);
          return;
        }

        const ownerMatch = result[0].owner.toText() === principal.toText();
        if (!ownerMatch) {
          navigate(-1);
        } else {
          setArenaData(result[0]);

          const resultFields = await actor.getFieldsByArena(idArena);
          if (resultFields) {
            setFieldData(resultFields);
          } else {
            setFieldData([]);
          }
        }
      } catch (err) {
        console.error("Error fetching arena:", err);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchArena();
  }, [idArena, principal, isAuthenticated, navigate, actor]);

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
  const getBookedTimes = (fieldId) => {
    const data = bookings?.find(([id]) => id === fieldId);
    if (!data) return [];
    const [, bookingList] = data;

    const times = bookingList.flatMap((booking) => booking.timestamp);
    return times;
  };
  const handleSetStatus = async (id, status) => {
    try {
      setProcessing(true);
      if (actor) {
        let result = await actor.setArenaStatus(id, status);
        console.log(result);
        if ("ok" in result) {
          setArenaData((prev) => ({
            ...prev,
            status: prev.status === "active" ? "deactive" : "active",
          }));
          toast.success(result.ok);
          return;
        }
        toast.error(result.err);
      }
    } catch (error) {
      console.log("Error mengubah status lapangan : ", error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loading />;

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
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />

      <main className="flex-1  mx-auto px-4 py-6 w-full">
        {fieldData && fieldData.length === 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-md p-4 mb-6 flex items-start">
            <AlertTriangle className="text-amber-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">
                Ups! Belum Ada Lapangan
              </h3>
              <p className="text-amber-700 text-sm mt-1">
                Kamu belum menambahkan data lapangan di arena ini. Yuk,
                tambahkan sekarang supaya bisa mulai menerima booking!
              </p>
            </div>
            <button className="ml-auto text-amber-500" onClick={() => { }}>
              ×
            </button>
          </div>
        )}
        {/* arena gambar */}
        {arenaData && (
          <div className="rounded-lg overflow-hidden mb-6 h-64 md:h-80">
            <img
              src={arenaData.images[0]}
              alt={arenaData.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* detail arena */}
        {arenaData && (
          <div className="mb-8">
            <div className="flex flex-row justify-between items-start gap-2">
              <div className="flex flex-col justify-start items-start gap-1">
                <h1 className="text-3xl font-bold mb-1">{arenaData.name}</h1>
                <p className="text-gray-600 mb-4">Kota {arenaData.city}</p>
              </div>
              <button
                disabled={processing}
                onClick={() => handleSetStatus(idArena, arenaData.status)}
                className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 rounded-md py-2 w-64 text-white text-xl font-medium"
              >
                {processing
                  ? "Memproses..."
                  : arenaData.status === "active"
                    ? "Aktif"
                    : "Non-Aktif"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {arenaData.sports.map((sport, key) => (
                <span
                  key={key}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800"
                >
                  <span className="mr-2">{getSportInfo(sport)}</span> {sport}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="font-semibold text-lg mb-3">Deskripsi</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {arenaData.description ||
                  "Figma ipsum component variant main layer. Arrange fill pencil italic list bold link inspect. Layer pen background draft layout ipsum strikethrough distribute style. Italic undo inspect italic asset thumbnail duplicate create list."}
              </p>
            </div>

            {/* ATURAN */}
            {arenaData.rules != "" && (
              <div className="mb-8">
                <h2 className="font-semibold text-lg mb-3">Aturan</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">{arenaData.rules}</li>
                </ul>
              </div>
            )}

            <div className="mb-8">
              <h2 className="font-semibold text-lg mb-3">Lokasi</h2>
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{arenaData.name}</h3>
                  <p className="text-gray-600 text-sm">
                    Denpasar Selatan, Bali
                  </p>
                </div>
                <Link
                  to={arenaData.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 flex items-center"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Lihat Lokasi
                </Link>
              </div>
            </div>

            {/* fasilitas  */}
            {arenaData.facilities.length != 0 && (
              <div className="mb-8">
                <h2 className="font-semibold text-lg mb-3">Fasilitas</h2>
                <ul className="space-y-2 text-gray-700">
                  {arenaData.facilities.map((facility, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">{index + 1}</span> {facility}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-8">
              <h2 className="font-semibold text-lg mb-3">Lapangan</h2>

              {fieldData && fieldData.length > 0 ? (
                <div className="space-y-4">
                  <Link
                    to={{ pathname: "/owner/arena/add-field" }}
                    state={{ arenaId: idArena, sports: arenaData.sports }}
                    className="text-purple-600 font-medium flex justify-end"
                  >
                    <Button rounded="lg">Tambah Lapangan</Button>
                  </Link>
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
                                        className={`w-full py-4 text-center text-base  ${isBooked
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
              ) : (
                <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                  <Link
                    to={{ pathname: "/owner/arena/add-field" }}
                    state={{ arenaId: idArena, sports: arenaData.sports }}
                    className="text-purple-600 flex items-center justify-center border border-purple-600 rounded-full w-10 h-10 mb-3"
                  >
                    <Plus className="w-5 h-5" />
                  </Link>
                  <Link
                    to={{ pathname: "/owner/arena/add-field" }}
                    state={{ arenaId: idArena, sports: arenaData.sports }}
                    className="text-purple-600 font-medium"
                  >
                    Tambah Lapangan
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import React, { act, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import toast, { Toaster } from "react-hot-toast";
import { LocateIcon, Sprout, User } from "lucide-react";

export default function DetailEvent() {
  const { idEvent } = useParams();
  const navigate = useNavigate();
  const { principal, isAuthenticated, actor, login } = useAuth();

  const [datas, setDatas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchArena = async () => {
      try {
        const result = await actor.getEventById(String(idEvent));
        setDatas(result[0]);
        if ("err" in result) {
          navigate(-1);
          return;
        }
        console.log(result[0]);
      } catch (err) {
        console.error("Error fetching arena:", err);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchArena();
  }, [idEvent, principal, isAuthenticated, navigate, actor]);

  const handleAction = async () => {
    try {
      setProcessing(true);
      if (principal.toText() == datas.owner.toText()) {
        toast.error("Pemilik komunitas tidak boleh keluar!");
        return;
      }
      if (!datas.members.includes(principal.toText())) {
        const res = await actor.joinCommunity(idCommunity, principal);
        if (res) {
          setDatas((prev) => ({
            ...prev,
            members: [...prev.members, principal.toText()],
          }));
          toast.success("Berhasil mengikuti komunitas!");
        } else {
          toast.error("Gagal mengikuti komunitas!");
        }
      } else {
        const res = await actor.leaveCommunity(idCommunity, principal);
        if (res) {
          setDatas((prev) => ({
            ...prev,
            members: prev.members.filter(
              (member) => member !== principal.toText()
            ),
          }));
          toast.success("Berhasil keluar komunitas!");
        } else {
          toast.error("Gagal keluar komunitas!");
        }
      }
    } catch (error) {
      console.log("Error processing data : ", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleEvent = async () => {
    navigate(`/community/${idCommunity}/create-event`);
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

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 mx-auto px-4 py-6 w-full">
          {/* arena gambar */}
          {datas && (
            <div className="rounded-lg overflow-hidden mb-6 h-64 md:h-80">
              <img
                src={datas.banner}
                alt={datas.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* detail arena */}
          {datas && (
            <div className="mb-8 w-full flex flex-row justify-between items-start gap-8">
              <div className="flex flex-col justify-start items-start w-full">
                <div className="flex flex-row justify-between items-start gap-4 w-full">
                  <div className="flex flex-row justify-start items-start gap-4">
                    <div className="flex flex-col justify-start items-start gap-2">
                      <h1 className="text-3xl font-bold mb-1">{datas.title}</h1>
                      <p className="text-[#202020]/90 text-lg font-medium">
                        {formatDate(datas.date)} pukul {datas.time}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {datas.sport.map((sporto, key) => (
                          <span
                            key={key}
                            className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800"
                          >
                            <span className="mr-2">{getSportInfo(sporto)}</span>
                            {sporto}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="font-semibold text-lg mb-3">Deskripsi</h2>
                  <p className="text-gray-700">
                    {datas.description ||
                      "Deskripsi tidak tersedia untuk komunitas ini."}
                  </p>
                </div>

                {/* ATURAN */}
                {datas.rules && datas.rules.trim() !== "" && (
                  <div className="mb-8">
                    <h2 className="font-semibold text-lg mb-3">Aturan</h2>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">{datas.rules}</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* JOIN */}
              <div className="flex flex-col justify-start items-start gap-1 px-4 py-3 rounded-md border border-[#202020]/20 w-full max-w-96">
                <p className="font-semibold text-xl text-[#202020] ">
                  {principal ? datas.owner.toText() == principal.toText()
                    ? "Event Anda"
                    : "Gabung Event" : "Gabung Event"}
                </p>
                <p className="text-[#202020]/80 mb-2 text-base">
                  Ikuti event olahraga untuk bertemu dengan sesama pecinta
                  olahraga!
                </p>

                <div className="flex flex-row justify-start items-center gap-2 my-2">
                  <LocateIcon className="w-8" />
                  <p className="text-[#202020]/80 text-base">
                    {datas.location}
                  </p>
                </div>

                <div className="flex flex-row justify-start items-center gap-2 my-2">
                  <User className="w-8" />
                  <p className="text-[#202020]/80 text-base">
                    {datas.participant.length} Peserta
                  </p>
                </div>

                <div className="flex flex-row justify-start items-center gap-2 mb-2">
                  <Sprout className="w-8" />
                  <p className="text-[#202020]/80 text-base">
                    Tingkat {datas.level}
                  </p>
                </div>

                {principal ? (
                  datas.owner.toText() != principal.toText() ? (
                    <button
                      className={`text-white font-semibold text-md text-center w-full py-2 rounded-md mt-4 cursor-pointer ${
                        !datas.members.includes(principal.toText())
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : datas.owner.toText() == principal.toText()
                          ? "bg-indigo-600 "
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                      onClick={handleAction}
                    >
                      {processing
                        ? "Memproses..."
                        : !datas.members.includes(principal.toText())
                        ? "Join Event"
                        : datas.owner.toText() == principal.toText()
                        ? "Your Event"
                        : "Leave Event"}
                    </button>
                  ) : (
                    <button
                      onClick={handleEvent}
                      className="text-white font-semibold text-md text-center w-full py-2 rounded-md mt-4 cursor-pointer bg-indigo-600 hover:bg-indigo-700"
                    >
                      Hentikan Lomba
                    </button>
                  )
                ) : (
                  <button
                    onClick={login}
                    className="text-white font-semibold text-md text-center w-full py-2 rounded-md mt-4 cursor-pointer bg-indigo-600 hover:bg-indigo-700"
                  >
                    Login Untuk Bergabung
                  </button>
                )}
                <div className="flex flex-row justify-start items-center gap-2 mt-2">
                  <img
                    src={datas.communityProfile}
                    alt="profile-community"
                    className="w-8 border border-[#202020]/10 aspect-square rounded-full"
                  />
                  <p className="text-[#202020]/80 text-base">
                    {datas.communityName}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

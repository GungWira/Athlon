import React, { act, useEffect, useState } from "react";
import { AlertTriangle, MapPin, Plus } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import Button from "../../components/ui/Button";
import toast, { Toaster } from "react-hot-toast";

export default function DetailCommunity() {
  const { idCommunity } = useParams();
  const navigate = useNavigate();
  const { principal, isAuthenticated, actor, userData } = useAuth();

  const [datas, setDatas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !principal) {
      navigate("/", { replace: true });
      return;
    }

    const fetchArena = async () => {
      try {
        const result = await actor.getCommunityById(idCommunity);
        if ("err" in result) {
          navigate(-1);
          return;
        }
        setDatas(result.ok);
        console.log(result.ok);
      } catch (err) {
        console.error("Error fetching arena:", err);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchArena();
  }, [idCommunity, principal, isAuthenticated, navigate, actor]);

  const handleAction = async () => {
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
            <div className="mb-8 w-full flex flex-row justify-between items-start">
              <div className="flex flex-col justify-start items-start">
                <div className="flex flex-row justify-between items-start gap-4 w-full">
                  <div className="flex flex-row justify-start items-start gap-4">
                    <img
                      src={datas.profile}
                      alt="Profile"
                      className="w-20 h-20 object-cover rounded-full"
                    />
                    <div className="flex flex-col justify-start items-start gap-2">
                      <h1 className="text-3xl font-bold mb-1">{datas.name}</h1>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {datas.sports.map((sport, key) => (
                          <span
                            key={key}
                            className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800"
                          >
                            <span className="mr-2">{getSportInfo(sport)}</span>
                            {sport}
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
                  Join Community
                </p>
                <p className="text-[#202020]/80 mb-2 text-base">
                  Ikuti komunitas olahraga untuk beragam informasi terbaru
                </p>

                <p className="text-[#202020]/80 text-sm">
                  Oleh {datas.ownerName}
                </p>
                <p className="text-[#202020]/80 text-sm">
                  {getSportInfo(datas.sports[0])} {datas.sports[0]}
                </p>
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
                  {!datas.members.includes(principal.toText())
                    ? "Join Community"
                    : datas.owner.toText() == principal.toText()
                    ? "Your Community"
                    : "Leave Community"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

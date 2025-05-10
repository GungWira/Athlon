import React, { act, useEffect, useState } from "react";
import { AlertTriangle, MapPin, Plus } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import Button from "../../components/ui/Button";

export default function OwnerArenaDetail() {
  const { idArena } = useParams();
  const navigate = useNavigate();
  const { principal, isAuthenticated, actor } = useAuth();

  const [arenaData, setArenaData] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [loading, setLoading] = useState(true);

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
          console.log(result[0]);

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

  const handleSetStatus = async (id, status) => {
    try {
      setLoading(true);
      if (actor) {
        let result = await actor.setArenaStatus(id, status);
        console.log(result);
        if ("ok" in result) {
          setArenaData((prev) => ({
            ...prev,
            status: prev.status === "active" ? "deactive" : "active",
          }));
        }
      }
    } catch (error) {
      console.log("Error mengubah status lapangan : ", error);
    } finally {
      setLoading(false);
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
            <button className="ml-auto text-amber-500" onClick={() => {}}>
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
            <h1 className="text-3xl font-bold mb-1">{arenaData.name}</h1>
            <p className="text-gray-600 mb-4">Kota {arenaData.city}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {arenaData.sports.map((sport, key) => (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800">
                  <span className="mr-2">{getSportInfo(sport)}</span> {sport}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="font-semibold text-lg mb-3">Deskripsi</h2>
              <p className="text-gray-700">
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
                  {fieldData.map((field, key) => (
                    <div className="border rounded-lg p-4" key={key}>
                      <h3 className="font-medium mb-3">{field.name}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {field.availableTimes.map((time, timeKey) => (
                          <div
                            className="bg-blue-100 text-blue-800 px-3 py-2 rounded text-sm text-center"
                            key={timeKey}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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

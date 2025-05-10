import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { getTodayFormattedDate } from "../../utils/formatedDate";

export default function CustomerArenaDetail() {
  const { idArena } = useParams();
  const navigate = useNavigate();
  const { principal, isAuthenticated, actor, userData } = useAuth();

  const [arenaData, setArenaData] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState({});

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
        console.log(result);
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
    const data = bookings.find(([id]) => id === fieldId);
    if (!data) return [];
    const [, bookingList] = data;

    const times = bookingList.flatMap((booking) => booking.timestamp);
    return times;
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

  const handleSubmit = async () => {
    const today = getTodayFormattedDate();
    let total = 0;
    let selectedDetails = [];

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

    const owner = arenaData.owner; // Ambil owner dari arenaData

    try {
      for (const detail of selectedDetails) {
        const result = await actor.bookField(
          idArena,
          detail.fieldId,
          detail.times,
          principal,
          userData.username,
          owner,
          today
        );

        if ("err" in result) {
          alert(
            `Booking gagal pada lapangan ${detail.fieldName}: ${result.err}`
          );
          return;
        }
      }

      alert("Booking berhasil!");
      // navigate("/customer/dashboard"); // atau sesuaikan rute dashboard
    } catch (err) {
      console.error("Error saat booking:", err);
      alert("Terjadi kesalahan saat booking.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Arena Details</h1>
      {arenaData ? (
        <>
          <div className="mb-4">
            <p>Nama Arena: {arenaData.name}</p>
            <p>Lokasi: {arenaData.city}</p>
          </div>

          <div className="flex flex-col gap-8 mt-6">
            {fieldData.map((field, index) => (
              <div key={index} className="border p-4 rounded">
                <p className="font-semibold mb-2">
                  {field.name} - {field.price} ICP per slot
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {field.availableTimes.map((time, idx) => {
                    const isSelected =
                      selectedTimes[field.id]?.includes(time) || false;
                    const bookedTimes = getBookedTimes(field.id);
                    const isBooked = bookedTimes.includes(time);

                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTime(field.id, time)}
                        className={`px-2 py-1 rounded ${
                          isBooked
                            ? "bg-gray-300 cursor-not-allowed"
                            : isSelected
                            ? "bg-green-400 text-white"
                            : "bg-blue-200"
                        }`}
                        disabled={isBooked}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Submit Booking
            </button>
          </div>
        </>
      ) : (
        <p>No arena data found.</p>
      )}
    </div>
  );
}

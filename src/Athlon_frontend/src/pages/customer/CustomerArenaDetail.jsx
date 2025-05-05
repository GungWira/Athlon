import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";

export default function CustomerArenaDetail() {
  const { idArena } = useParams();
  const navigate = useNavigate();
  const { principal, isAuthenticated, actor } = useAuth();

  const [arenaData, setArenaData] = useState(null);
  const [fieldData, setFieldData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState({});

  useEffect(() => {
    if (!isAuthenticated || !principal) {
      navigate("/", { replace: true });
      return;
    }

    const fetchArena = async () => {
      try {
        const tes = await actor.getArenaBookingDetail(idArena);
        console.log(tes);
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
          setFieldData(resultFields || []);
        }
      } catch (err) {
        console.error("Error fetching arena:", err);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchArena();
  }, [idArena, principal, isAuthenticated, navigate]);

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

  const handleSubmit = () => {
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

    console.log("Principal:", principal.toText());
    console.log("Selected Times:", selectedDetails);
    console.log("Total Price:", total);
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

                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTime(field.id, time)}
                        className={`px-2 py-1 rounded ${
                          isSelected ? "bg-green-400 text-white" : "bg-blue-200"
                        }`}
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

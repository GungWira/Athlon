import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const sportsOptions = [
  { label: "Futsal", icon: "⚽" },
  { label: "Badminton", icon: "🏸" },
  { label: "Basketball", icon: "🏀" },
  { label: "Volleyball", icon: "🏐" },
];

const facilitiesOptions = [
  { label: "Toilet", icon: "🚻" },
  { label: "Parkir", icon: "🅿️" },
  { label: "Kantin", icon: "🍽️" },
];

export default function CreateArena() {
  const { actor, principal } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [],
    sports: [],
    province: "",
    city: "",
    district: "",
    mapsLink: "",
    rules: "",
    facilities: [],
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((images) => {
      setFormData((prev) => ({ ...prev, images }));
    });
  };

  const toggleSelect = (key, value) => {
    setFormData((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  };

  const handleSubmit = async () => {
    try {
      const result = await actor.createArena(
        formData.name,
        formData.description,
        formData.images,
        formData.sports,
        formData.province,
        formData.city,
        formData.district,
        formData.mapsLink,
        formData.rules,
        formData.facilities,
        principal
      );

      setFormData({
        name: "",
        description: "",
        images: [],
        sportTypes: [],
        province: "",
        city: "",
        district: "",
        mapsLink: "",
        rules: "",
        facilities: [],
      });
      setStep(1);

      navigate(`/owner/arena/${result.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal membuat arena");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 border rounded-lg shadow">
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-4">Info Arena</h2>
          <input
            type="text"
            placeholder="Nama Arena"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full border p-2 mb-2 rounded"
            required
          />
          <textarea
            placeholder="Deskripsi"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />
          <div className="mb-4">
            <p className="mb-1">Jenis Olahraga:</p>
            <div className="flex gap-2 flex-wrap">
              {sportsOptions.map((sport) => (
                <button
                  key={sport.label}
                  type="button"
                  onClick={() => toggleSelect("sports", sport.label)}
                  className={`border p-2 rounded ${
                    (formData.sports || []).includes(sport.label)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {sport.icon} {sport.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            className="bg-blue-500 text-white w-full py-2 rounded"
          >
            Selanjutnya
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-4">Lokasi</h2>
          <input
            type="text"
            placeholder="Provinsi"
            value={formData.province}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, province: e.target.value }))
            }
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="text"
            placeholder="Kota"
            value={formData.city}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, city: e.target.value }))
            }
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="text"
            placeholder="Kecamatan"
            value={formData.district}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, district: e.target.value }))
            }
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="url"
            placeholder="Link Maps"
            value={formData.mapsLink}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, mapsLink: e.target.value }))
            }
            className="w-full border p-2 mb-4 rounded"
          />
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Kembali
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Selanjutnya
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-xl font-bold mb-4">Opsional</h2>
          <textarea
            placeholder="Aturan Arena (opsional)"
            value={formData.rules}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, rules: e.target.value }))
            }
            className="w-full border p-2 mb-2 rounded"
          />
          <div className="mb-4">
            <p className="mb-1">Fasilitas:</p>
            <div className="flex gap-2 flex-wrap">
              {facilitiesOptions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => toggleSelect("facilities", item.label)}
                  className={`border p-2 rounded ${
                    formData.facilities.includes(item.label)
                      ? "bg-green-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Kembali
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
}

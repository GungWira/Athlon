import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { X, ImageIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const sportsOptions = [
  { label: "Futsal", icon: "⚽" },
  { label: "Badminton", icon: "🏸" },
  { label: "Basketball", icon: "🏀" },
  { label: "Volleyball", icon: "🏐" },
];

export default function CreateEvent() {
  const { idCommunity } = useParams();
  const { actor, principal, userData } = useAuth();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sports: [],
    rules: "",
    banner: [],
    level: "",
    maxParticipant: 1,
    date: "",
    time: "",
    location: "",
  });

  const handleBannerChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((banner) => {
      setFormData((prev) => ({ ...prev, banner }));
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

  const formatDateToDDMMYYYY = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}${month}${year}`;
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Nama arena tidak boleh kosong");
        return;
      }
      if (formData.sports.length === 0) {
        toast.error("Harap pilih setidaknya satu jenis olahraga");
        return;
      }
      if (!formData.description.trim()) {
        toast.error("Deskripsi tidak boleh kosong");
        return;
      }
      if (!formData.rules.trim()) {
        toast.error("Aturan tidak boleh kosong");
        return;
      }
      if (!formData.level.trim()) {
        toast.error("Level tidak boleh kosong");
        return;
      }
      if (!formData.maxParticipant) {
        toast.error("Jumlah peserta tidak boleh kosong");
        return;
      }
      if (!formData.date) {
        toast.error("Tanggal tidak boleh kosong");
        return;
      }
      if (!formData.time) {
        toast.error("Waktu tidak boleh kosong");
        return;
      }
      if (!formData.location) {
        toast.error("Lokasi tidak boleh kosong");
        return;
      }
      if (formData.banner.length === 0) {
        toast.error("Harap unggah setidaknya satu gambar arena");
        return;
      }

      setIsSubmit(true);

      const result = await actor.createEvent(
        principal,
        userData.username,
        idCommunity,
        formData.name,
        formData.description,
        formData.sports,
        formData.rules,
        formData.banner[0],
        formData.level,
        BigInt(formData.maxParticipant),
        formatDateToDDMMYYYY(formData.date),
        formData.time,
        formData.location
      );

      setFormData({
        name: "",
        description: "",
        sports: [],
        rules: "",
        banner: [],
        level: "",
        maxParticipant: 1,
        date: "",
        time: "",
        location: "",
      });

      navigate(`/event/${result}`);
    } catch (err) {
      console.error(err);
      alert("Gagal membuat arena");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="  flex items-center justify-center z-50 p-4">
        <div className=" rounded-lg w-full ">
          {/* Header */}
          <div className="flex justify-between items-center p-6 ">
            <div>
              <h2 className="text-xl font-bold">Create Event</h2>
              <p className="text-sm text-gray-500 mt-1">
                Masukkan detail event olahraga yang ingin anda buat disini!
              </p>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Nama Event
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Masukkan nama"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Jenis Olahraga
                  </label>
                  <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {sportsOptions.map((sport) => (
                        <button
                          key={sport.label}
                          type="button"
                          onClick={() => toggleSelect("sports", sport.label)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                            formData.sports?.includes(sport.label)
                              ? "bg-indigo-600 text-white"
                              : "bg-white text-gray-700 border border-gray-300"
                          }`}
                        >
                          <span>{sport.icon}</span>
                          <span>{sport.label}</span>
                          {!formData.sports?.includes(sport.label) && (
                            <span className="ml-1 text-lg">+</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* deskripsi */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-2"
                  >
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    placeholder="Masukkan deskripsi"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                  />
                </div>

                {/* LOKASI */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium mb-2"
                  >
                    Lokasi
                  </label>
                  <input
                    type="text"
                    id="location"
                    min="1"
                    value={formData.location}
                    placeholder="Masukkan lokasi"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* LEVEL */}
                <div>
                  <label
                    htmlFor="level"
                    className="block text-sm font-medium mb-2"
                  >
                    Level
                  </label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        level: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="" disabled>
                      Pilih level
                    </option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>

                {/* MAX PARTICIPANT */}
                <div>
                  <label
                    htmlFor="maxParticipant"
                    className="block text-sm font-medium mb-2"
                  >
                    Jumlah Maksimal Peserta
                  </label>
                  <input
                    type="number"
                    id="maxParticipant"
                    min="1"
                    value={formData.maxParticipant}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxParticipant: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* DATE */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium mb-2"
                  >
                    Tanggal
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* TIME */}
                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium mb-2"
                  >
                    Waktu (Jam)
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="rules"
                    className="block text-sm font-medium mb-2"
                  >
                    Aturan Event{" "}
                  </label>
                  <textarea
                    id="rules"
                    placeholder="Masukkan aturan"
                    value={formData.rules}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rules: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                  />
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="flex flex-col justify-start items-start gap-7 w-full">
                <div className="w-full">
                  <label className="block text-sm font-medium mb-2">
                    Unggah Foto Banner
                  </label>
                  <div className="border border-gray-300 rounded-lg h-[300px] relative overflow-hidden">
                    {formData.banner.length > 0 ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={formData.banner[0] || "/placeholder.svg"}
                          alt="Arena preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <input
                            type="file"
                            id="image-upload-change-banner"
                            accept="image/*"
                            onChange={handleBannerChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="image-upload-change-banner"
                            className="cursor-pointer bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-100"
                          >
                            Change Image
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-6">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 mb-4">
                          <ImageIcon className="text-gray-400" size={24} />
                        </div>
                        <input
                          type="file"
                          id="image-upload-banner"
                          accept="image/*"
                          onChange={handleBannerChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-upload-banner"
                          className="cursor-pointer text-indigo-600 hover:text-indigo-800"
                        >
                          Upload image
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmit ? true : false}
                className={`hover:bg-indigo-700 cursor-pointer text-white px-6 py-2 rounded-md ${
                  !isSubmit ? "bg-indigo-600" : "bg-indigo-400"
                }`}
              >
                {!isSubmit ? "Buat Sekarang" : "Memproses..."}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

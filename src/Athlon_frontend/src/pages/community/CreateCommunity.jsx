import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { X, ImageIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const sportsOptions = [
  { label: "Futsal", icon: "⚽" },
  { label: "Badminton", icon: "🏸" },
  { label: "Basketball", icon: "🏀" },
  { label: "Volleyball", icon: "🏐" },
];

export default function CreateCommunity() {
  const { actor, principal, userData } = useAuth();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [],
    banner: [],
    sports: [],
    rules: "",
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
      if (formData.images.length === 0) {
        toast.error("Harap unggah setidaknya satu gambar arena");
        return;
      }
      if (formData.banner.length === 0) {
        toast.error("Harap unggah setidaknya satu gambar arena");
        return;
      }

      setIsSubmit(true);

      const result = await actor.createCommunity(
        formData.name,
        principal,
        userData.username,
        formData.sports,
        formData.description,
        formData.images[0],
        formData.banner[0],
        formData.rules
      );
      console.log(result);

      setFormData({
        name: "",
        description: "",
        images: [],
        banner: [],
        sports: [],
        rules: "",
      });

      navigate(`/community/${result}`);
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
              <h2 className="text-xl font-bold">Create Community</h2>
              <p className="text-sm text-gray-500 mt-1">
                Masukkan detail identitas komunitas olahraga yang ingin anda
                buat disini!
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
                    Nama Komunitas
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

                {/* deksripsi  */}
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

                {/* Arena Rules */}
                <div>
                  <label
                    htmlFor="rules"
                    className="block text-sm font-medium mb-2"
                  >
                    Aturan Arena{" "}
                    <span className="text-gray-500 text-xs">(Opsional)</span>
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
                    Unggah Foto Profil Komunitas
                  </label>
                  <div className="border border-gray-300 rounded-lg h-[300px] relative overflow-hidden">
                    {formData.images.length > 0 ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={formData.images[0] || "/placeholder.svg"}
                          alt="Arena preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <input
                            type="file"
                            id="image-upload-change-profile"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="image-upload-change-profile"
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
                          id="image-upload-profile"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-upload-profile"
                          className="cursor-pointer text-indigo-600 hover:text-indigo-800"
                        >
                          Upload image
                        </label>
                      </div>
                    )}
                  </div>
                </div>

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

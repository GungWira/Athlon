import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { X, ChevronDown, ImageIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const sportsOptions = [
  { label: "Futsal", icon: "⚽" },
  { label: "Badminton", icon: "🏸" },
  { label: "Basketball", icon: "🏀" },
  { label: "Volleyball", icon: "🏐" },
];

const facilitiesOptions = [
  { label: "Musholla", value: "Musholla" },
  { label: "Parkir Mobil", value: "Parkir Mobil" },
  { label: "Parkir Motor", value: "Parkir Motor" },
  { label: "Jual Makanan Ringan", value: "Jual Makanan Ringan" },
  { label: "Jual Minuman", value: "Jual Minuman" },
  { label: "Toilet", value: "Toilet" },
];

export default function CreateArena() {
  const { actor, principal, userData } = useAuth();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
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
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);
  const facilitiesRef = useRef(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showPromptRules, setShowPromptRules] = useState(false);
  const [promptRules, setPromptRules] = useState("");
  const [prompting, setPrompting] = useState(false);
  const [ownerCanCreate, setownerCanCreate] = useState(true);

  useEffect(() => {
    const fetchArenas = async () => {
      try {
        if (actor) {
          const result = await actor.getArenaByOwner(principal);
          if (result) {
            if (result.length > 0 && !userData.isPremium) {
              toast.error(
                "Silahkan upgrade ke premium untuk membuat lebih dari 1 arena"
              );
              setownerCanCreate(false);
            }
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchArenas();
  }, [actor]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        facilitiesRef.current &&
        !facilitiesRef.current.contains(event.target)
      ) {
        setFacilitiesOpen(false);
      }
    }

    if (facilitiesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [facilitiesOpen]);

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
      if (!ownerCanCreate) {
        toast.error(
          "Silahkan upgrade ke premium untuk membuat lebih dari 1 arena"
        );
        return;
      }
      if (!formData.name.trim()) {
        toast.error("Nama arena tidak boleh kosong");
        return;
      }
      if (formData.sports.length === 0) {
        toast.error("Harap pilih setidaknya satu jenis olahraga");
        return;
      }
      if (!formData.province.trim()) {
        toast.error("Provinsi tidak boleh kosong");
        return;
      }
      if (!formData.city.trim()) {
        toast.error("Kota/Kecamatan tidak boleh kosong");
        return;
      }
      if (!formData.mapsLink.trim()) {
        toast.error("Link maps tidak boleh kosong");
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

      setIsSubmit(true);

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
        sports: [],
        province: "",
        city: "",
        district: "",
        mapsLink: "",
        rules: "",
        facilities: [],
      });

      navigate(`/owner/arena/${result.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal membuat arena");
    } finally {
      setIsSubmit(false);
    }
  };

  const handlePromptSubmit = async () => {
    setShowPrompt(true);
    setPrompting(true);

    try {
      if (!prompt.trim()) {
        toast.error("Prompt tidak boleh kosong");
        return;
      }

      if (
        !formData.name.trim() ||
        !formData.province.trim() ||
        !formData.city.trim() ||
        !formData.sports.length
      ) {
        toast.error(
          "Harap isi semua informasi arena sebelum membuat deskripsi"
        );
        return;
      }

      const data = {
        arenaName: formData.name,
        locations: `${formData.province}, ${formData.city}`,
        sportsType: formData.sports.join(", "),
        context: prompt,
      };
      const response = await actor.generateDesc(data);
      setFormData((prev) => ({
        ...prev,
        description: response.ok,
      }));
      toast.success("Deskripsi berhasil dibuat");
    } catch (error) {
      console.error(error);
      toast.error("Gagal membuat deskripsi");
    } finally {
      setPrompting(false);
      setShowPrompt(false);
      setPrompt("");
    }
  };

  const handlePromptRulesSubmit = async () => {
    setShowPromptRules(true);
    setPrompting(true);

    try {
      if (!promptRules.trim()) {
        toast.error("Prompt tidak boleh kosong");
        return;
      }

      if (
        !formData.name.trim() ||
        !formData.province.trim() ||
        !formData.city.trim() ||
        !formData.sports.length
      ) {
        toast.error(
          "Harap isi semua informasi arena sebelum membuat aturan arena"
        );
        return;
      }

      const data = {
        arenaName: formData.name,
        locations: `${formData.province}, ${formData.city}`,
        sportsType: formData.sports.join(", "),
        context: prompt,
      };
      const response = await actor.generateRules(data);
      setFormData((prev) => ({
        ...prev,
        rules: response.ok,
      }));
      toast.success("Rules berhasil dibuat");
    } catch (error) {
      console.error(error);
      toast.error("Gagal membuat rules");
    } finally {
      setPrompting(false);
      setShowPromptRules(false);
      setPromptRules("");
    }
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex items-center justify-center z-50 p-4">
        <div className="rounded-lg w-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6">
            <div>
              <h2 className="text-xl font-bold">Create Arena</h2>
              <p className="text-sm text-gray-500 mt-1">
                Masukkan nama arena, fasilitas, dan deskripsi singkat untuk
                menarik penyewa.
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
                    Nama Arena
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
                    Jenis
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

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lokasi
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Provinsi"
                      value={formData.province}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          province: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Kota/kecamatan"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="url"
                      placeholder="Link maps"
                      value={formData.mapsLink}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mapsLink: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
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
                    onFocus={() => setShowPrompt(true)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                  />

                  <div
                    className={`flex w-full justify-between items-center gap-2 border border-[#202020]/20 transition-all ease-in-out duration-500 px-2 rounded-lg overflow-hidden ${
                      showPrompt
                        ? "h-11 py-1 border-[#202020]/20"
                        : "h-0 py-0 border-0"
                    }`}
                  >
                    <img src="shine.webp" alt="shine" className="w-4" />
                    <input
                      type="text"
                      placeholder="Generate dengan Ai"
                      onChange={(e) => setPrompt(e.target.value)}
                      onFocus={() => setShowPrompt(true)}
                      onBlur={() => setShowPrompt(false)}
                      className="w-full outline-0"
                    />
                    <button
                      onClick={handlePromptSubmit}
                      className="bg-indigo-600 text-white px-4 py-1 rounded-md"
                    >
                      {prompting ? "Memproses..." : "Generate"}
                    </button>
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fasilitas{" "}
                    <span className="text-gray-500 text-xs">(Opsional)</span>
                  </label>
                  <div className="relative" ref={facilitiesRef}>
                    <button
                      type="button"
                      onClick={() => setFacilitiesOpen(!facilitiesOpen)}
                      className="w-full flex items-center justify-between border border-gray-300 rounded-md p-2.5 bg-white"
                    >
                      <span className="text-gray-500">Pilih fasilitas</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          facilitiesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Selected facilities tags */}
                    {formData.facilities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.facilities.map((facility) => (
                          <div
                            key={facility}
                            className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-sm"
                          >
                            <span>{facility}</span>
                            <button
                              type="button"
                              onClick={() =>
                                toggleSelect("facilities", facility)
                              }
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {facilitiesOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4">
                        <div className="grid grid-cols-2 gap-3">
                          {facilitiesOptions.map((facility) => (
                            <label
                              key={facility.value}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={formData.facilities.includes(
                                  facility.value
                                )}
                                onChange={() =>
                                  toggleSelect("facilities", facility.value)
                                }
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span>{facility.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
                    onFocus={() => setShowPromptRules(true)}
                    onBlur={() => setShowPromptRules(false)}
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
                <div
                  className={`flex w-full justify-between items-center gap-2 border border-[#202020]/20 transition-all ease-in-out duration-500 px-2 rounded-lg overflow-hidden ${
                    showPromptRules
                      ? "h-11 py-1 border-[#202020]/20"
                      : "h-0 py-0 border-0"
                  }`}
                >
                  <img src="shine.webp" alt="shine" className="w-4" />
                  <input
                    type="text"
                    placeholder="Generate dengan Ai"
                    onChange={(e) => setPromptRules(e.target.value)}
                    onFocus={() => setShowPromptRules(true)}
                    onBlur={() => setShowPromptRules(false)}
                    className="w-full outline-0"
                  />
                  <button
                    onClick={handlePromptRulesSubmit}
                    className="bg-indigo-600 text-white px-4 py-1 rounded-md"
                  >
                    {prompting ? "Memproses..." : "Generate"}
                  </button>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Unggah Foto Arena
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
                          id="image-upload-change"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-upload-change"
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
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer text-indigo-600 hover:text-indigo-800"
                      >
                        Upload image
                      </label>
                    </div>
                  )}
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

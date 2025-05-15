"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { ChevronDown, ImageIcon, Coins } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function CreateField() {
  const { actor, principal, icpIdrRate } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const { sports, arenaId } = location.state || {}
  const [newTime, setNewTime] = useState("")
  const [process, setProcess] = useState(false)
  const [showSportDropdown, setShowSportDropdown] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)

  useEffect(() => {
    if (!sports || !arenaId) {
      navigate(-1)
    }
  }, [sports, arenaId, navigate])

  const [form, setForm] = useState({
    name: "",
    sportType: sports?.[0] || "",
    size: "",
    price: "",
    priceUnit: "per jam",
    icpPrice: "",
    priceMethod: "icp",
    openTime: "08:00",
    closeTime: "20:00",
    interval: 60,
    availableTimes: [],
    image: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleChangePrice = (e) => {
    let current = 0
    const { name, value } = e.target
    console.log(name)
    if (form.priceMethod == "rp") {
      current = (value / Number(icpIdrRate)) * 10000000
    } else {
      current = value * 10000000
    }
    setForm((prev) => ({ ...prev, [name]: value }))
    setForm((prev) => ({ ...prev, icpPrice: Math.ceil(current) }))
  }

  const addTime = () => {
    if (newTime.trim() && !form.availableTimes.includes(newTime)) {
      setForm((prev) => ({
        ...prev,
        availableTimes: [...prev.availableTimes, newTime],
      }))
      setNewTime("")
    }
  }

  const removeTime = (time) => {
    setForm((prev) => ({
      ...prev,
      availableTimes: prev.availableTimes.filter((t) => t !== time),
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          image: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcess(true)

    if (!form.name || !form.sportType || !form.price || !form.availableTimes.length) {
      toast.error("Harap lengkapi semua data yang diperlukan.")
      setProcess(false)
      return
    }

    try {
      // In a real implementation, you would upload the image to a server here
      // and get back the URL. For now, we'll just use the data URL.
      const imageUrl = form.image || ""

      const result = await actor.createField(
        arenaId,
        form.name,
        form.description,
        form.sportType,
        form.size,
        BigInt(form.icpPrice),
        imageUrl,
        form.priceUnit,
        form.availableTimes,
        principal,
      )

      if (result) {
        setForm({
          name: "",
          description: "",
          sportType: sports?.[0] || "",
          size: "",
          price: "",
          priceUnit: "per jam",
          icpPrice: "",
          priceMethod: "icp",
          openTime: "08:00",
          closeTime: "20:00",
          interval: 60,
          availableTimes: [],
          image: null,
        })
        toast.success("Lapangan berhasil dibuat!")
        navigate(`/owner/arena/${arenaId}`)
      } else {
        toast.error("Gagal membuat lapangan: " + result.err)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Terjadi kesalahan saat membuat lapangan.")
    } finally {
      setProcess(false)
    }
  }

  function generateTimeSlots(openTime, closeTime, interval) {
    const slots = []
    const [openHour, openMinute] = openTime.split(":").map(Number)
    const [closeHour, closeMinute] = closeTime.split(":").map(Number)
    let start = new Date()
    start.setHours(openHour, openMinute, 0, 0)
    const end = new Date()
    end.setHours(closeHour, closeMinute, 0, 0)

    while (start < end) {
      const endSlot = new Date(start.getTime() + interval * 60000)
      if (endSlot > end) break

      const format = (date) => date.toTimeString().slice(0, 5)
      slots.push(`${format(start)} - ${format(endSlot)}`)
      start = endSlot
    }

    return slots
  }

  useEffect(() => {
    const newSlots = generateTimeSlots(form.openTime, form.closeTime, form.interval)
    setForm((prev) => ({ ...prev, availableTimes: newSlots }))
  }, [form.openTime, form.closeTime, form.interval])

  return (
    <div className="mx-auto p-6">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-2xl font-bold mb-1">Add Field</h1>
      <p className="text-gray-600 text-sm mb-6">
        Tambahkan jenis lapangan yang tersedia di arena kamu agar bisa dipesan oleh pelanggan.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6 grid gap-4 grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Nama Lapangan</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Masukkan nama"
              className="w-full border border-gray-300 rounded-md p-3 text-sm"
            />
          </div>
             <div className="space-y-2">
            <label className="block text-sm font-medium">Deskripsi Lapangan</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Masukkan deskripsi lapangan"
              className="w-full border border-gray-300 rounded-md p-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Ukuran Lapangan</label>
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="Masukkan ukuran"
              className="w-full border border-gray-300 rounded-md p-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Jenis</label>
            <div className="relative">
              <div
                className="w-full border border-gray-300 rounded-md p-3 text-sm flex justify-between items-center cursor-pointer"
                onClick={() => setShowSportDropdown(!showSportDropdown)}
              >
                <span className="text-gray-500">{form.sportType || "Pilih jenis"}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              {showSportDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {sports?.map((sport, i) => (
                    <div
                      key={i}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex items-center"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, sportType: sport }))
                        setShowSportDropdown(false)
                      }}
                    >
                      {sport === "Football" && <span className="mr-2">⚽</span>}
                      {sport === "Badminton" && <span className="mr-2">🏸</span>}
                      {sport}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Waktu Sewa</label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 mb-2">
                {form.availableTimes.slice(0, 3).map((time, i) => (
                  <div key={i} className="bg-indigo-600 text-white text-xs px-3 py-2 rounded whitespace-nowrap">
                    {time
                      .split(" - ")
                      .map((t) => t.split(":").slice(0, 2).join(":"))
                      .join(" - ")}
                  </div>
                ))}
              </div>
              <div
                className="w-full border border-gray-300 rounded-md p-3 text-sm flex justify-between items-center cursor-pointer mt-2"
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              >
                <span className="text-gray-500">Tambah Waktu</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              {showTimeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <select
                        name="openTime"
                        value={form.openTime}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <option key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                            {hour.toString().padStart(2, "0")}:00
                          </option>
                        ))}
                      </select>
                      <label className="block text-xs text-gray-500 mt-1">Waktu mulai</label>
                    </div>
                    <div className="col-span-1">
                      <select
                        name="closeTime"
                        value={form.closeTime}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <option key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                            {hour.toString().padStart(2, "0")}:00
                          </option>
                        ))}
                      </select>
                      <label className="block text-xs text-gray-500 mt-1">Waktu selesai</label>
                    </div>
                    <div className="col-span-1">
                      <input
                        type="number"
                        name="interval"
                        value={form.interval}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        min={15}
                        max={180}
                        step={15}
                      />
                      <label className="block text-xs text-gray-500 mt-1">Durasi</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
         <div className="space-y-2">
          <label className="block text-sm font-medium">Harga per jam</label>
          <div className="relative flex items-center">
            <input
              name="price"
              value={form.price}
              onChange={handleChangePrice}
              type="number"
              placeholder="Masukkan harga sewa"
              className="w-full border border-gray-300 rounded-md p-3 text-sm ps-12"
            />
            {form.priceMethod === "icp" ? (
              <img src="/icp.webp" alt="icp" className="w-7 absolute left-3" />
            ) : (
              <span className="absolute left-3 text-gray-500">Rp</span>
            )}
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  priceMethod: prev.priceMethod === "icp" ? "rp" : "icp",
                }))
              }
              className="absolute flex justify-center items-center gap-2 right-3 bg-indigo-600 text-white px-3 py-1 rounded text-sm"
            >
              <Coins className="h-6" />
              {form.priceMethod === "icp" ? "Rupiah" : "ICP"}
            </button>
          </div>
          <p className="text-sm text-[#202020]/60">
            Harga dalam {form.priceMethod === "icp" ? "Rupiah" : "ICP"}:{" "}
            {form.price && icpIdrRate
              ? form.priceMethod === "icp"
                ? (parseFloat(form.price) * icpIdrRate).toLocaleString(
                    "id-ID",
                    {
                      style: "currency",
                      currency: "IDR",
                    }
                  )
                : (parseFloat(form.price) / icpIdrRate).toFixed(2) + " ICP"
              : 0}
          </p>
        </div>
        </div>

        <div className="image">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Unggah Foto Lapangan</label>
            <div className="border border-gray-300 rounded-lg h-[300px] relative overflow-hidden">
              {form.image ? (
                <div className="relative w-full h-full group">
                  <img
                    src={form.image || "/placeholder.svg"}
                    alt="Field preview"
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
                  <label htmlFor="image-upload" className="cursor-pointer text-indigo-600 hover:text-indigo-800">
                    Upload image
                  </label>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={process}
            className={`w-full cursor-pointer ${
              process ? "bg-indigo-600/60" : "bg-indigo-600"
            } text-white py-3 rounded-md font-medium mt-4`}
          >
            {process ? "Memproses..." : "Simpan Lapangan"}
          </button>
        </div>
      </form>
    </div>
  )
}

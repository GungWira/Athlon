"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { ChevronDown, ImageIcon, Coins, X, AlertCircle } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function CreateField() {
  const { actor, principal, icpIdrRate } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const { sports, arenaId } = location.state || {}
  const [process, setProcess] = useState(false)
  const [showSportDropdown, setShowSportDropdown] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const [timeError, setTimeError] = useState("")

  useEffect(() => {
    if (!sports || !arenaId) {
      navigate(-1)
    }
  }, [sports, arenaId, navigate])

  const [form, setForm] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target

    // Special handling for interval to enforce minimum value
    if (name === "interval") {
      const intervalValue = Number.parseInt(value)
      if (isNaN(intervalValue) || intervalValue < 30) {
        setForm((prev) => ({ ...prev, interval: 30 }))
        return
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleChangePrice = (e) => {
    let current = 0
    const { name, value } = e.target
    if (form.priceMethod == "rp") {
      current = (value / Number(icpIdrRate)) * 10000000
    } else {
      current = value * 10000000
    }
    setForm((prev) => ({ ...prev, [name]: value }))
    setForm((prev) => ({ ...prev, icpPrice: Math.ceil(current) }))
  }

  const generateTimeSlots = (startTime, endTime, interval) => {
    // Ensure interval is at least 30 minutes to prevent crashes
    const safeInterval = Math.max(30, interval)

    const slots = []
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    let start = new Date()
    start.setHours(startHour, startMinute, 0, 0)

    const end = new Date()
    end.setHours(endHour, endMinute, 0, 0)

    // Validate time range
    if (start >= end) {
      setTimeError("Waktu selesai harus lebih besar dari waktu mulai")
      return []
    }

    // Calculate maximum number of slots to prevent excessive generation
    const timeDiffMinutes = (end - start) / (60 * 1000)
    const maxSlots = 48 // Reasonable maximum number of slots

    if (timeDiffMinutes / safeInterval > maxSlots) {
      setTimeError(`Interval terlalu kecil untuk rentang waktu ${timeDiffMinutes} menit. Harap tingkatkan interval.`)
      return []
    }

    setTimeError("") // Clear error if validation passes

    while (start < end) {
      const slotEnd = new Date(start.getTime() + safeInterval * 60000)
      if (slotEnd > end) break

      const formatTime = (date) => {
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
      }

      slots.push(`${formatTime(start)} - ${formatTime(slotEnd)}`)
      start = slotEnd
    }

    return slots
  }

  const updateTimeSlots = () => {
    const newSlots = generateTimeSlots(form.openTime, form.closeTime, form.interval)
    setForm((prev) => ({ ...prev, availableTimes: newSlots }))
  }

  useEffect(() => {
    updateTimeSlots()
  }, [form.openTime, form.closeTime, form.interval])

  const removeTimeSlot = (timeSlot) => {
    setForm((prev) => ({
      ...prev,
      availableTimes: prev.availableTimes.filter((t) => t !== timeSlot),
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
            <div className="border border-gray-300 rounded-lg p-4">
              {/* Display generated time slots */}
              <div className="flex flex-wrap gap-2 mb-4">
                {form.availableTimes.map((timeSlot, index) => (
                  <div
                    key={index}
                    className="bg-indigo-600 text-white text-xs px-3 py-2 rounded-md flex items-center gap-1"
                  >
                    {timeSlot}
                    <button type="button" onClick={() => removeTimeSlot(timeSlot)} className="ml-1 hover:text-gray-200">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Error message */}
              {timeError && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                  <AlertCircle className="text-red-500 h-4 w-4 mt-0.5" />
                  <p className="text-red-600 text-sm">{timeError}</p>
                </div>
              )}

              {/* Divider */}
              {form.availableTimes.length > 0 && <hr className="my-4 border-gray-200" />}

              {/* Time configuration inputs */}
              <div className="mt-2">
                <h3 className="text-sm font-medium mb-3">Tambah Waktu</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
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

                  <div>
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

                  <div>
                    <input
                      type="number"
                      name="interval"
                      value={form.interval}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      min={30}
                      max={180}
                      step={15}
                    />
                    <label className="block text-xs text-gray-500 mt-1">Interval (min. 30 menit)</label>
                  </div>
                </div>
              </div>
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
                  ? (Number.parseFloat(form.price) * icpIdrRate).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })
                  : (Number.parseFloat(form.price) / icpIdrRate).toFixed(2) + " ICP"
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

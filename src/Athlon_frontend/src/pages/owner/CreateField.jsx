"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { ChevronDown } from "lucide-react"

export default function CreateField() {
  const { actor, principal } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const { sports, arenaId } = location.state || {}
  const [newTime, setNewTime] = useState("")
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
    openTime: "08:00",
    closeTime: "20:00",
    interval: 60,
    availableTimes: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const result = await actor.createField(
        arenaId,
        form.name,
        form.sportType,
        form.size,
        BigInt(form.price),
        form.priceUnit,
        form.availableTimes,
        principal,
      )

      if (result) {
        setForm({
          name: "",
          sportType: sports?.[0] || "",
          size: "",
          price: "",
          priceUnit: "per jam",
          openTime: "08:00",
          closeTime: "20:00",
          interval: 60,
          availableTimes: [],
        })
        alert("Lapangan berhasil dibuat!")
        navigate(`/owner/arena/${arenaId}`)
      } else {
        alert("Gagal membuat lapangan: " + result.err)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan saat membuat lapangan.")
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

      const format = (date) => date.toTimeString().slice(0, 5) // "HH:MM"
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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Add Field</h1>
      <p className="text-gray-600 text-sm mb-6">
        Tambahkan jenis lapangan yang tersedia di arena kamu agar bisa dipesan oleh pelanggan.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Nama Lapangan</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan nama"
            className="w-full border border-gray-300 rounded-md p-3 text-sm"
            required
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
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            placeholder="Masukkan harga sewa"
            className="w-full border border-gray-300 rounded-md p-3 text-sm"
            required
          />
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium mt-4">
          Simpan Lapangan
        </button>
      </form>
    </div>
  )
}

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function CreateField() {
  const { actor, principal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { sports, arenaId } = location.state || {};
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (!sports || !arenaId) {
      navigate(-1);
    }
  }, [sports, arenaId, navigate]);

  const [form, setForm] = useState({
    name: "",
    sportType: sports?.[0] || "",
    size: "",
    price: "",
    priceUnit: "per jam",
    availableTimes: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addTime = () => {
    if (newTime.trim() && !form.availableTimes.includes(newTime)) {
      setForm((prev) => ({
        ...prev,
        availableTimes: [...prev.availableTimes, newTime],
      }));
      setNewTime("");
    }
  };

  const removeTime = (time) => {
    setForm((prev) => ({
      ...prev,
      availableTimes: prev.availableTimes.filter((t) => t !== time),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(form);

    try {
      const result = await actor.createField(
        arenaId,
        form.name,
        form.sportType,
        form.size,
        BigInt(form.price),
        form.priceUnit,
        form.availableTimes,
        principal
      );

      if (result) {
        setForm({
          name: "",
          sportType: sports?.[0] || "",
          size: "",
          price: "",
          priceUnit: "per jam",
          availableTimes: [],
        });
        alert("Lapangan berhasil dibuat!");
        navigate(`/owner/arena/${arenaId}`);
      } else {
        alert("Gagal membuat lapangan: " + result.err);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat membuat lapangan.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 p-4 border rounded"
    >
      <h2 className="text-xl font-semibold">Tambah Lapangan</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nama Lapangan"
        className="w-full border p-2 rounded"
        required
      />

      <select
        name="sportType"
        value={form.sportType}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        {sports?.map((sport, i) => (
          <option key={i} value={sport}>
            {sport}
          </option>
        ))}
      </select>

      <input
        name="size"
        value={form.size}
        onChange={handleChange}
        placeholder="Ukuran (contoh: 5x10m)"
        className="w-full border p-2 rounded"
      />

      <div className="flex gap-2">
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          placeholder="Harga"
          className="w-full border p-2 rounded"
        />
        <select
          name="priceUnit"
          value={form.priceUnit}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option>per jam</option>
          <option>per hari</option>
          <option>per sesi</option>
        </select>
      </div>

      <div className="border p-2 rounded">
        <label className="font-medium">Waktu Tersedia</label>
        <div className="flex gap-2 mt-1">
          <input
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="Contoh: 08:00 - 10:00"
            className="flex-1 border p-2 rounded"
          />
          <button
            type="button"
            onClick={addTime}
            className="bg-blue-500 text-white px-3 rounded"
          >
            Tambah
          </button>
        </div>
        <ul className="mt-2 space-y-1">
          {form.availableTimes.map((time, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded"
            >
              {time}
              <button
                type="button"
                onClick={() => removeTime(time)}
                className="text-red-500 hover:underline"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded"
      >
        Simpan Lapangan
      </button>
    </form>
  );
}

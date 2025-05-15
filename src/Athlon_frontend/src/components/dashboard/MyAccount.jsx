import { useState, useEffect } from "react";
import { Upload, Copy, RefreshCw } from "lucide-react";
import Loading from "../Loading";
import { useAuth } from "../../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Button from "../ui/Button";

export default function MyAccount({ datas, userData }) {
  if (!datas && !userData) return <Loading />;
  const { actor, principal, refreshUserData } = useAuth();
  const [balance, setBalance] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    walletAddress: "",
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.username || "",
        phone: userData.phoneNumber || "",
        walletAddress: userData.walletAddress || "",
        profileImage: userData.imageProfile[0] || null,
      });

      if (userData.imageProfile[0]) {
        setImagePreview(userData.imageProfile[0]);
      }
    }

    const fetchBalance = async () => {
      try {
        const result = await actor.getBalance(principal);
        if (result) {
          console.log(result);
          setBalance(Number(result) / 100000000);
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.log("Error fetchin data : ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [userData, actor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const refreshBalance = async () => {
    setIsSubmit(true);
    const result = await actor.getBalanceLedger(principal);
    if (result) {
      setBalance(Number(result.balance) / 100000000);
    } else {
      setBalance(0);
    }
    setIsSubmit(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Berhasil copy wallet address!")
      })
      .catch((err) => {
        toast.error("Gagal copy wallet address!")
        console.error("Failed to copy: ", err);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImagePreview(base64Image);
        setProfileData((prev) => ({
          ...prev,
          profileImage: base64Image,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmit(true);
      const result = await actor.updateProfile(
        principal,
        profileData.name,
        profileData.phone,
        profileData.profileImage ? profileData.profileImage : ""
      );
      if (result) {
        refreshUserData();
        toast.success("Berhasil update profile");
        setIsEditing(false);
      } else {
        toast.error("Gagal mengedit profile");
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-semibold mb-1">Akun Saya</h1>
      <p className="text-gray-600 mb-6">
        Lihat dan kelola semua informasi akun mu.
      </p>
      <div className="bg-indigo-600 rounded-xl p-4 my-8">
        <div className="flex justify-between">
          <h1 className="text-white text-lg lg:text-xl">Saldo ku</h1>
          <Button onClick={refreshBalance} icon={<RefreshCw className={isSubmit ? "animate-spin" : ""} />}>Refresh Balance</Button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="col-span-1 p-4 text-indigo-600 bg-[#CDE1FB] flex gap-2 flex-col rounded-lg">
            <h1 className="font-medium">Balance</h1>
            {balance ? (
              <h1 className="text-3xl font-semibold">{balance} ICP</h1>
            ) : (
              <div className="h-8 w-32 bg-indigo-600/70 rounded animate-pulse" />
            )}
          </div>
          <div className="col-span-3 p-4 text-indigo-600 bg-[#CDE1FB] flex gap-2 flex-col rounded-lg">
            <h1>Wallet Address</h1>
            <div className="flex bg-white p-2 rounded-lg gap-4 overflow-hidden relative">
              <h1 className="text-black">{profileData.walletAddress}</h1>
              <div className="absolute right-0 flex justify-end pr-2 w-12 bg-white cursor-pointer">
                <Copy className="h-full" onClick={() => copyToClipboard(profileData.walletAddress)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm lg:text-lg font-medium mb-2">Foto Profil</label>
          <div className="relative">
            <div className="border border-gray-300 rounded-md aspect-square h-64 flex items-center justify-center cursor-pointer overflow-hidden">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center">
                      <label
                        htmlFor="profile-image"
                        className="cursor-pointer text-white flex items-center"
                      >
                        <Upload size={16} className="mr-2" />
                        Upload File
                      </label>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <label
                  htmlFor="profile-image"
                  className="cursor-pointer text-gray-500 flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Upload File
                </label>
              )}
              {!isEditing && !imagePreview && (
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled
                />
              )}
              {isEditing && !imagePreview && (
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm lg:text-lg font-medium mb-2">
            Nama
          </label>
          {isEditing ? (
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Masukkan nama"
            />
          ) : (
            <div className="w-full border border-gray-300 rounded-md p-2.5 bg-white">
              {profileData.name || "Belum diisi"}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm lg:text-lg font-medium mb-2">
            Nomor Telepon
          </label>
          {isEditing ? (
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Masukkan nomor telepon"
            />
          ) : (
            <div className="w-full border border-gray-300 rounded-md p-2.5 bg-white">
              {profileData.phone || "Belum diisi"}
            </div>
          )}
        </div>

        <div>
          {isEditing ? (
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {isSubmit ? "Mengedit..." : "Simpan Perubahan"}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Edit Profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

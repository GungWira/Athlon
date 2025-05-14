
import { useState, useEffect } from "react"
import { Upload } from "lucide-react"
import Loading from "../Loading" // Assuming you have a Loading component
import { useAuth } from "../../contexts/AuthContext"
import toast, { Toaster } from "react-hot-toast"
export default function AkunSaya({ datas, userData }) {

    if (!datas && !userData) return <Loading />
    const { actor, principal } = useAuth()
    const [isSubmit, setIsSubmit] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [profileData, setProfileData] = useState({
        name: "",
        phone: "",
        walletAddress: "",
        profileImage: null,
    })
    const [imagePreview, setImagePreview] = useState(null)

    useEffect(() => {
        if (userData) {
            setProfileData({
                name: userData.username || "",
                phone: userData.phoneNumber || "",
                walletAddress: userData.walletAddress || "",
                profileImage: userData.imageProfile[0] || null,
            })

            if (userData.imageProfile[0]) {
                setImagePreview(userData.imageProfile[0])
            }
        }
    }, [userData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

   const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64Image = reader.result
            setImagePreview(base64Image)
            setProfileData((prev) => ({
                ...prev,
                profileImage: base64Image,
            }))
        }
        reader.readAsDataURL(file)
    }
}

    const handleSubmit = async () => {
        console.log("Saving profile data:", profileData)
        try {
            setIsSubmit(true)
            console.log(profileData.profileImage)
            const result = await actor.updateProfile(
                principal,
                profileData.name,
                profileData.phone,
                profileData.profileImage
            )
            if (result) {
                console.log("Berhasil update:", result);
                toast.success("Berhasil update profile")
                setIsEditing(false);
            } else {
                console.error("Gagal update profil");
                toast.error("Gagal mengedit profile")
                setIsEditing(false)
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmit(false)
        }
    }


    return (
        <div className="">
            <Toaster position="top-right" reverseOrder={false} />
            <h1 className="text-2xl font-bold mb-1">Profil</h1>
            <p className="text-gray-600 mb-6">Lihat informasi mengenai profil akun mu</p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Foto Profil</label>
                    <div className="relative">
                        <div className="border border-gray-300 rounded-md aspect-square h-64 flex items-center justify-center cursor-pointer overflow-hidden">
                            {imagePreview ? (
                                <div className="relative w-full h-full">
                                    <img src={imagePreview || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center">
                                            <label htmlFor="profile-image" className="cursor-pointer text-white flex items-center">
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
                                <label htmlFor="profile-image" className="cursor-pointer text-gray-500 flex items-center">
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
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
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
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
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

                {!isEditing && (
                    <div>
                        <label htmlFor="walletAddress" className="block text-sm font-medium mb-2">
                            Wallet Address
                        </label>
                        <div className="w-full border border-gray-300 rounded-md p-2.5 bg-white">
                            {profileData.walletAddress || "Belum diisi"}
                        </div>
                    </div>
                )}

                <div>
                    {isEditing ? (
                        <button
                            onClick={handleSubmit}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Simpan
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
    )
}

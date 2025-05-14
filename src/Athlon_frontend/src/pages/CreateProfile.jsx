"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getAccountIdentifierFromPrincipal } from "../utils/icpUtils";
import Button from "../components/ui/Button";
import Navbar from "../components/Navbar";

export default function CreateProfile() {
  const {
    principal,
    actor,
    logout,
    userData,
    isAuthenticated,
    refreshUserData,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from || "/";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (userData?.userType) {
      navigate("/owner", { replace: true });
    }
  }, [isAuthenticated, userData, fromPath, navigate]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    imageProfile: null,
    userType: "",
    walletAddress: "",
    phoneNumber: "",
    preferedSports: [],
  });

  const [walletLocked, setWalletLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "walletAddress" && walletLocked) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageProfile: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const generateWalletAddress = () => {
    const wallet = getAccountIdentifierFromPrincipal(principal);
    setFormData((prev) => ({ ...prev, walletAddress: wallet }));
    setWalletLocked(true);
  };

  const handleSportToggle = (sport) => {
    setFormData((prev) => {
      const currentSports = [...prev.preferedSports];
      if (currentSports.includes(sport)) {
        return {
          ...prev,
          preferedSports: currentSports.filter((s) => s !== sport),
        };
      } else {
        return { ...prev, preferedSports: [...currentSports, sport] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await actor.createNewUser(
        principal,
        formData.username,
        formData.imageProfile ? [formData.imageProfile] : [],
        formData.userType,
        formData.walletAddress,
        formData.phoneNumber,
        [],
        formData.preferedSports.length > 0 ? [formData.preferedSports] : []
      );
      await refreshUserData();

      if (formData.userType === "owner") {
        navigate("/owner");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to create profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && formData.userType === "customer") {
      setStep(3);
    }
  };

  const renderStepOne = () => {
    return (
      <div className="w-full mx-auto max-w-6xl py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Select role?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            className={`border rounded-lg p-4 h-64 flex flex-col cursor-pointer ${
              formData.userType === "owner"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200"
            }`}
            onClick={() =>
              setFormData((prev) => ({ ...prev, userType: "owner" }))
            }
          >
            <div className="flex pt-3 justify-between w-full px-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-2">
                <img src="cheer.webp" alt="" className="" />
              </div>
              <div
                className={`w-8 h-8 rounded-full border ${
                  formData.userType === "owner"
                    ? "border-indigo-500"
                    : "border-gray-300"
                } mr-2 flex items-center justify-center `}
              >
                {formData.userType === "owner" && (
                  <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                )}
              </div>
            </div>

            <div className="flex justify-start mt-8 px-4">
              <p className="text-lg lg:text-2xl font-medium">
                Saya Owner, Ingin Publish Lapangan
              </p>
            </div>
          </div>

          <div
            className={`border rounded-lg p-4 h-64 flex flex-col cursor-pointer ${
              formData.userType === "customer"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200"
            }`}
            onClick={() =>
              setFormData((prev) => ({ ...prev, userType: "customer" }))
            }
          >
            <div className="flex pt-3 justify-between w-full px-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2">
                <img src="self-employed.webp" alt="customer" />
              </div>

              <div className="mb-1">
                <div
                  className={`w-8 h-8 rounded-full border ${
                    formData.userType === "customer"
                      ? "border-indigo-500"
                      : "border-gray-300"
                  } mr-2 flex items-center justify-center`}
                >
                  {formData.userType === "customer" && (
                    <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-start mt-8 px-4">
              <p className="text-lg lg:text-2xl font-medium">
                Saya Customer, Ingin Booking Lapangan
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-end">
          <Button
            onClick={handleNextStep}
            disabled={!formData.userType}
            className={`py-2 rounded-md text-white font-medium ${
              formData.userType
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    );
  };

  const renderStepTwo = () => {
    return (
      <div className="bg-white rounded-lg w-full mx-auto p-6">
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Create {formData.userType === "owner" ? "Owner" : "Customer"}{" "}
              Account
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <p className="text-sm font-medium mb-2">Unggah Foto Profil</p>
              <label htmlFor="profile-image" className="cursor-pointer block">
                <div className="border border-gray-200 rounded-md aspect-square flex items-center justify-center bg-gray-100 overflow-hidden">
                  {formData.imageProfile ? (
                    <img
                      src={formData.imageProfile || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#cccccc"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image"
              />
            </div>

            <div className="col-span-1 space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Username</p>
                <input
                  type="text"
                  name="username"
                  placeholder="Masukkan nama"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-2 rounded-md text-sm"
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Nomor Telepon</p>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Masukkan alamat"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-2 rounded-md text-sm"
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Wallet Address</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="walletAddress"
                    placeholder="Masukkan wallet"
                    required
                    value={formData.walletAddress}
                    onChange={handleChange}
                    className={`w-full border border-gray-200 p-2 rounded-md text-sm ${
                      walletLocked ? "bg-gray-100 text-gray-500" : ""
                    }`}
                    disabled={walletLocked}
                  />
                  <button
                    type="button"
                    onClick={generateWalletAddress}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700 flex items-center"
                    disabled={walletLocked}
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={
                    formData.userType === "owner"
                      ? handleSubmit
                      : handleNextStep
                  }
                  disabled={
                    loading ||
                    !formData.username ||
                    !formData.walletAddress ||
                    !formData.phoneNumber
                  }
                  className={`w-full py-2 rounded-md text-white font-medium ${
                    loading ||
                    !formData.username ||
                    !formData.walletAddress ||
                    !formData.phoneNumber
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading
                    ? "Creating..."
                    : formData.userType === "owner"
                    ? "Buat Akun"
                    : "Selanjutnya"}
                </button>
              </div>
            </div>
          </div>

          {message.text && (
            <p
              className={`text-sm mt-2 ${
                message.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderStepThree = () => {
    return (
      <div className="bg-white rounded-lg w-full mx-auto p-6">
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Customize Your Arena Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <p className="text-sm font-medium mb-4">
                Pilih Olahraga Favoritmu!
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => handleSportToggle("Badminton")}
                  className={`flex items-center px-3 py-1 rounded-full border ${
                    formData.preferedSports.includes("Badminton")
                      ? "bg-indigo-600 text-white"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="mr-1">🏸</span> Badminton
                  <span className="ml-1">
                    {formData.preferedSports.includes("Badminton") ? "" : "+"}
                  </span>
                </button>

                <button
                  onClick={() => handleSportToggle("Basketball")}
                  className={`flex items-center px-3 py-1 rounded-full border ${
                    formData.preferedSports.includes("Basketball")
                      ? "bg-indigo-600 text-white"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="mr-1">🏀</span> Basketball
                  <span className="ml-1">
                    {formData.preferedSports.includes("Basketball") ? "" : "+"}
                  </span>
                </button>

                <button
                  onClick={() => handleSportToggle("Voley Ball")}
                  className={`flex items-center px-3 py-1 rounded-full border ${
                    formData.preferedSports.includes("Voley Ball")
                      ? "bg-indigo-600 text-white"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="mr-1">🏐</span> Voley Ball
                  <span className="ml-1">
                    {formData.preferedSports.includes("Voley Ball") ? "" : "+"}
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => handleSportToggle("Tennis")}
                  className={`flex items-center px-3 py-1 rounded-full border ${
                    formData.preferedSports.includes("Tennis")
                      ? "bg-indigo-600 text-white"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="mr-1">🎾</span> Tennis
                  <span className="ml-1">
                    {formData.preferedSports.includes("Tennis") ? "" : "+"}
                  </span>
                </button>

                <button
                  onClick={() => handleSportToggle("Football")}
                  className={`flex items-center px-3 py-1 rounded-full border ${
                    formData.preferedSports.includes("Football")
                      ? "bg-indigo-600 text-white"
                      : "border-gray-300 text-gray-700 "
                  }`}
                >
                  <span className="mr-1">⚽</span> Football
                  <span className="ml-1">
                    {formData.preferedSports.includes("Football") ? "" : "+"}
                  </span>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading || formData.preferedSports.length === 0}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    loading || formData.preferedSports.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? "Creating..." : "Selesai"}
                </button>

                <button className="px-6 py-2 rounded-md text-gray-600 font-medium border border-gray-300 hover:bg-gray-50">
                  Lewati
                </button>
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-indigo-600 rounded-lg overflow-hidden h-64 relative flex justify-center items-end">
                <img
                  src="create-img.webp"
                  alt="Image"
                  className="h-[90%] relative z-40"
                />
                <img
                  src="profile-orn-2.webp"
                  alt="orn"
                  className="w-[30%] absolute top-4 right-4"
                />
                <img
                  src="profile-orn-1.webp"
                  alt="orn"
                  className="w-[30%] absolute bottom-4 left-4"
                />
                <img
                  src="hero-orn-3.webp"
                  alt="orn"
                  className="h-full absolute -left-8"
                />
                <img
                  src="hero-orn-3.webp"
                  alt="orn"
                  className="h-full absolute -right-8"
                />
              </div>
            </div>
          </div>

          {message.text && (
            <p
              className={`text-sm mt-2 ${
                message.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render the appropriate step
  return (
    <div className="min-h-screen flex items-start justify-center">
      <div className="bg-white rounded-lg w-full ">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-gray-500">
              Step {step} of {formData.userType === "owner" ? "2" : "3"}
            </p>
            {step > 1 && (
              <button
                className="text-gray-500"
                onClick={() => setStep(step - 1)}
              >
                ✕
              </button>
            )}
            {step === 1 && (
              <button
                className="text-gray-500"
                disabled
                onClick={() => navigate(fromPath)}
              >
                ✕
              </button>
            )}
          </div>

          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}
        </div>
      </div>
    </div>
  );
}

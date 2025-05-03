import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getAccountIdentifierFromPrincipal } from "../utils/icpUtils";

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
    if (!isAuthenticated || userData) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, userData, fromPath, navigate]);

  const [formData, setFormData] = useState({
    username: "",
    imageProfile: null,
    userType: "owner",
    walletAddress: "",
    phoneNumber: "",
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
        []
      );
      await refreshUserData();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to create profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Create Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={formData.username}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-2">
          <input
            type="text"
            name="walletAddress"
            placeholder="Wallet Address"
            required
            value={formData.walletAddress}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${
              walletLocked ? "bg-gray-100 text-gray-500" : ""
            }`}
            disabled={walletLocked}
          />
          <button
            type="button"
            onClick={generateWalletAddress}
            className="bg-gray-200 px-3 rounded hover:bg-gray-300"
            disabled={walletLocked}
          >
            Generate
          </button>
        </div>

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          required
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        <select
          name="userType"
          disabled
          value={formData.userType}
          className="w-full border p-2 rounded bg-gray-100 text-gray-500"
        >
          <option value="owner">Owner</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Creating..." : "Create Profile"}
        </button>

        {message.text && (
          <p
            className={`text-sm ${
              message.type === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

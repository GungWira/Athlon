import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Testing() {
  const { actor, principal, userData } = useAuth();
  const [amount, setAmount] = useState("");

  const handleCheckBalance = async () => {
    const result = await actor.getBalance(principal);
    console.log(userData);
    console.log("User balance: ", result);
  };

  const handleDeduct = async () => {
    try {
      const result = await actor.deductBalance(principal, parseInt(amount));
      if ("ok" in result) {
        console.log("Saldo setelah dikurangi:", result.ok);
      } else {
        console.error("Gagal mengurangi saldo:", result.err);
      }
    } catch (error) {
      console.error("Deduct error:", error);
    }
  };
  return (
    <div>
      <h1>Testing Page</h1>
      <button
        onClick={handleCheckBalance}
        style={{ marginLeft: "10px", padding: "8px 16px" }}
      >
        Check Balance
      </button>
      <br />
      <br />
      <br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginLeft: "10px" }}
      />
      <button onClick={handleDeduct} style={{ marginLeft: "10px" }}>
        Kurangi Saldo
      </button>
    </div>
  );
}

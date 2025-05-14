import React, { act, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";

export default function Testing() {
  const { actor, principal, userData, icpIdrRate } = useAuth();
  const [balance, setBalance] = useState(null);
  const [promnt, setPromnt] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [actor]);

  const handleCheckBalance = async () => {
    const result = await actor.getBalanceLedger(principal);
    if (result) {
      setBalance(Number(result.balance) / 100000000);
    } else {
      setBalance(0);
    }
    console.log(userData);
    console.log("User balance: ", result);
  };

  const handlePrompt = async () => {
    // TESTING DISINI
    const res = await actor.generateDesc(promnt);
    console.log(res);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Testing Page</h1>
      <div className="flex gap-4 justify-start items-center">
        <p>
          Saldo Anda : <span className="font-bold">{balance}</span>
        </p>
        <button
          onClick={handleCheckBalance}
          className="bg-blue-600 text-white"
          style={{ marginLeft: "10px", padding: "8px 16px" }}
        >
          Check Balance
        </button>
      </div>
      <p>Address : {userData.walletAddress}</p>

      <br />
      <br />
      <br />

      <input
        type="text"
        placeholder="promt..."
        value={promnt}
        onChange={(e) => setPromnt(e.target.value)}
      />
      <button onClick={handlePrompt}>Promt!</button>
    </div>
  );
}

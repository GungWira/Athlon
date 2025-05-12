import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";

export default function DashboardCustomer() {
  const { actor, principal } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (actor) {
          const result = await actor.getDashboardCustomer(principal);
          console.log(result);
        }
      } catch (error) {
        console.log("Error fetching data : ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [actor]);

  if (loading) return <Loading />;
  return (
    <div className="">
      <div>DashboardCustomer</div>
    </div>
  );
}

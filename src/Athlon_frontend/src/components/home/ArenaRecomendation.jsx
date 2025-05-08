import React, { useEffect, useState } from "react";
import TrendingSportCenter from "./TrendingSportCenter";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../Loading";

export default function ArenaRecomendation() {
  const { actor, principal } = useAuth();
  const [arenasData, setArenasData] = useState({ newest: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      if (actor) {
        try {
          setLoading(true);
          const result = await actor.getArenaRecommendation(
            principal == null ? [] : [principal]
          );
          console.log(result);
          if (result) {
            setArenasData(result);
          }
        } catch (error) {
          console.log("Error fetching arena's data : ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [actor, principal]);

  if (loading) return <Loading />;
  return (
    <>
      <TrendingSportCenter datas={arenasData.newest} />
    </>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";

export default function DashboardOwner() {
  const { actor, principal } = useAuth();
  const navigate = useNavigate();
  const [arenas, setArenas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArena = async () => {
      try {
        if (actor) {
          const result = await actor.getArenasByOwner(principal);
          if (result) {
            setArenas(result);
          } else {
            setArenas([]);
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArena();
  }, [actor]);

  if (loading && !arenas) return <Loading />;

  return (
    <div>
      <h1>DashboardOwner</h1>
      <Link to={{ pathname: "/owner/create-arena" }}>
        <button>Buat Arena</button>
      </Link>
      {arenas.map((arena, id) => (
        <div
          key={id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            margin: "8px 0",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/owner/arena/${arena.id}`)}
        >
          <h2>{arena.name}</h2>
          <p>{arena.description}</p>
        </div>
      ))}
    </div>
  );
}

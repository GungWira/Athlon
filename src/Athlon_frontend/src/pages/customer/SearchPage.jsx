import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { CardArena } from "../../components/home/CardArena";

export default function SearchPage() {
  const { actor } = useAuth();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [arenas, setArenas] = useState(null);

  const name = params.get("name");
  const city = params.get("city");
  const sport = params.get("sport");

  useEffect(() => {
    const fetchArena = async () => {
      if (actor) {
        try {
          const result = await actor.searchArenas(
            name ? [name] : [],
            city ? [city] : [],
            sport ? [sport] : []
          );
          if (result) {
            setArenas(result);
          } else {
            setArenas([]);
          }
        } catch (error) {
          console.log("Error fetching data : ", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchArena();
  }, [actor]);

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Hasil Pencarian Terkait</h1>
      {arenas.length == 0 ? (
        <p>Tidak ada data yang sesuai bang</p>
      ) : (
        arenas.map((arena, key) => (
          <Link to={`/arena/${arena.id}`} key={key}>
            <CardArena
              image={arena.images[0]}
              name={arena.name}
              location={arena.city}
              price={0}
              description={arena.description}
              tag={arena.sports[0]}
              tagColor={arena.tagColor}
              timeSlots={arena.timeSlots}
            />
          </Link>
        ))
      )}
    </div>
  );
}

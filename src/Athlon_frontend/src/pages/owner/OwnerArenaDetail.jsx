import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";

export default function OwnerArenaDetail() {
  const { idArena } = useParams();
  const navigate = useNavigate();
  const { principal, isAuthenticated, actor } = useAuth();

  const [arenaData, setArenaData] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !principal) {
      navigate("/", { replace: true });
      return;
    }

    const fetchArena = async () => {
      try {
        const result = await actor.getArenaById(idArena);
        if (!result) {
          navigate(-1);
          return;
        }

        const ownerMatch = result[0].owner.toText() === principal.toText();
        if (!ownerMatch) {
          navigate(-1);
        } else {
          setArenaData(result[0]);

          const resultFields = await actor.getFieldsByArena(idArena);
          if (resultFields) {
            setFieldData(resultFields);
          } else {
            setFieldData([]);
          }
        }
      } catch (err) {
        console.error("Error fetching arena:", err);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchArena();
  }, [idArena, principal, isAuthenticated, navigate]);

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Arena Details</h1>
      {arenaData ? (
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          nama arena : {arenaData.name}
          <br />
          lokasi : {arenaData.city}
          <br /> <br />
          <Link
            to={{ pathname: "/owner/arena/add-field" }}
            state={{ arenaId: idArena, sports: arenaData.sports }}
          >
            Add Field
          </Link>
          <div className="flex flex-col justify-start items-start mt-8 gap-8">
            {fieldData.map((field, key) => (
              <div className="flex flex-col gap-4" key={key}>
                <p>{field.name}</p>
                <div className="grid flex-row grid-cols-4 gap-2">
                  {field.availableTimes.map((item, keyItem) => (
                    <div className="bg-blue-200 px-2 py-1" key={keyItem}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </pre>
      ) : (
        <p>No arena data found.</p>
      )}
    </div>
  );
}

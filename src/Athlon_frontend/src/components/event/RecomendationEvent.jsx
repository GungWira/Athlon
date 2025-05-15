import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import CardComunity from "../community/CardComunity";

export default function RecomendationEvent() {
  const { actor } = useAuth();
  const [datas, setDatas] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (actor) {
        try {
          const res = await actor.getEvents();
          setDatas(res);
        } catch (error) {
          console.log("Error fetching data : ", error);
        }
      }
    };
    fetchData();
  }, [actor]);
  return (
    <div className="w-full flex flex-col justify-start items-start gap-8 mt-12">
      <div className="flex flex-col justify-start items-start gap-2 mb-8">
        <h2 className="text-2xl font-bold text-[#202020]">Sport's Event</h2>
        <p className="text-base text-[#202020]/80">
          Event olahraga yang siap bikin kamu tambah semangat olahraga!
        </p>
      </div>
      <div className="grid grid-cols-4 justify-start items-start gap-3 w-full">
        {datas.map((data, key) => (
          <CardComunity
            key={key}
            id={data.id}
            banner={data.banner}
            profile={data.communityProfile}
            title={data.title}
            description={data.description}
            members={data.participant}
            sports={data.sport}
            isEvent={true}
          />
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { PersonStanding, Volleyball } from "lucide-react";
import { Link } from "react-router-dom";

export default function CardComunity({
  banner,
  profile,
  title,
  description,
  members,
  sports,
  id,
}) {
  return (
    <Link
      to={"/community/" + id}
      className="flex flex-col w-full justify-start items-start gap-6 overflow-hidden rounded-2xl cursor-pointer hover:bg-slate-50 border-[#202020]/5 border"
    >
      <div
        className={`w-full aspect-video bg-red-50 relative flex justify-center items-center bg-center bg-cover`}
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="w-[25%] aspect-square rounded-full bg-red-500 absolute -bottom-12 overflow-hidden">
          <img src={profile} alt={title} />
        </div>
      </div>
      <div className="w-full px-3 py-4 pb-6 ">
        <p className="text-[#202020] font-semibold text-lg">{title}</p>
        <p className="text-[#202020]/80 mb-2 text-base">{description}</p>
        <div className="flex flex-row justify-start items-start gap-3">
          <div className="flex flex-row justify-center items-center gap-1 rounded-full bg-[#5336E8]/5 px-4 py-1">
            <PersonStanding className="text-[#5336E8]" />
            <p className="text-sm text-[#5336E8] font-medium">
              {members.length} Member
            </p>
          </div>
          <div className="flex flex-row justify-center items-center gap-1 rounded-full bg-[#5336E8]/5 px-4 py-1">
            <Volleyball className="text-[#5336E8]" />
            <p className="text-sm text-[#5336E8] font-medium">
              {sports[0]} {sports.length > 1 ? sports.length - 1 + "+" : ""}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

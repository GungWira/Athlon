import React from "react";
import { Link } from "react-router-dom";
export function CardArena({
  id,
  image,
  name,
  location,
  price,
  description,
  tag,
  isOwner = false,
}) {
  return (
    <Link to={`${isOwner ? "/owner" : ""}/arena/${id}`}>
      <div className="w-full max-w-3xl bg-white rounded-md flex flex-col gap-4 overflow-hidden border border-[#202020]/10">
        <div className="relative w-full aspect-video overflow-hidden">
          <img src={image} alt={`Image ${name} ${location}`} />
          <div className="absolute top-4 right-4 bg-white rounded-full text-indigo-700 px-4 py-1 text-sm">
            {tag.length == 1 ? tag : `${tag} ${tag.length - 1}+`}
          </div>
        </div>
        <div className="flex flex-col bg-white px-3 py-1 justify-start items-start gap-4">
          <div className="flex flex-col justify-start items-start gap-1">
            <p className="text-base font-semibold text-[#202020] line-clamp-2">
              {name}
            </p>
            <p className="text-sm text-[#202020]/80 line-clamp-2">
              {description}
            </p>
            <div className="flex flex-row justify-start items-start gap-1 mt-2 pb-4">
              <div className="bg-[#5336E8]/5 rounded-full text-indigo-700 px-4  flex flex-row justify-center items-center gap-2 py-1 text-xs">
                <img src="/location.webp" alt="location icon" className="w-4" />
                {location}
              </div>
              <div className="bg-[#5336E8]/5 rounded-full text-indigo-700 flex flex-row justify-center items-center gap-2  px-4 py-1 text-xs">
                <img src="/arena.webp" alt="arena icon" className="w-4" />
                Lengkap
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

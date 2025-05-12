import React from "react";
import { useNavigate } from "react-router-dom";
export function SportCategory({ icon: Icon, name }) {
  const navigate = useNavigate();
  const handleSearchBySport = () => {
    navigate(`/search?${name}`);
  };
  return (
    <div
      onClick={handleSearchBySport}
      className="flex flex-col justify-center items-center gap-4 hover:gap-3 group transition-all duration-300"
    >
      <div className="flex justify-center items-center max-w-56 aspect-square overflow-hidden relative cursor-pointer shadow-sm shadow-indigo-700/20 rounded-xl">
        <img
          src="/categori-bg.webp"
          alt="bg-categori"
          className="w-full relative z-0"
        />
        <div className="aspect-square w-[60%] bg-indigo-700 rounded-full absolute z-20"></div>
        <div className="aspect-square w-[62%] bg-[#D3F41B] rounded-full absolute z-10 translate-x-1 -translate-y-1 group-hover:-translate-y-0 group-hover:translate-x-0 transition-all duration-300"></div>
        <Icon className={"w-[25%] h-[25%] text-white absolute z-30"} />
      </div>
      <p className="text-[#202020]/80 text-base font-medium">{name}</p>
    </div>
  );
}

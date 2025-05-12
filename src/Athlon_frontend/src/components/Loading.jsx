import React from "react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex flex-col justify-center items-center w-full h-screen"
    >
      <video
        src="/loading.webm"
        autoPlay
        loop
        muted
        playsInline
        className="w-48 h-48"
      >
        Sorry, your browser doesn't support embedded videos.
      </video>
      <p className="animate-bounce my-16 text-xl">Loading ...</p>
    </div>
  );
}

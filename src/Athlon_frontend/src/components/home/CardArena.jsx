import React from "react"
export function CardArena({ image, name, location, price, description, tag, tagColor = "white", timeSlots }) {
  const tagStyles = {
    white: "bg-white",
    indigo: "bg-indigo-100 text-indigo-600",
  }

  return (
    <div className="border border-indigo-600/15 rounded-lg overflow-hidden">
      <div className="relative">
        <img
          src={image || "https://picsum.photos/1920/1080?random"}
          alt={name}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        {tag && (
          <div className={`absolute top-4 right-4 ${tagStyles[tagColor]} rounded-full px-3 py-1 text-sm`}>{tag}</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-sm text-gray-600">{description || location}</p>
        {!timeSlots && description && (
          <div className="mt-2 inline-block bg-gray-200 px-2 py-1 rounded text-sm">{location}</div>
        )}
        <div className="mt-2 font-bold">{price}</div>

        {timeSlots && (
          <>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {timeSlots.slice(0, 4).map((slot) => (
                <div
                  key={slot.time}
                  className={`text-center py-1 rounded-md text-sm ${
                    !slot.available ? "bg-gray-100 text-gray-500" : "bg-indigo-600 text-white"
                  }`}
                >
                  {slot.time}
                </div>
              ))}
            </div>
            {timeSlots.length > 4 && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {timeSlots.slice(4, 8).map((slot) => (
                  <div
                    key={slot.time}
                    className={`text-center py-1 rounded-md text-sm ${
                      !slot.available ? "bg-gray-100 text-gray-500" : "bg-indigo-600 text-white"
                    }`}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

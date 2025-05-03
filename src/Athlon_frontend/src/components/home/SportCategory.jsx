import React from "react"
export function SportCategory({ icon: Icon, name }) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-100 rounded-full transform scale-125"></div>
          <div className="relative bg-indigo-600 text-white p-4 rounded-full border-4 border-yellow-300">
            <Icon className="h-8 w-8" />
          </div>
        </div>
        <span className="mt-2 text-sm text-center">{name}</span>
      </div>
    )
  }
  
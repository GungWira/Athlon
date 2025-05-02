import React from 'react'

export default function Button({children, onClick, type="button", className=""}) {

    const variant = "bg-blue-500 text-primary-foreground hover:bg-primary/90"
  return (
    <button
    type={type}
    onClick={onClick}
    className={`${variant} px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`}>
        {children}
    </button>
  )
}

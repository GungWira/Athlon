import React from "react"

const baseClass =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

// Variants manual
const variantClasses = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-600",
  secondary: "bg-white text-indigo-600 border border-indigo-200 hover:bg-gray-100 focus-visible:ring-indigo-600",
  outline: "border border-indigo-200 bg-transparent text-indigo-600 hover:bg-indigo-50 focus-visible:ring-indigo-600",
  ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50 focus-visible:ring-indigo-600",
  destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
  success: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600",
  warning: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500",
  link: "text-indigo-600 underline-offset-4 hover:underline p-0 h-auto font-normal",
}

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-5 text-base",
  lg: "h-12 px-6 text-lg",
  icon: "h-10 w-10 p-0",
}

const roundedClasses = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
}

const iconPositionClasses = {
  left: "flex-row",
  right: "flex-row-reverse",
}

const Button = React.forwardRef(
  (
    {
      children,
      icon,
      variant = "primary",
      size = "md",
      rounded = "full",
      iconPosition = "left",
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const combinedClass = [
      baseClass,
      variantClasses[variant],
      sizeClasses[size],
      roundedClasses[rounded],
      iconPositionClasses[iconPosition],
      className,
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <button type={type} className={combinedClass} ref={ref} {...props}>
        {icon}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button


import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  default:
    "bg-[#EAB308] text-[#121417] font-semibold hover:bg-[#CA8A04] shadow-sm hover:shadow-gold-glow active:scale-[0.98] border border-transparent",
  secondary:
    "bg-[#2B2F36] text-white hover:bg-[#373C45] hover:text-white border border-[#373C45]",
  outline:
    "border border-[#2B2F36] bg-transparent hover:bg-[#1E2126] hover:text-[#EAB308] hover:border-[#EAB308]/40 text-white",
  ghost:
    "hover:bg-[#1E2126] hover:text-white text-[#9CA3AF]",
  goldOutline:
    "border border-[#EAB308]/50 text-[#EAB308] bg-[#EAB308]/5 hover:bg-[#EAB308]/15 hover:border-[#EAB308]",
  destructive:
    "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:text-red-300",
};

const buttonSizes = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 rounded-lg px-3 text-xs",
  lg: "h-11 rounded-xl px-6 text-base font-semibold",
  icon: "h-9 w-9 rounded-lg p-0 flex items-center justify-center",
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121417] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
          buttonVariants[variant] || buttonVariants.default,
          buttonSizes[size] || buttonSizes.default,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

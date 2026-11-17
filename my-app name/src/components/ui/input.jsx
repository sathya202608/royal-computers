import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-[#2B2F36] bg-[#121417] px-3 py-2 text-sm text-white placeholder:text-[#6B7280] focus-visible:outline-none focus-visible:border-[#EAB308] focus-visible:ring-1 focus-visible:ring-[#EAB308] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

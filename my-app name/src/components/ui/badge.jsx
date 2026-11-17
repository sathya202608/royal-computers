import * as React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
  default: "bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30",
  secondary: "bg-[#2B2F36] text-[#9CA3AF] border border-[#373C45]",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  destructive: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  outline: "text-white border border-[#2B2F36]",
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

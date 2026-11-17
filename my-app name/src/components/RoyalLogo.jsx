import React from "react";
import logoImg from "../assets/image.png";

export function RoyalLogo({ className = "", size = 40, showText = true }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-gradient-to-br from-[#242830] to-[#16181C] border border-[#EAB308]/40 shadow-gold-glow-subtle group-hover:border-[#EAB308] transition-all duration-300">
        <img
          src={logoImg}
          alt="Royal Computers Logo"
          style={{ width: size, height: size }}
          className="object-contain drop-shadow-[0_2px_8px_rgba(234,179,8,0.4)] rounded-lg"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold tracking-wider text-white uppercase font-sans">
              ROYAL COMPUTERS
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#EAB308] tracking-widest uppercase">
              XEROX SHOP
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#EAB308]/80"></span>
            <span className="text-[10px] text-[#9CA3AF] tracking-tight">
              ESTD 2012
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

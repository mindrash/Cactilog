interface CactusIconProps {
  className?: string;
  size?: number;
}

export default function CactusIcon({ className = "", size = 24 }: CactusIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Main barrel body - wider, more rounded */}
      <ellipse
        cx="12"
        cy="14"
        rx="5"
        ry="7"
        fill="currentColor"
        className="opacity-90"
      />
      
      {/* Vertical ridges/sections */}
      <path
        d="M9 8 Q9 14 9 20"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        className="opacity-50"
      />
      <path
        d="M12 7 Q12 14 12 21"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        className="opacity-50"
      />
      <path
        d="M15 8 Q15 14 15 20"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        className="opacity-50"
      />
      
      {/* Spines arranged in rows */}
      {/* Top row */}
      <circle cx="8.5" cy="9" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="10.5" cy="8.5" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="12" cy="8.2" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="13.5" cy="8.5" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="15.5" cy="9" r="0.4" fill="currentColor" className="opacity-70" />
      
      {/* Middle row */}
      <circle cx="8" cy="12" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="10" cy="11.5" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="12" cy="11.5" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="14" cy="11.5" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="16" cy="12" r="0.4" fill="currentColor" className="opacity-70" />
      
      {/* Lower middle row */}
      <circle cx="8.5" cy="15" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="10.5" cy="14.5" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="12" cy="14.5" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="13.5" cy="14.5" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="15.5" cy="15" r="0.4" fill="currentColor" className="opacity-70" />
      
      {/* Bottom row */}
      <circle cx="9" cy="18" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="11" cy="17.5" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="13" cy="17.5" r="0.4" fill="currentColor" className="opacity-70" />
      <circle cx="15" cy="18" r="0.4" fill="currentColor" className="opacity-70" />
      
      {/* Small flower on top center */}
      <circle cx="12" cy="6.5" r="1.2" fill="#ff6b9d" className="opacity-80" />
      <circle cx="12" cy="6.5" r="0.6" fill="#ffeb3b" className="opacity-90" />
      
      {/* Pot base */}
      <ellipse
        cx="12"
        cy="21.5"
        rx="6"
        ry="1.5"
        fill="currentColor"
        className="opacity-40"
      />
    </svg>
  );
}
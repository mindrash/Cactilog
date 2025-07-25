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
      {/* Main barrel cactus body - barrel shaped with flat top */}
      <path
        d="M8 20 Q8 9 12 9 Q16 9 16 20 L8 20 Z"
        fill="currentColor"
        className="opacity-90"
      />
      
      {/* Flatten the top */}
      <ellipse
        cx="12"
        cy="9"
        rx="4"
        ry="1"
        fill="currentColor"
        className="opacity-90"
      />
      
      {/* Vertical ribs - characteristic of barrel cacti */}
      <path
        d="M10 9 Q10 14.5 10 20"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        className="opacity-40"
      />
      <path
        d="M12 9 Q12 14.5 12 20"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        className="opacity-40"
      />
      <path
        d="M14 9 Q14 14.5 14 20"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        className="opacity-40"
      />
      
      {/* Prominent spines along the ribs */}
      {/* Left rib spines */}
      <line x1="9.5" y1="11" x2="10.5" y2="11" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      <line x1="9.5" y1="13" x2="10.5" y2="13" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      <line x1="9.5" y1="15" x2="10.5" y2="15" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      <line x1="9.5" y1="17" x2="10.5" y2="17" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      
      {/* Center rib spines */}
      <line x1="11.5" y1="10" x2="12.5" y2="10" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      <line x1="11.5" y1="12" x2="12.5" y2="12" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      <line x1="11.5" y1="14" x2="12.5" y2="14" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      <line x1="11.5" y1="16" x2="12.5" y2="16" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      <line x1="11.5" y1="18" x2="12.5" y2="18" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      
      {/* Right rib spines */}
      <line x1="13.5" y1="11" x2="14.5" y2="11" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      <line x1="13.5" y1="13" x2="14.5" y2="13" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      <line x1="13.5" y1="15" x2="14.5" y2="15" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      <line x1="13.5" y1="17" x2="14.5" y2="17" stroke="currentColor" strokeWidth="0.5" className="opacity-80" />
      
      {/* Flower crown on top - typical of barrel cacti */}
      <circle cx="11" cy="8" r="0.8" fill="#ff6b9d" className="opacity-80" />
      <circle cx="12" cy="7.5" r="0.8" fill="#ff6b9d" className="opacity-80" />
      <circle cx="13" cy="8" r="0.8" fill="#ff6b9d" className="opacity-80" />
      <circle cx="11" cy="8" r="0.4" fill="#ffeb3b" className="opacity-90" />
      <circle cx="12" cy="7.5" r="0.4" fill="#ffeb3b" className="opacity-90" />
      <circle cx="13" cy="8" r="0.4" fill="#ffeb3b" className="opacity-90" />
      
      {/* Ground/pot indication */}
      <rect
        x="6"
        y="20"
        width="12"
        height="2"
        rx="1"
        fill="currentColor"
        className="opacity-30"
      />
    </svg>
  );
}
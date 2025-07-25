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
      {/* Main cactus stem */}
      <rect
        x="10"
        y="8"
        width="4"
        height="12"
        rx="2"
        fill="currentColor"
        className="opacity-90"
      />
      
      {/* Left arm */}
      <rect
        x="6"
        y="12"
        width="5"
        height="3"
        rx="1.5"
        fill="currentColor"
        className="opacity-80"
      />
      
      {/* Right arm */}
      <rect
        x="13"
        y="10"
        width="5"
        height="3"
        rx="1.5"
        fill="currentColor"
        className="opacity-80"
      />
      
      {/* Small spikes on main stem */}
      <circle cx="11" cy="11" r="0.5" fill="currentColor" className="opacity-60" />
      <circle cx="13" cy="13" r="0.5" fill="currentColor" className="opacity-60" />
      <circle cx="11" cy="15" r="0.5" fill="currentColor" className="opacity-60" />
      <circle cx="13" cy="17" r="0.5" fill="currentColor" className="opacity-60" />
      
      {/* Small spikes on left arm */}
      <circle cx="7.5" cy="13.5" r="0.3" fill="currentColor" className="opacity-60" />
      <circle cx="9" cy="13.5" r="0.3" fill="currentColor" className="opacity-60" />
      
      {/* Small spikes on right arm */}
      <circle cx="15" cy="11.5" r="0.3" fill="currentColor" className="opacity-60" />
      <circle cx="16.5" cy="11.5" r="0.3" fill="currentColor" className="opacity-60" />
      
      {/* Small flower on top */}
      <circle cx="12" cy="7" r="1.5" fill="#ff6b9d" className="opacity-80" />
      <circle cx="12" cy="7" r="0.8" fill="#ffeb3b" className="opacity-90" />
      
      {/* Pot base */}
      <rect
        x="8"
        y="20"
        width="8"
        height="2"
        rx="1"
        fill="currentColor"
        className="opacity-50"
      />
    </svg>
  );
}
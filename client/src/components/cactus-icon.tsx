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
      {/* Main circular barrel cactus body - top-down view */}
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="currentColor"
        className="opacity-90"
      />
      
      {/* Radiating ridges from center - like the reference image */}
      <g className="opacity-40">
        {/* Vertical and horizontal main ridges */}
        <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="0.8" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="0.8" />
        
        {/* Diagonal ridges */}
        <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" stroke="currentColor" strokeWidth="0.8" />
        <line x1="18.5" y1="5.5" x2="5.5" y2="18.5" stroke="currentColor" strokeWidth="0.8" />
        
        {/* Additional ridges for more detailed look */}
        <line x1="7" y1="3.5" x2="17" y2="20.5" stroke="currentColor" strokeWidth="0.6" />
        <line x1="17" y1="3.5" x2="7" y2="20.5" stroke="currentColor" strokeWidth="0.6" />
        <line x1="3.5" y1="7" x2="20.5" y2="17" stroke="currentColor" strokeWidth="0.6" />
        <line x1="3.5" y1="17" x2="20.5" y2="7" stroke="currentColor" strokeWidth="0.6" />
      </g>
      
      {/* Spines along the ridges - radiating outward */}
      <g className="opacity-70">
        {/* Top spines */}
        <line x1="11.5" y1="4" x2="12.5" y2="5" stroke="currentColor" strokeWidth="0.6" />
        <line x1="12" y1="3.5" x2="12" y2="4.5" stroke="currentColor" strokeWidth="0.6" />
        
        {/* Right spines */}
        <line x1="19" y1="11.5" x2="20" y2="12.5" stroke="currentColor" strokeWidth="0.6" />
        <line x1="19.5" y1="12" x2="20.5" y2="12" stroke="currentColor" strokeWidth="0.6" />
        
        {/* Bottom spines */}
        <line x1="11.5" y1="19" x2="12.5" y2="20" stroke="currentColor" strokeWidth="0.6" />
        <line x1="12" y1="19.5" x2="12" y2="20.5" stroke="currentColor" strokeWidth="0.6" />
        
        {/* Left spines */}
        <line x1="4" y1="11.5" x2="5" y2="12.5" stroke="currentColor" strokeWidth="0.6" />
        <line x1="3.5" y1="12" x2="4.5" y2="12" stroke="currentColor" strokeWidth="0.6" />
        
        {/* Diagonal spines */}
        <line x1="6.5" y1="6.5" x2="7.5" y2="7.5" stroke="currentColor" strokeWidth="0.5" />
        <line x1="17.5" y1="6.5" x2="16.5" y2="7.5" stroke="currentColor" strokeWidth="0.5" />
        <line x1="17.5" y1="17.5" x2="16.5" y2="16.5" stroke="currentColor" strokeWidth="0.5" />
        <line x1="6.5" y1="17.5" x2="7.5" y2="16.5" stroke="currentColor" strokeWidth="0.5" />
      </g>
      
      {/* Central flower cluster - like in the reference */}
      <circle cx="12" cy="12" r="1.5" fill="#ff6b9d" className="opacity-80" />
      <circle cx="12" cy="12" r="0.8" fill="#ffeb3b" className="opacity-90" />
      
      {/* Small flower buds around center */}
      <circle cx="10.5" cy="10.5" r="0.4" fill="#ff6b9d" className="opacity-60" />
      <circle cx="13.5" cy="10.5" r="0.4" fill="#ff6b9d" className="opacity-60" />
      <circle cx="13.5" cy="13.5" r="0.4" fill="#ff6b9d" className="opacity-60" />
      <circle cx="10.5" cy="13.5" r="0.4" fill="#ff6b9d" className="opacity-60" />
    </svg>
  );
}
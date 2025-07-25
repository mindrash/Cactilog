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
      {/* Main columnar cactus body - top-down circular view */}
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="currentColor"
        className="opacity-90"
      />
      
      {/* Vertical ribs running from center to edge - trichocereus pattern */}
      <g className="opacity-50" stroke="currentColor" strokeWidth="0.6" fill="none">
        <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="18.9" y1="8.4" x2="5.1" y2="15.6" />
        <line x1="18.9" y1="15.6" x2="5.1" y2="8.4" />
        <line x1="20" y1="12" x2="4" y2="12" />
        <line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
        <line x1="18.4" y1="18.4" x2="5.6" y2="5.6" />
        <line x1="15.6" y1="4.1" x2="8.4" y2="19.9" />
        <line x1="15.6" y1="19.9" x2="8.4" y2="4.1" />
      </g>
      
      {/* Prominent spines radiating outward - clearly visible */}
      <g className="opacity-80" stroke="currentColor" strokeWidth="1" fill="none">
        {/* Primary long spines */}
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="20" y1="12" x2="18" y2="12" />
        <line x1="12" y1="22" x2="12" y2="20" />
        <line x1="4" y1="12" x2="6" y2="12" />
        
        {/* Diagonal long spines */}
        <line x1="19.4" y1="4.6" x2="17.7" y2="6.3" />
        <line x1="19.4" y1="19.4" x2="17.7" y2="17.7" />
        <line x1="4.6" y1="19.4" x2="6.3" y2="17.7" />
        <line x1="4.6" y1="4.6" x2="6.3" y2="6.3" />
      </g>
      
      {/* Secondary shorter spines */}
      <g className="opacity-70" stroke="currentColor" strokeWidth="0.8" fill="none">
        <line x1="16.9" y1="5.5" x2="15.8" y2="6.6" />
        <line x1="18.5" y1="7.1" x2="17.4" y2="8.2" />
        <line x1="18.5" y1="16.9" x2="17.4" y2="15.8" />
        <line x1="16.9" y1="18.5" x2="15.8" y2="17.4" />
        <line x1="7.1" y1="18.5" x2="8.2" y2="17.4" />
        <line x1="5.5" y1="16.9" x2="6.6" y2="15.8" />
        <line x1="5.5" y1="7.1" x2="6.6" y2="8.2" />
        <line x1="7.1" y1="5.5" x2="8.2" y2="6.6" />
        
        {/* Intermediate spines */}
        <line x1="15" y1="3.8" x2="14.2" y2="4.6" />
        <line x1="20.2" y1="9" x2="19.4" y2="9.8" />
        <line x1="20.2" y1="15" x2="19.4" y2="14.2" />
        <line x1="15" y1="20.2" x2="14.2" y2="19.4" />
        <line x1="9" y1="20.2" x2="9.8" y2="19.4" />
        <line x1="3.8" y1="15" x2="4.6" y2="14.2" />
        <line x1="3.8" y1="9" x2="4.6" y2="9.8" />
        <line x1="9" y1="3.8" x2="9.8" y2="4.6" />
      </g>
      
      {/* Tiny inner spines for detail */}
      <g className="opacity-60" stroke="currentColor" strokeWidth="0.5" fill="none">
        <line x1="13.5" y1="8.5" x2="13" y2="9" />
        <line x1="15.5" y1="10.5" x2="15" y2="11" />
        <line x1="15.5" y1="13.5" x2="15" y2="13" />
        <line x1="13.5" y1="15.5" x2="13" y2="15" />
        <line x1="10.5" y1="15.5" x2="11" y2="15" />
        <line x1="8.5" y1="13.5" x2="9" y2="13" />
        <line x1="8.5" y1="10.5" x2="9" y2="11" />
        <line x1="10.5" y1="8.5" x2="11" y2="9" />
      </g>
      
      {/* Central growing point */}
      <circle cx="12" cy="12" r="1" fill="currentColor" className="opacity-70" />
      <circle cx="12" cy="12" r="0.5" fill="#90EE90" className="opacity-80" />
    </svg>
  );
}
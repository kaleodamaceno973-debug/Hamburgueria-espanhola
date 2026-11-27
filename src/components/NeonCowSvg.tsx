import React from 'react';

interface NeonCowSvgProps {
  className?: string;
  strokeWidth?: number;
  idPrefix?: string;
}

/**
 * Silueta oficial en traço neón de la vaca Baka Vieja
 * (cuerpo redondeado, cuernos curvos, hocico ovalado con orificios, ojos, patas y cola).
 */
export const NeonCowSvg = React.forwardRef<SVGSVGElement, NeonCowSvgProps>(
  ({ className = '', strokeWidth = 4.5, idPrefix = 'bv-cow' }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 260 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`neon-svg-layer ${className}`}
        aria-hidden="true"
      >
        {/* Glow without CSS filter: two wide translucent copies of the strokes (cheap to scroll/animate) */}
        <g opacity={0.1}>
        
        <path
          d="M52 54 C42 36, 48 24, 62 24 C70 24, 72 34, 72 44 C108 32, 162 34, 196 58 C222 76, 232 108, 224 142 C218 164, 198 176, 174 176 L172 192 C172 196, 164 196, 164 190 L162 178 C142 182, 114 182, 92 178 L88 192 C88 197, 80 197, 80 191 L80 176 C52 170, 32 148, 32 114 C32 90, 38 72, 48 62 C36 52, 28 40, 34 26 C38 18, 46 24, 48 34"
          stroke="#FFB547"
          strokeWidth={strokeWidth * 4.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <path
          d="M214 82 C232 92, 238 122, 236 146 C236 154, 244 156, 242 148"
          stroke="#FFB547"
          strokeWidth={strokeWidth * 4.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <path
          d="M64 170 L62 186 C62 191, 70 191, 70 185 L72 172"
          stroke="#FFB547"
          strokeWidth={strokeWidth * 4.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <path
          d="M188 174 L190 188 C190 193, 198 193, 198 187 L196 172"
          stroke="#FFB547"
          strokeWidth={strokeWidth * 4.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <ellipse
          cx="82"
          cy="118"
          rx="34"
          ry="24"
          transform="rotate(-8 82 118)"
          stroke="#FFB547"
          strokeWidth={strokeWidth * 4.6}
        />
        
        <circle cx="69" cy="118" r="5" stroke="#FFB547" strokeWidth={strokeWidth * 0.78 * 4.6} />
        <circle cx="95" cy="115" r="5" stroke="#FFB547" strokeWidth={strokeWidth * 0.78 * 4.6} />
        
        <circle cx="68" cy="78" r="9.2" fill="#FFB547" />
        <circle cx="98" cy="74" r="9.2" fill="#FFB547" />
        </g>
        <g opacity={0.24}>
        
        <path
          d="M52 54 C42 36, 48 24, 62 24 C70 24, 72 34, 72 44 C108 32, 162 34, 196 58 C222 76, 232 108, 224 142 C218 164, 198 176, 174 176 L172 192 C172 196, 164 196, 164 190 L162 178 C142 182, 114 182, 92 178 L88 192 C88 197, 80 197, 80 191 L80 176 C52 170, 32 148, 32 114 C32 90, 38 72, 48 62 C36 52, 28 40, 34 26 C38 18, 46 24, 48 34"
          stroke="#FFB547"
          strokeWidth={strokeWidth * 2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <path
          d="M214 82 C232 92, 238 122, 236 146 C236 154, 244 156, 242 148"
          stroke="#FFB547"
          strokeWidth={strokeWidth * 2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <path
          d="M64 170 L62 186 C62 191, 70 191, 70 185 L72 172"
          stroke="#FFB547"
          strokeWidth={strokeWidth * 2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <path
          d="M188 174 L190 188 C190 193, 198 193, 198 187 L196 172"
          stroke="#FFB547"
          strokeWidth={strokeWidth * 2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <ellipse
          cx="82"
          cy="118"
          rx="34"
          ry="24"
          transform="rotate(-8 82 118)"
          stroke="#FFB547"
          strokeWidth={strokeWidth * 2.2}
        />
        
        <circle cx="69" cy="118" r="5" stroke="#FFB547" strokeWidth={strokeWidth * 0.78 * 2.2} />
        <circle cx="95" cy="115" r="5" stroke="#FFB547" strokeWidth={strokeWidth * 0.78 * 2.2} />
        
        <circle cx="68" cy="78" r="4.4" fill="#FFB547" />
        <circle cx="98" cy="74" r="4.4" fill="#FFB547" />
        </g>
        {/* Contorno principal cuerpo + cabeza + cuerno derecho */}
        <path
          id={`${idPrefix}-body`}
          d="M52 54 C42 36, 48 24, 62 24 C70 24, 72 34, 72 44 C108 32, 162 34, 196 58 C222 76, 232 108, 224 142 C218 164, 198 176, 174 176 L172 192 C172 196, 164 196, 164 190 L162 178 C142 182, 114 182, 92 178 L88 192 C88 197, 80 197, 80 191 L80 176 C52 170, 32 148, 32 114 C32 90, 38 72, 48 62 C36 52, 28 40, 34 26 C38 18, 46 24, 48 34"
          stroke="#FFB547"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Cola */}
        <path
          id={`${idPrefix}-tail`}
          d="M214 82 C232 92, 238 122, 236 146 C236 154, 244 156, 242 148"
          stroke="#FFB547"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Patita delantera izquierda */}
        <path
          id={`${idPrefix}-leg1`}
          d="M64 170 L62 186 C62 191, 70 191, 70 185 L72 172"
          stroke="#FFB547"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Patita trasera */}
        <path
          id={`${idPrefix}-leg2`}
          d="M188 174 L190 188 C190 193, 198 193, 198 187 L196 172"
          stroke="#FFB547"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Hocico */}
        <ellipse
          id={`${idPrefix}-snout`}
          cx="82"
          cy="118"
          rx="34"
          ry="24"
          transform="rotate(-8 82 118)"
          stroke="#FFB547"
          strokeWidth={strokeWidth}
        />
        {/* Orificios nariz */}
        <circle cx="69" cy="118" r="5" stroke="#FFB547" strokeWidth={strokeWidth * 0.78} />
        <circle cx="95" cy="115" r="5" stroke="#FFB547" strokeWidth={strokeWidth * 0.78} />
        {/* Ojos */}
        <circle cx="68" cy="78" r="4" fill="#FFB547" />
        <circle cx="98" cy="74" r="4" fill="#FFB547" />
      </svg>
    );
  }
);

NeonCowSvg.displayName = 'NeonCowSvg';

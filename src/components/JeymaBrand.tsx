import React from 'react';

interface LogoProps {
  variant?: 'cream' | 'green';
  className?: string;
}

/**
 * Vectorización fiel del logotipo oficial de JEYMA (mujer con txapela y tentáculos
 * emergiendo sobre el wordmark en minúsculas "jeyma").
 */
export const JeymaLogo: React.FC<LogoProps> = ({ variant = 'cream', className = 'w-40 h-auto' }) => {
  const fill = variant === 'cream' ? '#F3EADC' : '#1F4A2E';
  const pupil = variant === 'cream' ? '#1F4A2E' : '#F3EADC';

  return (
    <svg
      viewBox="0 0 320 175"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Logotipo oficial de jeyma"
    >
      {/* Cabeza con txapela (boina vasca) y tentáculos */}
      <g>
        {/* Txapela inclinada a la izquierda */}
        <path
          d="M158 10c-22 1-38 14-40 24-1 5 6 8 15 6 14-3 31-3 46 2 8 3 15 1 16-4 2-11-14-27-37-28Z"
          fill={fill}
        />
        <path d="M159 6c2 0 4 2 4 4h-8c0-2 2-4 4-4Z" fill={fill} />

        {/* Rostro / manto del pulpo-mujer */}
        <path
          d="M126 42c-3 14-2 30 3 41h62c5-11 6-27 3-41-10-4-22-6-34-6s-24 2-34 6Z"
          fill={fill}
        />

        {/* Ojos sutiles con cejas */}
        <path d="M137 64c4-3 9-3 12 0" stroke={pupil} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M171 64c3-3 8-3 12 0" stroke={pupil} strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="143" cy="72" r="4.2" fill={pupil} />
        <circle cx="177" cy="72" r="4.2" fill={pupil} />
        <circle cx="144.3" cy="70.8" r="1.3" fill={fill} />
        <circle cx="178.3" cy="70.8" r="1.3" fill={fill} />

        {/* Tentáculo izquierdo superior rizado */}
        <path
          d="M128 82c-16 1-24-7-22-19 2-11 11-17 10-26-1-7-9-11-16-8-7 3-9 11-4 16 3 3 8 2 9-1"
          stroke={fill}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Tentáculo izquierdo inferior con ventosas */}
        <path
          d="M124 84c-20 4-36-4-44-16-6-9-17-10-23-3-7 8-4 21 3 24"
          stroke={fill}
          strokeWidth="7.5"
          strokeLinecap="round"
        />
        <circle cx="67" cy="74" r="2.2" fill={pupil} />
        <circle cx="76" cy="71" r="2.3" fill={pupil} />
        <circle cx="87" cy="77" r="2.5" fill={pupil} />
        <circle cx="99" cy="83" r="2.6" fill={pupil} />
        <circle cx="112" cy="85" r="2.4" fill={pupil} />

        {/* Tentáculo derecho superior rizado */}
        <path
          d="M192 82c16 1 24-7 22-19-2-11-11-17-10-26 1-7 9-11 16-8 7 3 9 11 4 16-3 3-8 2-9-1"
          stroke={fill}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Tentáculo derecho inferior con ventosas */}
        <path
          d="M196 84c20 4 36-4 44-16 6-9 17-10 23-3 7 8 4 21-3 24"
          stroke={fill}
          strokeWidth="7.5"
          strokeLinecap="round"
        />
        <circle cx="253" cy="74" r="2.2" fill={pupil} />
        <circle cx="244" cy="71" r="2.3" fill={pupil} />
        <circle cx="233" cy="77" r="2.5" fill={pupil} />
        <circle cx="221" cy="83" r="2.6" fill={pupil} />
        <circle cx="208" cy="85" r="2.4" fill={pupil} />
      </g>

      {/* Wordmark "jeyma" en serifa redondeada minúscula */}
      <text
        x="160"
        y="142"
        textAnchor="middle"
        fill={fill}
        style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontWeight: 800,
          fontSize: '74px',
          letterSpacing: '-0.04em',
        }}
      >
        jeyma
      </text>

      {/* Punto característico debajo de la "a" */}
      <circle cx="266" cy="156" r="5.5" fill={fill} />
    </svg>
  );
};

export const EstrellaDorada: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.2l2.9 6.1 6.7.9-4.9 4.7 1.2 6.7L12 17.4l-5.9 3.2 1.2-6.7-4.9-4.7 6.7-.9L12 2.2z" />
  </svg>
);

interface TentacleProps {
  className?: string;
  color?: string;
  glowColor?: string;
  flip?: boolean;
  pathRef?: React.RefObject<SVGPathElement | null>;
}

/**
 * Tentáculo SVG de traço con ventosas inspirado en la carta física de JEYMA.
 * Animado únicamente por stroke-dashoffset y transform (sin filter: drop-shadow).
 */
export const TentacleCorner: React.FC<TentacleProps> = ({
  className = 'w-56 h-56',
  color = '#F3EADC',
  glowColor = 'rgba(168, 135, 58, 0.22)',
  flip = false,
  pathRef,
}) => {
  return (
    <svg
      viewBox="0 0 260 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      {/* Segunda copia translúcida para dar profundidad sin usar filter */}
      <path
        d="M8 210 C 16 146, 34 86, 84 52 C 122 26, 174 28, 224 14 C 242 9, 248 22, 232 32 C 202 51, 152 54, 118 78 C 76 108, 60 154, 48 210"
        stroke={glowColor}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Trazo principal animado con stroke-dashoffset */}
      <path
        ref={pathRef}
        d="M8 210 C 16 146, 34 86, 84 52 C 122 26, 174 28, 224 14 C 242 9, 248 22, 232 32 C 202 51, 152 54, 118 78 C 76 108, 60 154, 48 210"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ventosas interiores */}
      <g stroke={color} strokeWidth="2.2">
        <ellipse cx="44" cy="176" rx="7" ry="5" transform="rotate(-68 44 176)" />
        <ellipse cx="56" cy="142" rx="7.5" ry="5" transform="rotate(-55 56 142)" />
        <ellipse cx="75" cy="109" rx="7" ry="4.8" transform="rotate(-42 75 109)" />
        <ellipse cx="101" cy="82" rx="6.5" ry="4.5" transform="rotate(-30 101 82)" />
        <ellipse cx="132" cy="64" rx="6" ry="4" transform="rotate(-20 132 64)" />
        <ellipse cx="164" cy="52" rx="5.5" ry="3.8" transform="rotate(-14 164 52)" />
        <ellipse cx="195" cy="41" rx="4.5" ry="3.2" transform="rotate(-12 195 41)" />
      </g>
    </svg>
  );
};

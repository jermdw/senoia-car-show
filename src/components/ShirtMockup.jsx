import art from '../assets/shirt-front-art.webp'

const SHIRT = '#EE705A'
const SHADE = '#D95F4B'

// Mockup of the volunteer shirt: the real 2026 front artwork on a coral tee.
// Drawn rather than photographed so it stays sharp at any size.
export default function ShirtMockup({ className = '' }) {
  return (
    <svg
      viewBox="0 0 400 430"
      // Decorative: the adjacent heading and copy already describe the shirt.
      aria-hidden="true"
      className={className}
    >
      <path
        d="M155,28 C130,32 112,40 96,50 L26,88 L64,156 L104,134 L104,398
           Q104,404 110,404 L290,404 Q296,404 296,398 L296,134 L336,156
           L374,88 L304,50 C288,40 270,32 245,28 C242,62 158,62 155,28 Z"
        fill={SHIRT}
        stroke={SHADE}
        strokeWidth="2"
      />
      {/* collar rib */}
      <path
        d="M155,28 C158,62 242,62 245,28"
        fill="none"
        stroke={SHADE}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* sleeve hems */}
      <path d="M64,156 L104,134" fill="none" stroke={SHADE} strokeWidth="4" />
      <path d="M336,156 L296,134" fill="none" stroke={SHADE} strokeWidth="4" />

      <image
        href={art}
        x="128"
        y="105"
        width="144"
        height="200"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  )
}

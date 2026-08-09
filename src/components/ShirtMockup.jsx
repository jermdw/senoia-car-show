// The header-sized logo: this renders around 100px wide, so the large hero
// asset would be ~88KB of waste on the volunteer page.
import logo from '../assets/logo-header.webp'

// Representative mockup of the volunteer shirt, drawn rather than photographed
// so it scales cleanly and stays in brand colors.
export default function ShirtMockup({ className = '' }) {
  return (
    <svg
      viewBox="0 0 400 430"
      // Decorative: the adjacent heading and copy already describe the shirt.
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="shirtShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#24201a" />
          <stop offset="45%" stopColor="#16130b" />
          <stop offset="100%" stopColor="#100e08" />
        </linearGradient>
      </defs>

      <path
        d="M155,28 C130,32 112,40 96,50 L26,88 L64,156 L104,134 L104,398
           Q104,404 110,404 L290,404 Q296,404 296,398 L296,134 L336,156
           L374,88 L304,50 C288,40 270,32 245,28 C242,62 158,62 155,28 Z"
        fill="url(#shirtShade)"
        stroke="#3a3227"
        strokeWidth="2"
      />
      {/* collar rib */}
      <path
        d="M155,28 C158,62 242,62 245,28"
        fill="none"
        stroke="#3a3227"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* sleeve hems */}
      <path d="M64,156 L104,134" fill="none" stroke="#3a3227" strokeWidth="4" />
      <path d="M336,156 L296,134" fill="none" stroke="#3a3227" strokeWidth="4" />

      <image
        href={logo}
        x="120"
        y="105"
        width="160"
        height="150"
        preserveAspectRatio="xMidYMid meet"
      />
      <text
        x="200"
        y="300"
        textAnchor="middle"
        fill="#eedc9a"
        fontSize="30"
        letterSpacing="6"
        style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600 }}
      >
        VOLUNTEER
      </text>
    </svg>
  )
}

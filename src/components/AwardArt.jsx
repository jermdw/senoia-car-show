// Line art for the awards board, drawn in `currentColor` so it inherits the
// gold it sits on. Kept as strokes rather than photographs: on show day the
// organizers are typing winners into a phone at the stage, and there is no
// moment in that workflow to shoot, crop, and upload a car.

export function TrophyMark({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 3h8v6a4 4 0 0 1-8 0z" />
      <path d="M8 4.5H5.5V6a3 3 0 0 0 2.6 3M16 4.5h2.5V6a3 3 0 0 1-2.6 3" />
      <path d="M12 13v4M8.5 21h7" />
    </svg>
  )
}

export function ClockMark({ className = 'w-5 h-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.3l3.2 2" />
    </svg>
  )
}

export function SearchMark({ className = 'w-5 h-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.4 15.4 4.1 4.1" />
    </svg>
  )
}

/**
 * The rosette that stands in for a winner's photograph on a featured card.
 * `label` is the short text struck across the middle ('BEST', 'CAR #07') —
 * anything longer than about six characters will not fit the ribbon.
 */
export function Medallion({ label, className = 'w-24 h-24' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* Ribbon tails behind the medal */}
        <path d="M35 62 26 92l12-6 10 6-8-30" strokeWidth="2.4" />
        <path d="M65 62l9 30-12-6-10 6 8-30" strokeWidth="2.4" />
        <circle cx="50" cy="42" r="30" strokeWidth="2.4" />
        <circle cx="50" cy="42" r="24" strokeWidth="1.2" opacity="0.65" />
        {/* Scalloped edge — twelve ticks, one every 30° */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6
          return (
            <path
              key={i}
              d={`M${50 + 30 * Math.cos(a)} ${42 + 30 * Math.sin(a)}L${50 + 34 * Math.cos(a)} ${42 + 34 * Math.sin(a)}`}
              strokeWidth="2"
            />
          )
        })}
      </g>
      <text
        x="50"
        y="42"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        className="font-display"
        fontSize="17"
        letterSpacing="0.5"
      >
        {label}
      </text>
    </svg>
  )
}

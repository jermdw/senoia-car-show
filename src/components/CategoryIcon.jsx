// Categories must be tellable apart by shape alone, not colour (WCAG 1.4.1) —
// which also keeps them legible on the printed handout, which prints greyscale.
const PATHS = {
  restroom: (
    <>
      <circle cx="12" cy="5" r="2.6" />
      <path d="M8.5 21v-6.5H7l2-5.5a3 3 0 0 1 6 0l2 5.5h-1.5V21" />
    </>
  ),
  food: (
    <>
      <path d="M5 3v6a2.5 2.5 0 0 0 5 0V3M7.5 11v10" />
      <path d="M18 3c-1.6 1.2-2.5 3.2-2.5 5.5 0 1.9 1 3 2.5 3.2V21" />
    </>
  ),
  parking: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M9.5 17V8h3.2a2.9 2.9 0 0 1 0 5.8H9.5" />
    </>
  ),
  shuttle: (
    <>
      <path d="M4 15V7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8M4 11h13M11 5v6" />
      <path d="M17 9h1.8L21 12v3h-4" />
      <circle cx="7.5" cy="17.5" r="1.9" />
      <circle cx="17" cy="17.5" r="1.9" />
    </>
  ),
  awards: (
    <>
      <path d="M8 3h8v6a4 4 0 0 1-8 0z" />
      <path d="M8 4.5H5.5V6a3 3 0 0 0 2.6 3M16 4.5h2.5V6a3 3 0 0 1-2.6 3" />
      <path d="M12 13v4M8.5 21h7" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.9" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  gate: (
    <>
      <path d="M4 20V6a2 2 0 0 1 2-2h5v16" />
      <path d="M20 20V6a2 2 0 0 0-2-2h-3" />
      <path d="M2 20h20" />
      <path d="M15 12h5M17.5 9.5 20 12l-2.5 2.5" />
    </>
  ),
  aid: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
}

export default function CategoryIcon({ category, className = 'w-5 h-5' }) {
  const path = PATHS[category]
  if (!path) return null
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
      {path}
    </svg>
  )
}

// Dynamic imports for the four Firebase-backed routes, kept in their own module so
// both AppRoutes (to build the lazy components) and SiteHeader (to warm them early)
// reference the same import specifier — Vite dedupes them into one chunk.
//
// Why warming matters: react-router wraps location updates in startTransition, so React
// keeps the current page mounted instead of showing the Suspense fallback. Without a
// prefetch, tapping "Volunteer" on a slow connection looks like nothing happened until
// the ~169 kB Firebase chunk lands. Warming on hover/focus/touch hides that latency
// without costing spectators who never open those routes anything.
export const ROUTE_LOADERS = {
  '/awards': () => import('../pages/Awards.jsx'),
  '/volunteer': () => import('../pages/Volunteer.jsx'),
  '/cancel': () => import('../pages/Cancel.jsx'),
  '/admin': () => import('../pages/Admin.jsx'),
}

const warmed = new Set()

export function warmRoute(path) {
  const load = ROUTE_LOADERS[path]
  if (!load || warmed.has(path)) return
  warmed.add(path)
  // A failed prefetch must stay silent: React.lazy will retry on real navigation and
  // surface any genuine failure through the error boundary there.
  load().catch(() => warmed.delete(path))
}

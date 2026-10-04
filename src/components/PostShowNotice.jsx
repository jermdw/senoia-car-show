import { Link } from 'react-router-dom'
import { useShowEnded } from '../lib/useShowDay.js'

/**
 * Banner for the pages that stay reachable after the show — from search results,
 * old QR codes and shared links — but are written for the day itself (FAQ, show
 * day guide, vendors, merch, poker run). Rather than rewriting their copy into
 * the past tense, it says up front that the show is over and points at what is
 * still live. Keyed to SHOW_END via useShowEnded, so the year-rollover date bump
 * removes it everywhere at once.
 */
export default function PostShowNotice() {
  const ended = useShowEnded()
  if (!ended) return null
  return (
    <div className="bg-gold-pale/40 border border-gold rounded-xl p-4 mb-8 text-sm text-ink print:hidden">
      <strong>The 2026 Senoia Car Show took place on September 26.</strong> This
      page is kept for reference.{' '}
      <Link to="/awards" className="underline font-semibold hover:text-gold-dark">
        See the award winners
      </Link>
      .
    </div>
  )
}

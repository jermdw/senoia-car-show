import { useRef, useState } from 'react'
import { pushShare } from '../lib/gtm.js'
import { shareLinks, shareUrl } from '../lib/share.js'

// `text` colors the label; the buttons carry their own colors.
const LABEL = { light: 'text-stone-700', dark: 'text-gold-pale' }

const TONES = {
  light: 'border-stone-300 text-stone-700 hover:border-gold hover:text-ink bg-white',
  dark: 'border-gold/60 text-gold-pale hover:bg-gold hover:text-ink',
}

/**
 * Share row: the device's native share sheet when there is one (phones), plus
 * Facebook, X, email and copy-link so desktop visitors are covered too. All plain
 * links — no third-party scripts load on the public pages. `path` is the site path
 * to share ('/gallery/2026'); the canonical host is added here.
 */
export default function ShareButtons({ path, title, text, label = 'Share', tone = 'light', className = '' }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)
  const links = shareLinks({ path, title, text })
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const btn = `font-display text-sm uppercase tracking-wide px-3 py-1.5 rounded-md border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${TONES[tone]}`

  const nativeShare = async () => {
    pushShare('native', path)
    try {
      await navigator.share({ title, text: text || title, url: shareUrl(path) })
    } catch {
      // Dismissing the share sheet rejects with AbortError; nothing to do.
    }
  }

  const copy = async () => {
    pushShare('copy', path)
    try {
      await navigator.clipboard.writeText(shareUrl(path))
    } catch {
      // Clipboard API unavailable (insecure context, old browser): let them copy by hand.
      window.prompt('Copy this link:', shareUrl(path))
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  const linkProps = (method) => ({
    target: '_blank',
    rel: 'noreferrer noopener',
    onClick: () => pushShare(method, path),
  })

  return (
    <div className={`flex flex-wrap items-center gap-2 print:hidden ${className}`}>
      <span className={`font-display text-sm uppercase tracking-wide mr-1 ${LABEL[tone]}`}>{label}</span>
      {canNativeShare && (
        <button type="button" onClick={nativeShare} className={btn}>
          Share…
        </button>
      )}
      <a href={links.facebook} {...linkProps('facebook')} className={btn} aria-label="Share on Facebook">
        Facebook
      </a>
      <a href={links.x} {...linkProps('x')} className={btn} aria-label="Share on X">
        X
      </a>
      <a href={links.email} onClick={() => pushShare('email', path)} className={btn} aria-label="Share by email">
        Email
      </a>
      <button type="button" onClick={copy} className={btn}>
        {copied ? 'Link copied ✓' : 'Copy link'}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  )
}

// Share-link builders. Always built from the canonical host, never
// window.location.origin, so the .web.app / .firebaseapp.com mirrors are never
// the thing a visitor passes along.
export const ORIGIN = 'https://senoiacar.show'

export function shareUrl(path) {
  return ORIGIN + path
}

export function shareLinks({ path, title, text }) {
  const url = encodeURIComponent(shareUrl(path))
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    x: `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(text || title)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text || title}\n\n${shareUrl(path)}`)}`,
  }
}

// The lightbox photo's identity in a URL: its file name without the extension.
// File names are unique per year, and the year is already in the path.
export function photoSlug(photo) {
  return photo.src.split('/').pop().replace(/\.[^.]+$/, '')
}

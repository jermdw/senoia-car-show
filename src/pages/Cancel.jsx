import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../firebase'

export default function Cancel() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [state, setState] = useState({ status: 'idle', error: null })

  async function confirmCancel() {
    setState({ status: 'submitting', error: null })
    try {
      const cancelSignup = httpsCallable(functions, 'cancelSignup')
      await cancelSignup({ token })
      setState({ status: 'done', error: null })
    } catch (err) {
      setState({ status: 'idle', error: err.message || 'Something went wrong.' })
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md max-w-md w-full p-8 text-center">
        <p className="text-gold text-sm tracking-widest uppercase font-semibold mb-2">
          Senoia Car Show 2026
        </p>
        {!token ? (
          <>
            <h1 className="text-xl font-bold text-ink mb-3">Invalid link</h1>
            <p className="text-stone-600">
              This cancellation link is missing its token. Please use the link
              from your confirmation email, or contact{' '}
              <a className="underline" href="mailto:carshow@enjoysenoia.com">carshow@enjoysenoia.com</a>.
            </p>
          </>
        ) : state.status === 'done' ? (
          <>
            <h1 className="text-xl font-bold text-ink mb-3">Signup cancelled</h1>
            <p className="text-stone-600 mb-6">
              Your spot has been released. Thanks for letting us know — we hope
              to see you at the show!
            </p>
            <Link to="/volunteer" className="text-gold font-semibold underline">
              Browse other shifts
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-ink mb-3">Cancel your volunteer shift?</h1>
            <p className="text-stone-600 mb-6">
              This will release your spot so someone else can take it.
            </p>
            {state.error && <p className="text-red-600 text-sm mb-3" role="alert">{state.error}</p>}
            <button
              onClick={confirmCancel}
              disabled={state.status === 'submitting'}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-lg w-full"
            >
              {state.status === 'submitting' ? 'Cancelling…' : 'Yes, cancel my shift'}
            </button>
            <Link to="/" className="block mt-4 text-stone-500 underline text-sm">
              Never mind, keep my shift
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

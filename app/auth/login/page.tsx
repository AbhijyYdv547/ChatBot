'use client'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'


// Login page with Supabase auth
export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    setLoading(true)
    setErrorMessage('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (!error) {
      router.push('/chat')
    } else {
      setErrorMessage('Invalid credentials. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">🔐 Login to Chat</h1>

        <div className="space-y-4">
          {errorMessage && (
            <p className="text-red-400 text-sm text-center">{errorMessage}</p>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
            )}
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  )
}

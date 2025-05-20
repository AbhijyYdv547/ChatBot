'use client'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-10 max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">🤖 Welcome to ChatBot App</h1>
        <p className="text-gray-300 text-lg sm:text-xl">
          Chat with your PDFs and get instant, intelligent answers.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-white font-semibold transition duration-200"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/auth/register')}
            className="w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg text-white font-semibold transition duration-200"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
}

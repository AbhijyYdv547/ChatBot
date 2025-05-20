'use client'


import { useState, useRef, useEffect } from 'react'
import ChatMessage from '@/components/ChatMessage'
import PdfUploader from '@/components/PdfUploader'
import { createClient } from '@/lib/supabaseClient'

type ChatHistoryItem = {
  user_query: string
  bot_response: string
  created_at: string
}

// Main chat interface with sidebar history
export default function ChatPage() {
  const [messages, setMessages] = useState<{ user: string, bot: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const [history, setHistory] = useState<ChatHistoryItem[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const sendMessage = async (message: string) => {
    setLoading(true)
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ userMessage: message }),
      headers: { 'Content-Type': 'application/json' },
    })
    const { botResponse } = await res.json()
    setMessages(prev => [...prev, { user: message, bot: botResponse }])
    setLoading(false)
  }

  const handleSendClick = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  useEffect(() => {
      // Load past chats from server
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser()
  
      if (user) {
        const res = await fetch('/api/history')
        const result = await res.json()
        if (res.ok) {
          setHistory(result.history)
        }
      }
    }
  
    fetchHistory()
  }, [])


  useEffect(() => {
        // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <header className="p-4 bg-gray-800 shadow text-xl font-semibold border-b border-gray-700">
        🤖 Chatbot
      </header>

      <aside className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto p-4">
  <h2 className="text-lg font-semibold mb-4">🕘 Chat History</h2>
  {history.length === 0 ? (
    <p className="text-sm text-gray-400">No history yet.</p>
  ) : (
    <ul className="space-y-3">
      {history.map((item, index) => (
        <li key={index} className="bg-gray-700 p-3 rounded hover:bg-gray-600 transition">
          <p className="text-sm text-blue-400 truncate">{item.user_query}</p>
          <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  )}
</aside>



  <main className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg, i) => (
          <ChatMessage key={i} user={msg.user} bot={msg.bot} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700 flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask something..."
          disabled={loading || uploading}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendClick}
          disabled={loading || uploading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <PdfUploader setInput={setInput} uploading={uploading} setUploading={setUploading} loading={loading} />
      {input && (
        <p className="text-sm text-gray-400 text-center mb-2">
          ✅ Text extracted from PDF. You can edit it before sending.
        </p>
      )}
  </main>
    </div>
  )
}

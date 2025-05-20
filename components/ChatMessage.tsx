'use client'

import { useState, useRef, useEffect } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ user: string, bot: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
  
    setUploading(true)
    const file = e.target.files[0]
  
    const formData = new FormData()
    formData.append('file', file)
  
    const pdfRes = await fetch('/api/pdf', {
      method: 'POST',
      body: formData,
    })
  
    const { text } = await pdfRes.json()
  
    // Instead of sending immediately, set it as input for user to review/edit
    setInput(text)
    setUploading(false)
  }
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <header className="p-4 bg-gray-800 shadow text-xl font-semibold border-b border-gray-700">
        🤖 Chatbot
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-end">
              <div className="max-w-md px-4 py-2 bg-blue-600 text-white rounded-lg">
                {msg.user}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-md px-4 py-2 bg-gray-700 text-gray-100 rounded-lg">
                {msg.bot}
              </div>
            </div>
          </div>
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

      <div className="p-4 bg-gray-800 border-t border-gray-700 flex flex-col sm:flex-row items-center gap-2">
        <label className="text-sm font-medium text-gray-300">Upload PDF:</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          disabled={uploading || loading}
          className="flex-1 text-sm text-gray-100 file:bg-gray-700 file:text-gray-100 file:border-0 file:px-4 file:py-2 file:rounded-lg"
        />
        {uploading && (
          <p className="text-sm text-gray-400 animate-pulse">
            Extracting text from PDF...
          </p>
        )}
        {input && <p className="text-sm text-gray-400 mt-1">✅ Text extracted from PDF. You can edit it before sending.</p>}
      </div>
    </div>
  )
}

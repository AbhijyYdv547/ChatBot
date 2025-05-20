'use client'
import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ user: string, bot: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

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

    // Extract text from PDF
    const pdfRes = await fetch('/api/pdf', {
      method: 'POST',
      body: formData,
    })
    const { text } = await pdfRes.json()

    // Send extracted text as a message to chatbot
    await sendMessage(text)

    setUploading(false)
  }

  return (
    <div>
      <h1>Chatbot</h1>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <p><b>You:</b> {msg.user}</p>
            <p><b>Bot:</b> {msg.bot}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask something..."
        disabled={loading || uploading}
      />
      <button onClick={handleSendClick} disabled={loading || uploading}>
        Send
      </button>
      <br />
      <label>
        Upload PDF: 
        <input type="file" accept="application/pdf" onChange={handlePdfUpload} disabled={uploading || loading} />
      </label>
      {uploading && <p>Extracting text from PDF...</p>}
    </div>
  )
}

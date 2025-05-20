'use client'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    
    if (error) {
      alert(error.message || 'Registration failed')
    } else if (data?.user?.identities?.length === 0) {
      alert('User already exists.')
    } else if (!data?.session) {
      alert('Registration successful! Please check your email to confirm your account.')
    } else {
      router.push('/chat')
    }
  }
  

  return (
    <div>
      <h1>Register</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  )
}

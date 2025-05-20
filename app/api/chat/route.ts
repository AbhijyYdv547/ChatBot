import { NextRequest, NextResponse } from 'next/server'
import { getGeminiResponse } from '@/lib/gemini'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient()
  const body = await req.json()
  const { userMessage } = body

  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const botResponse = await getGeminiResponse(userMessage)

  const { error: insertError } = await supabase.from('chat_messages').insert([
    {
      user_id: session.user.id,
      user_query: userMessage,
      bot_response: botResponse,
    }
  ])

  if (insertError) {
    console.error('Error inserting message:', insertError)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }


  return NextResponse.json({ botResponse })
}

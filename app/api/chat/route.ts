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

  await supabase.from('chat_messages').insert({
    user_id: session.user.id,
    user_input: userMessage,
    bot_response: botResponse,
  })

  return NextResponse.json({ botResponse })
}

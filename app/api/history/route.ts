import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = createSupabaseServerClient()

   // Get current session
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

   // Fetch messages from Supabase DB
  const { data, error } = await supabase
    .from('chat_messages')
    .select('user_query, bot_response, created_at')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ history: data })
}

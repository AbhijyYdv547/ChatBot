
-- Create the chat_messages table
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_query text not null,
  bot_response text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table chat_messages enable row level security;

-- Allow user to insert their own messages
create policy "Insert own chats"
  on chat_messages
  for insert
  with check (auth.uid() = user_id);

-- Allow user to select only their own chats
create policy "Select own chats"
  on chat_messages
  for select
  using (auth.uid() = user_id);

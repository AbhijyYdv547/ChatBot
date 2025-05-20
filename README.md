# 🤖 ChatBot App

A modern full-stack chatbot application built using **Next.js**, **Supabase**, and the **Gemini API**, allowing users to:

- Authenticate securely  
- Chat with the Gemini-powered bot  
- Upload PDFs and query their content  
- View previous conversations saved in a database  

---

## 📚 Features

- 🔐 User Authentication (Login & Register) via Supabase  
- 🧠 AI Chatbot powered by Gemini API  
- 📄 Upload PDFs and interact with their content (Planned or Optional)  
- 💬 Chat History saved per authenticated user  
- 🗂 View historical chats in the sidebar  
- 🌐 Responsive and Modern UI with TailwindCSS  

---

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router), TailwindCSS  
- **Backend**: API Routes using Next.js  
- **Database**: PostgreSQL (via Supabase)  
- **Authentication**: Supabase Auth  
- **AI API**: Gemini API by Google   

---

## 🧑‍💻 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/AbhijyYdv547/ChatBot.git
cd ChatBot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the App Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 🗃️ Database Setup

### Supabase Table: `chat_messages`

```sql
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_query text not null,
  bot_response text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
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
```

---

## 📂 Folder Structure

```
/app
  └── page.tsx             # Homepage
  └── chat/page.tsx        # Main Chat UI
  └── auth/
      ├── login/page.tsx
      └── register/page.tsx
  └── api/
      ├── chat/route.ts
      └── history/route.ts
      └── pdf/route.ts
/lib
  ├── supabaseClient.ts
  ├── supabaseServer.ts
  ├── gemini.ts
  └── pdfUtils.ts

/middleware
  └── middleware.ts

/utils
  └── middlewareClients.ts

/database
  └── schema.sql

/sample-chat
  └── chat-history.txt


```
---

## 📄 Sample Files

Included:

- [`chat-history.txt`](./sample-chat/chat-history.txt)   

These represent a set of sample interactions between users and the chatbot.

---

## 📌 TODO / Improvements

- [ ] Better error handling & user feedback  
- [ ] Export chat history to file  
- [ ] Light/Dark mode toggle  

---

## 🧾 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 📬 Contact

Made with ❤️ by [@AbhijyYdv547](https://github.com/AbhijyYdv547)

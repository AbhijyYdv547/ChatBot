// Renders user and bot message in bubble format
type ChatMessageProps = {
    user: string
    bot: string
  }
  
  export default function ChatMessage({ user, bot }: ChatMessageProps) {
    return (
      <div className="space-y-2">
        <div className="flex justify-end">
          <div className="max-w-md px-4 py-2 bg-blue-600 text-white rounded-lg">
            {user}
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-md px-4 py-2 bg-gray-700 text-gray-100 rounded-lg">
            {bot}
          </div>
        </div>
      </div>
    )
  }
  
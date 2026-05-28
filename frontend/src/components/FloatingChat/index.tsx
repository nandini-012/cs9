import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Sparkles } from 'lucide-react'

interface FloatingChatProps {
  userEmail?: string | null
  apiBaseUrl?: string
}

const SUGGESTIONS = [
  'What is Rosetta?',
  'What dates to put on NOC?',
  'Is there a stipend?',
  'How do I register for ViBe?',
  'Can I start late?',
]

const INITIAL_MESSAGE = {
  sender: 'Yaksha-mini',
  text: 'Welcome! I am Yaksha-mini, your AI assistant. You can ask me any question about the Vicharanashala internship. Try clicking one of the common topics below!',
}

export default function FloatingChat({ userEmail, apiBaseUrl = 'http://localhost:5000' }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen])

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input
    if (!text?.trim()) return

    const userMsg = { sender: 'USER', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const email = userEmail || 'guest@example.com'
      const res = await fetch(`${apiBaseUrl}/api/intern/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, message: text }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { sender: 'Yaksha-mini', text: res.ok ? data.text : `Error: ${data.message || 'Unknown'}` }])
    } catch {
      setMessages(prev => [...prev, { sender: 'Yaksha-mini', text: 'Connection error. Is the backend running?' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close Yaksha-mini' : 'Open Yaksha-mini'}
        className="
          fixed right-6 bottom-6 z-[9000] w-14 h-14 rounded-full
          bg-gradient-to-br from-slate-800 to-slate-700
          text-white border border-white/20
          shadow-[0_16px_40px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.25)]
          flex items-center justify-center cursor-pointer
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          hover:bg-gradient-to-br hover:from-slate-700 hover:to-slate-800
          hover:-translate-y-1 hover:scale-105
          active:translate-y-0 active:scale-95
        "
      >
        <span className="
          absolute right-full mr-3 top-1/2 -translate-y-1/2
          bg-slate-800 text-white text-xs font-semibold whitespace-nowrap
          px-2.5 py-1 rounded-md opacity-0 pointer-events-none
          transition-opacity duration-150
          group-focus-within:opacity-100
          before:content-[''] before:absolute before:left-full before:top-1/2 before:-translate-y-1/2
          before:border-4 before:border-transparent before:border-l-slate-800
          hover:opacity-100
        ">
          Ask Yaksha-mini
        </span>
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

      {/* Chat Panel */}
      <div
        aria-label="Yaksha-mini chat panel"
        className={`
          fixed right-6 bottom-24 z-[9100] w-[380px] max-w-[calc(100vw-2rem)]
          rounded-3xl overflow-hidden flex flex-col
          bg-white/45 backdrop-blur-[24px] saturate-[190%]
          border border-white/50
          shadow-[0_24px_60px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)]
          transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]
          max-h-[580px]
          ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-5 pointer-events-none'}
          sm:right-0 sm:bottom-0 sm:w-full sm:max-w-full sm:rounded-b-0 sm:max-h-[88vh]
        `}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between gap-3 px-5 py-4 bg-white/25 border-b border-white/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center shadow-[0_4px_10px_rgba(160,90,44,0.2)]">
              <Sparkles size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-800">Yaksha-mini</span>
              <span className="flex items-center gap-1.5 text-[0.72rem] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_#22c55e]" />
                Answers from this site
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="
              w-7 h-7 rounded-full inline-flex items-center justify-center
              bg-white/45 border border-white/55 text-slate-500 cursor-pointer
              transition-all duration-200 hover:bg-white/70 hover:text-slate-800 hover:border-white/80
            "
          >
            <X size={16} />
          </button>
        </div>

        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto px-4 py-3 bg-white/10 flex flex-col gap-2.5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`
                  max-w-[84%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${msg.sender === 'USER'
                    ? 'bg-gradient-to-br from-accent to-[#884a22] text-white rounded-tr-sm shadow-[0_6px_18px_rgba(160,90,44,0.25)]'
                    : 'bg-white/55 text-slate-800 border border-white/60 rounded-tl-sm shadow-[0_4px_16px_rgba(0,0,0,0.02)]'
                  }
                `}
                dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}
              />
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 px-3 py-2.5 rounded-2xl rounded-tl-sm bg-white/55 border border-white/60 shadow-sm">
                {[0, 1, 2].map(n => (
                  <span
                    key={n}
                    className="w-2 h-2 rounded-full bg-slate-400 animate-[ymBlink_1.2s_infinite_ease-in-out_both]"
                    style={{ animationDelay: `${n * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="flex-shrink-0 px-4 py-2 border-t border-white/30">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SUGGESTIONS.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                disabled={isLoading}
                className="
                  flex-shrink-0 px-3 py-1.5 rounded-full text-xs
                  bg-white/40 border border-white/50 text-slate-500
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]
                  transition-all duration-200 cursor-pointer
                  hover:bg-white/75 hover:border-white/80 hover:text-accent
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="flex-shrink-0 flex flex-col border-t border-white/30">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a question or #command..."
              disabled={isLoading}
              className="
                flex-1 w-full px-3.5 py-2.5 rounded-full
                bg-white/35 border border-white/50 text-slate-800
                text-sm font-sans placeholder-slate-400
                outline-none transition-all duration-200
                shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)]
                focus:bg-white/65 focus:border-accent/40 focus:shadow-[0_0_0_4px_rgba(160,90,44,0.08)]
              "
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="
                w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                bg-gradient-to-br from-slate-800 to-slate-700
                text-white border border-white/20 cursor-pointer
                shadow-[0_4px_10px_rgba(15,23,42,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]
                transition-all duration-200
                hover:from-slate-700 hover:to-slate-800
                disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
              "
            >
              <Send size={14} />
            </button>
          </div>
          <p className="text-center text-[0.7rem] text-slate-400 pb-2.5 -mt-1">
            {!userEmail
              ? '💡 Sign in to use tags: #vibe-email, #exemption, #escalate'
              : 'Commands: #vibe-email <gmail>, #exemption, #escalate <query>'}
          </p>
        </div>
      </div>
    </>
  )
}
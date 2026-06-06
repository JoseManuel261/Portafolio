'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Download } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const CV_URL = 'https://raw.githubusercontent.com/JoseManuel261/Portafolio/main/Images/Hoja_de_Vida_Jose_Manuel_Ossa_Martinez.pdf'

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: '¡Hola! Soy el asistente de Jose Manuel. Puedo contarte sobre su experiencia, proyectos, habilidades o compartir su CV. ¿En qué te puedo ayudar?'
}

function CVButton() {
  return (
    <a
      href={CV_URL}
      target="_blank"
      rel="noopener noreferrer"
      download
      className="inline-flex items-center gap-1.5 mt-2 text-[10px] uppercase tracking-widest border border-[var(--border)] px-3 py-1.5 hover:bg-[var(--surface)] transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
    >
      <Download size={10} /> Descargar CV
    </a>
  )
}

function MessageBubble({ msg }: { msg: Message & { showCV?: boolean } }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isUser
        ? 'bg-[var(--text)] text-[var(--bg)] px-3 py-2 text-xs'
        : 'text-xs text-[var(--text)] leading-relaxed'
      }`}>
        {msg.content}
        {!isUser && (msg as any).showCV && <CVButton />}
      </div>
    </div>
  )
}

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<(Message & { showCV?: boolean })[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) })
      })
      const data = await res.json()
      const reply = data.reply ?? 'Lo siento, no pude procesar tu pregunta.'
      const showCV = data.showCV ?? false
      setMessages(prev => [...prev, { role: 'assistant', content: reply, showCV }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Hubo un error. Intenta de nuevo.' }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[var(--text)] text-[var(--bg)] flex items-center justify-center hover:bg-[var(--accent-hover)] transition-colors shadow-lg"
        aria-label="Abrir asistente"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-[var(--bg)] border border-[var(--border)] shadow-xl flex flex-col"
          style={{ height: '420px' }}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">Asistente</p>
              <p className="text-[10px] text-[var(--text-muted)]">Pregúntame sobre Jose Manuel</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 py-2">
                  <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-[var(--border)] flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 text-xs px-3 py-2 border border-[var(--border)] outline-none focus:border-[var(--text)] bg-white transition-colors"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="p-2 bg-[var(--text)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

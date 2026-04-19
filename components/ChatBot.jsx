'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveTranslatorPanel } from '@/components/LiveTranslator';

// ─── ChatBot Panel ────────────────────────────────────────────────────────────
function ChatPanel({ onClose }) {
  const [input, setInput]       = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! I am ATLAS, your local tour guide. How can I help you explore the Pink City today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef            = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        throw new Error(data.error || 'No response');
      }
    } catch (_) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Forgive me, traveller. Sometimes the desert winds disrupt the connection. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="chat-window-premium"
      style={{
        width: '360px',
        height: '550px',
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(21,58,48,0.15)',
        borderRadius: '28px',
        boxShadow: '0 30px 90px rgba(13,22,20,0.18)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '1.4rem', background: '#153A30', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
            <MessageSquare size={16} color="#D4AF37" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.5px' }}>ATLAS <span style={{ color: '#D4AF37' }}>GUIDE</span></div>
            <div style={{ fontSize: '0.65rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Heritage Expert</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <X size={18} color="white" />
        </button>
      </div>

      {/* Messages */}
      <div className="chat-content" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(to bottom,#fff,#f8fafa)' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              padding: '0.9rem 1.1rem',
              borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              background: msg.role === 'user' ? '#153A30' : '#fff',
              color: msg.role === 'user' ? '#fff' : '#153A30',
              boxShadow: msg.role === 'user' ? '0 8px 25px rgba(21,58,48,0.2)' : '0 6px 20px rgba(0,0,0,0.05)',
              border: msg.role === 'user' ? 'none' : '1px solid rgba(21,58,48,0.08)',
              fontSize: '0.9rem', lineHeight: '1.6',
            }}>
              {msg.content}
            </div>
            {msg.role === 'assistant' && (
              <div style={{ fontSize: '0.62rem', color: '#888', marginLeft: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>ATLAS • Jaipur Guide</div>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '0.75rem 1rem', borderRadius: '20px 20px 20px 4px', border: '1px solid rgba(21,58,48,0.08)', display: 'flex', gap: '6px', alignItems: 'center' }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} className="dot-pulse" style={{ background: '#D4AF37', animationDelay: `${d}s` }} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '1.2rem', borderTop: '1px solid rgba(21,58,48,0.05)', background: '#fff', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask ATLAS anything..."
            style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '14px', border: '1.5px solid rgba(21,58,48,0.1)', outline: 'none', background: '#F9FBFA', fontSize: '0.9rem', boxSizing: 'border-box', transition: 'all 0.3s' }}
            onFocus={e => { e.target.style.borderColor = '#153A30'; e.target.style.boxShadow = '0 0 0 4px rgba(21,58,48,0.05)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(21,58,48,0.1)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={{ background: '#153A30', color: 'white', border: 'none', borderRadius: '14px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s', opacity: isLoading || !input.trim() ? 0.6 : 1, boxShadow: '0 8px 20px rgba(21,58,48,0.2)', flexShrink: 0 }}
          onMouseEnter={e => !isLoading && (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isLoading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main Dual Widget ─────────────────────────────────────────────────────────
export default function ChatBot() {
  const [chatOpen,       setChatOpen]       = useState(false);
  const [translatorOpen, setTranslatorOpen] = useState(false);

  return (
    <>
      {/* ── FAB Row ── */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1100,
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
      }}>
        {/* Translator FAB */}
        <motion.button
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setTranslatorOpen(o => !o)}
          title="Live Translator"
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            background: translatorOpen ? '#153A30' : 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: translatorOpen ? '2px solid rgba(212,175,55,0.5)' : '1px solid rgba(255,255,255,0.4)',
            boxShadow: translatorOpen
              ? '0 0 0 5px rgba(212,175,55,0.15), 0 10px 40px rgba(21,58,48,0.35)'
              : '0 10px 40px rgba(0,0,0,0.1)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          <Globe size={26} color={translatorOpen ? '#D4AF37' : '#153A30'} />
        </motion.button>

        {/* Chat FAB */}
        <motion.button
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setChatOpen(o => !o)}
          title="ATLAS Guide Chat"
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            background: chatOpen ? '#153A30' : '#FFFFFF',
            border: '1.5px solid rgba(21,58,48,0.25)',
            boxShadow: chatOpen
              ? '0 0 0 5px rgba(21,58,48,0.1), 0 10px 40px rgba(21,58,48,0.3)'
              : '0 12px 30px rgba(21,58,48,0.15)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          <MessageSquare size={26} color={chatOpen ? '#D4AF37' : '#153A30'} />
        </motion.button>
      </div>

      {/* ── Panels ── */}
      <AnimatePresence>
        {(chatOpen || translatorOpen) && (
          <motion.div
            key="panels"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.165, 0.84, 0.44, 1] }}
            style={{
              position: 'fixed',
              bottom: '7.5rem',
              right: '2rem',
              zIndex: 1099,
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-end',
            }}
          >
            {/* Translator panel — left side */}
            <AnimatePresence>
              {translatorOpen && (
                <motion.div
                  key="translator"
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 30, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <LiveTranslatorPanel onClose={() => setTranslatorOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat panel — right side */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatPanel onClose={() => setChatOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .dot-pulse {
          width: 8px; height: 8px; border-radius: 50%;
          animation: dotPulse 1.5s infinite ease-in-out;
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(0.6); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .chat-content::-webkit-scrollbar { width: 4px; }
        .chat-content::-webkit-scrollbar-track { background: transparent; }
        .chat-content::-webkit-scrollbar-thumb { background: rgba(21,58,48,0.15); border-radius: 10px; }

        [data-theme='dark'] .chat-window-premium {
          background: rgba(13,22,20,0.98) !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        [data-theme='dark'] .chat-window-premium .chat-content {
          background: linear-gradient(to bottom,#0D1614,#12201D) !important;
        }
      `}</style>
    </>
  );
}

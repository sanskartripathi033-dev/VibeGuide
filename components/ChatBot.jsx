'use client';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Loader2, User } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! I am ATLAS, your local tour guide. How can I help you explore the Pink City today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Forgive me, traveller. Sometimes the desert winds disrupt the connection. Please try asking again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-trigger"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '6.5rem',
          zIndex: 999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '1px solid #153A30',
          boxShadow: '0 12px 30px rgba(21, 58, 48, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(21, 58, 48, 0.25)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(21, 58, 48, 0.15)';
        }}
      >
        <MessageSquare size={26} color="#153A30" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="chat-window-premium"
          style={{
            position: 'fixed',
            bottom: '7.5rem',
            right: '2rem',
            zIndex: 1000,
            width: '380px',
            height: '550px',
            maxWidth: 'calc(100vw - 4rem)',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(21, 58, 48, 0.15)',
            borderRadius: '28px',
            boxShadow: '0 30px 90px rgba(13, 22, 20, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Outfit', sans-serif",
            animation: 'slideUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: '1.4rem', 
            background: '#153A30', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <MessageSquare size={16} color="#D4AF37" style={{ margin: 'auto' }} />
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.5px' }}>ATLAS <span style={{ color: '#D4AF37' }}>GUIDE</span></div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Heritage Expert</div>
                </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={18} color="white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-content" style={{ flex: 1, overflowY: 'auto', padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', background: 'linear-gradient(to bottom, #FFFFFF, #F8FAFA)' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{
                  padding: '1rem 1.2rem',
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.role === 'user' ? '#153A30' : '#FFFFFF',
                  color: msg.role === 'user' ? '#FFFFFF' : '#153A30',
                  boxShadow: msg.role === 'user' ? '0 8px 25px rgba(21, 58, 48, 0.2)' : '0 10px 30px rgba(0,0,0,0.05)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(21, 58, 48, 0.08)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  position: 'relative'
                }}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && (
                    <div style={{ fontSize: '0.65rem', color: '#888', marginLeft: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>ATLAS • Jaipur Guide</div>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: '#FFFFFF', padding: '0.8rem 1.2rem', borderRadius: '20px 20px 20px 4px', border: '1px solid rgba(21, 58, 48, 0.08)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div className="dot-pulse" style={{ background: '#D4AF37' }}></div>
                <div className="dot-pulse" style={{ background: '#D4AF37', animationDelay: '0.2s' }}></div>
                <div className="dot-pulse" style={{ background: '#D4AF37', animationDelay: '0.4s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ 
              padding: '1.5rem', 
              borderTop: '1px solid rgba(21, 58, 48, 0.05)', 
              background: '#FFFFFF',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask ATLAS anything..."
                    style={{
                        width: '100%',
                        padding: '0.9rem 1.2rem',
                        borderRadius: '16px',
                        border: '1.5px solid rgba(21, 58, 48, 0.1)',
                        outline: 'none',
                        background: '#F9FBFA',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s'
                    }}
                    onFocus={e => { e.target.style.borderColor = '#153A30'; e.target.style.boxShadow = '0 0 0 4px rgba(21, 58, 48, 0.05)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(21, 58, 48, 0.1)'; e.target.style.boxShadow = 'none'; }}
                />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                background: '#153A30',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                opacity: isLoading || !input.trim() ? 0.6 : 1,
                boxShadow: '0 8px 20px rgba(21, 58, 48, 0.2)'
              }}
              onMouseEnter={e => !isLoading && (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isLoading ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .dot-pulse { 
            width: 8px; 
            height: 8px; 
            border-radius: 50%; 
            animation: dotPulse 1.5s infinite ease-in-out;
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(0.6); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .chat-content::-webkit-scrollbar { width: 4px; }
        .chat-content::-webkit-scrollbar-track { background: transparent; }
        .chat-content::-webkit-scrollbar-thumb { background: rgba(21, 58, 48, 0.1); border-radius: 10px; }

        [data-theme='dark'] .chat-window-premium {
            background: rgba(13, 22, 20, 0.98) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
        }
        [data-theme='dark'] .chat-window-premium .chat-content {
            background: linear-gradient(to bottom, #0D1614, #12201D) !important;
        }
        [data-theme='dark'] .chat-window-premium .chat-content > div > div {
            background: #1A2E28 !important;
            color: #E2E8E6 !important;
            border-color: rgba(255, 255, 255, 0.05) !important;
        }
        [data-theme='dark'] .chat-window-premium input {
            background: #142521 !important;
            color: white !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </>
  );
}

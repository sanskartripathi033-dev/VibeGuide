'use client';
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Globe, Volume2, X, FileText, Loader2, Sparkles } from 'lucide-react';

const LANGUAGES = {
  'en-US': 'English',
  'hi-IN': 'Hindi',
  'fr-FR': 'French',
  'es-ES': 'Spanish',
  'de-DE': 'German',
  'ja-JP': 'Japanese',
  'zh-CN': 'Chinese (Simplified)',
  'ar-SA': 'Arabic',
  'ru-RU': 'Russian',
  'it-IT': 'Italian',
  'pt-BR': 'Portuguese'
};

// Panel-only version — used embedded inside the dual widget
export function LiveTranslatorPanel({ onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('hi-IN');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef(null);
  const targetLangRef = useRef(targetLang); // always holds latest lang for the closure

  // Keep ref in sync whenever user changes language
  useEffect(() => { targetLangRef.current = targetLang; }, [targetLang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setErrorMsg('');
        };

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setText(transcript);
          // Use ref so we always get the currently selected language, not the stale mount-time value
          handleTranslateWithLang(transcript, targetLangRef.current);
        };

        recognitionRef.current.onerror = (event) => {
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setErrorMsg('Mic access denied. Click the 🔒 icon in your browser address bar and allow microphone.');
          } else if (event.error === 'network') {
            setErrorMsg('Speech service connection failed. Please tap the mic to try again, or use the text box instead.');
          } else if (event.error === 'no-speech') {
            setErrorMsg('No speech detected. Please speak clearly and try again.');
          } else if (event.error !== 'aborted') {
            setErrorMsg('Mic error: ' + event.error + '. Try using Chrome browser.');
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        setErrorMsg('Microphone not supported on this device/browser.');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranslatedText('');
      recognitionRef.current?.start();
    }
  };

  // Core translate function — accepts explicit lang so it works from closures too
  const handleTranslateWithLang = async (textToTranslate, lang) => {
    if (!textToTranslate?.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToTranslate, targetLanguage: lang })
      });
      const data = await res.json();
      if (res.ok) {
        setTranslatedText(data.translatedText);
        speakText(data.translatedText, lang);
      } else {
        setErrorMsg(data.error || 'Translation failed');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (textValue, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textValue);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className="translator-premium-window"
      style={{
        width: '360px',
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
          <Globe size={18} color="#D4AF37" />
          <span style={{ fontWeight: 700, letterSpacing: '0.5px' }}>
            LIVE <span style={{ color: '#D4AF37' }}>TRANSLATOR</span>
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {/* Language Selector */}
        <div style={{ position: 'relative' }}>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            style={{
              width: '100%',
              padding: '0.9rem 1.2rem',
              borderRadius: '16px',
              border: '1.5px solid rgba(21, 58, 48, 0.1)',
              background: '#F9FBFA',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#153A30',
              cursor: 'pointer',
              appearance: 'none',
              fontWeight: 600
            }}
          >
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#153A30' }}>
            <Sparkles size={14} />
          </div>
        </div>

        {/* Error */}
        {errorMsg && (
          <div style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}

        {/* Text Input */}
        <div style={{ position: 'relative' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Talk or type here..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '1.2rem',
              borderRadius: '18px',
              border: '1.5px solid rgba(21, 58, 48, 0.1)',
              resize: 'none',
              outline: 'none',
              fontSize: '0.95rem',
              background: '#FFFFFF',
              color: '#153A30',
              lineHeight: '1.5',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={() => handleTranslateWithLang(text, targetLangRef.current)}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: '#153A30',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 12px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(21, 58, 48, 0.2)'
            }}
          >
            {isLoading ? <Loader2 size={16} className="lt-spin" /> : <FileText size={16} />}
          </button>
        </div>

        {/* Mic Button */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
          <button
            onClick={toggleListen}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: 'none',
              background: isListening ? '#ef4444' : '#153A30',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening
                ? '0 0 30px rgba(239, 68, 68, 0.4)'
                : '0 10px 25px rgba(21, 58, 48, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: isListening ? 'scale(1.15)' : 'scale(1)'
            }}
          >
            {isListening ? <MicOff size={28} /> : <Mic size={28} />}
          </button>
        </div>

        {/* Translation Result */}
        {translatedText && (
          <div
            className="reveal-translated"
            style={{
              background: '#153A30',
              color: '#FFFFFF',
              padding: '1.2rem',
              borderRadius: '18px',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(21, 58, 48, 0.25)',
              animation: 'ltSlideIn 0.4s ease-out'
            }}
          >
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginBottom: '0.5rem', fontWeight: 600 }}>
              Translated ({LANGUAGES[targetLang]})
            </div>
            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6, paddingRight: '2rem', fontWeight: 500 }}>
              {translatedText}
            </p>
            <button
              onClick={() => speakText(translatedText, targetLang)}
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1rem',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#D4AF37',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Volume2 size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .lt-spin { animation: ltSpin 1s linear infinite; }
        @keyframes ltSpin { 100% { transform: rotate(360deg); } }
        @keyframes ltSlideIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        [data-theme='dark'] .translator-premium-window {
          background: rgba(13, 22, 20, 0.98) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        [data-theme='dark'] .translator-premium-window select,
        [data-theme='dark'] .translator-premium-window textarea {
          background: #142521 !important;
          color: white !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

// ── Standalone version (kept for backward compat, not used in layout) ─────────
export default function LiveTranslator() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="translator-trigger"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
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
        <Mic size={26} color="#153A30" />
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', bottom: '7.5rem', right: '2rem', zIndex: 1000 }}>
          <LiveTranslatorPanel onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}

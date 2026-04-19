'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Globe, Volume2, X, FileText, Loader2, Sparkles, AlertCircle } from 'lucide-react';

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

export default function LiveTranslator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('hi-IN');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const recognitionRef = useRef(null);

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
          handleTranslate(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          setIsListening(false);
          // Don't show technical errors unless it's critical
          if (event.error === 'network') {
            setErrorMsg('Network error. Check your connection or use Localhost.');
          } else if (event.error === 'not-allowed') {
            setErrorMsg('Microphone access denied. Please enable it in browser settings.');
          } else {
            setErrorMsg(`Microphone error: ${event.error}`);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        setErrorMsg('Your browser does not support voice recognition.');
      }
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranslatedText('');
      setErrorMsg('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTranslate = async (textToTranslate = text) => {
    if (!textToTranslate.trim()) return;
    
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            text: textToTranslate, 
            targetLanguage: targetLang 
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setTranslatedText(data.translatedText);
        speakText(data.translatedText, targetLang);
      } else {
        setErrorMsg(data.error || 'Translation failed. Check API Settings.');
      }
    } catch (err) {
      setErrorMsg('Network failure. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (textValue, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textValue);
      utterance.lang = lang;
      utterance.rate = 0.9; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[1000] w-[64px] h-[64px] rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
        style={{
          background: 'rgba(21, 58, 48, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(212, 175, 55, 0.1)'
        }}
      >
        <Mic size={28} color="#D4AF37" />
        {isListening && (
            <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-[#D4AF37]"
            />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-[110px] right-8 z-[1001] w-[380px] rounded-[32px] overflow-hidden flex flex-col"
            style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 40px 100px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(21, 58, 48, 0.1)',
                fontFamily: "'Outfit', sans-serif"
            }}
          >
            {/* Premium Header */}
            <div className="p-6 flex justify-between items-center" style={{ background: '#153A30' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10">
                    <Globe size={20} color="#D4AF37" />
                </div>
                <div>
                    <h3 className="text-white text-sm font-bold tracking-widest uppercase">ATLAS</h3>
                    <p className="text-[#D4AF37] text-[10px] font-bold tracking-[2px] uppercase opacity-80">Live Translator</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* Language Selector */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153A30]/40">
                    <Sparkles size={16} />
                </div>
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl outline-none text-sm font-semibold transition-all"
                  style={{
                    background: '#F5F7F6',
                    border: '1.5px solid rgba(21, 58, 48, 0.05)',
                    color: '#153A30',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {Object.entries(LANGUAGES).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#153A30]/40">
                    <Globe size={14} />
                </div>
              </div>

              {/* Error Alert */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 border border-red-100"
                  >
                    <AlertCircle size={14} />
                    <span className="text-[11px] font-medium leading-tight">{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Area */}
              <div className="relative group">
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tell ATLAS what to translate..."
                  className="w-full min-h-[120px] p-5 rounded-3xl outline-none text-[15px] leading-relaxed transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(21, 58, 48, 0.1)',
                    color: '#153A30',
                    resize: 'none',
                    boxShadow: 'inset 0 2px 10px rgba(21, 58, 48, 0.03)'
                  }}
                />
                <button 
                  onClick={() => handleTranslate(text)}
                  className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-[#153A30] text-white shadow-lg hover:bg-[#1c4d40] transition-all"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                </button>
              </div>

              {/* Action Circle */}
              <div className="flex justify-center py-2">
                <motion.button
                  animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  onClick={toggleListen}
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer"
                  style={{
                    border: 'none',
                    background: isListening ? '#FF4B4B' : '#153A30',
                    color: '#fff',
                    boxShadow: isListening ? '0 0 40px rgba(255, 75, 75, 0.4)' : '0 15px 35px rgba(21, 58, 48, 0.2)'
                  }}
                >
                  {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                </motion.button>
              </div>

              {/* Translated Result */}
              <AnimatePresence mode="wait">
                {translatedText && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-[24px] relative"
                    style={{ 
                        background: 'linear-gradient(135deg, #153A30 0%, #1c4d40 100%)', 
                        color: '#FFFFFF' 
                    }}
                  >
                    <div className="text-[9px] font-black uppercase tracking-[2px] text-[#D4AF37] mb-3 opacity-90">
                        {LANGUAGES[targetLang]} Translation
                    </div>
                    <p className="text-[17px] leading-relaxed font-medium pr-8">{translatedText}</p>
                    <button 
                      onClick={() => speakText(translatedText, targetLang)}
                      className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-[#D4AF37] hover:bg-white/20 transition-all border-none cursor-pointer"
                    >
                      <Volume2 size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="px-6 py-4 bg-[#F5F7F6] text-center border-t border-black/5">
                <span className="text-[10px] text-[#153A30]/40 font-bold tracking-widest uppercase">Powered by ATLAS Intelligence</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';

export default function LanguageTranslator() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,fr,de,es,zh-CN,ja,ar,ru,pt,ko,it',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <style>{`
        /* Aggressive CSS to hide Google's default branding and styling */
        .goog-te-gadget {
          font-family: 'Outfit', sans-serif !important;
          color: transparent !important;
          font-size: 0px !important;
        }
        .goog-te-gadget .goog-te-combo {
          font-family: 'Outfit', sans-serif !important;
          margin: 0 !important;
          padding: 0.5rem !important;
          border-radius: 4px !important;
          border: 1px solid rgba(212,175,55,0.3) !important;
          background: rgba(13,10,7,0.95) !important;
          color: var(--gold) !important;
          font-size: 0.8rem !important;
          outline: none !important;
          cursor: pointer !important;
        }
        
        div#google_translate_element {
          display: inline-block;
        }

        /* Hide the Google logo and powered by text completely */
        .goog-logo-link { display: none !important; }
        .goog-te-gadget span { display: none !important; }
        .goog-te-gadget img { display: none !important; }
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        
        /* Remove the top margin Google adds to the body */
        body { top: 0px !important; }
      `}</style>
      
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: 'rgba(13,10,7,0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(212,175,55,0.3)',
        borderRadius: '4px',
        padding: '0.4rem 1rem',
      }}>
        <span style={{ fontSize: '1rem' }}>🌐</span>
        {/* We use a wrapper to hold the actual element but we style its internal select box directly via the CSS above */}
        <div id="google_translate_element" />
      </div>
    </>
  );
}

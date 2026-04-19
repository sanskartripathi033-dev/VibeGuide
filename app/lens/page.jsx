'use client';
import { useState, useRef } from 'react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export default function LensPage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);

    const handleFile = (f) => {
        if (!f || !f.type.startsWith('image/')) {
            setError('Please upload a valid image (JPEG, PNG, or WebP).');
            return;
        }
        setError('');
        setFile(f);
        setResult(null);
        const reader = new FileReader();
        reader.onload = e => setPreview(e.target.result);
        reader.readAsDataURL(f);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const analyze = async () => {
        if (!file) { setError('Please upload an image first.'); return; }
        setLoading(true);
        setError('');

        // Convert image to base64
        const toBase64 = (f) => new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result.split(',')[1]);
            reader.onerror = rej;
            reader.readAsDataURL(f);
        });

        try {
            const base64 = await toBase64(file);
            const mimeType = file.type;

            // Two-stage Gemini Vision via backend
            const stage1Prompt = `Extract all visible text from this image of a sign or billboard. 
Translate it to English and Hindi.
Return ONLY a JSON object: { "original_text": "string", "english_translation": "string", "hindi_translation": "string" }`;

            const stage1Res = await fetch(`${BACKEND}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: stage1Prompt },
                            { inline_data: { mime_type: mimeType, data: base64 } }
                        ]
                    }],
                    generationConfig: { responseMimeType: 'application/json' }
                }),
            });

            const s1data = await stage1Res.json();
            const s1text = s1data.candidates?.[0]?.content?.parts?.[0]?.text;
            const translation = JSON.parse(s1text);

            const stage2Prompt = `This is a sign/billboard from India. The text reads: "${translation.english_translation}".

As a cultural expert, explain this to a foreign tourist:
1. What is the PURPOSE of this sign? (Warning / Advertisement / Political / Religious / Pun / Navigation)
2. What is the cultural NUANCE a foreigner might miss?
3. Any specific ACTION the tourist should take or avoid based on this sign?

Return ONLY a JSON object:
{
  "type": "Warning|Advertisement|Political|Religious|Pun|Navigation|Other",
  "type_emoji": "⚠️|📢|🗳️|🛕|😄|🗺️|ℹ️",
  "cultural_explanation": "string (2-3 sentences)",
  "tourist_action": "string (1 sentence)",
  "insider_tip": "string (1 sentence, something a local would know)"
}`;

            const stage2Res = await fetch(`${BACKEND}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: stage2Prompt },
                            { inline_data: { mime_type: mimeType, data: base64 } }
                        ]
                    }],
                    generationConfig: { responseMimeType: 'application/json' }
                }),
            });

            const s2data = await stage2Res.json();
            const s2text = s2data.candidates?.[0]?.content?.parts?.[0]?.text;
            const cultural = JSON.parse(s2text);

            setResult({ translation, cultural });
        } catch (e) {
            setError('Analysis failed. Try a clearer image. ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="lens-page">

                {/* Hero */}
                <div className="lens-hero">
                    <div className="lens-hero-label">✦ Gemini Vision · AI Cultural Decoder</div>
                    <h1 className="lens-hero-title">Lens: <em>Sign Translator</em> & Explainer</h1>
                </div>

                <div className="lens-main">
                    {/* Upload Panel */}
                    <div className="lens-upload-panel">
                        <div
                            className={`drop-zone ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => !preview && inputRef.current?.click()}
                        >
                            {preview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={preview} alt="Preview" className="upload-preview" />
                            ) : (
                                <div className="drop-prompt">
                                    <div className="drop-icon">📷</div>
                                    <div className="drop-text">Drop an image here</div>
                                    <div className="drop-formats">JPEG · PNG · WebP</div>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                ref={inputRef}
                                onChange={e => handleFile(e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {preview && (
                            <div className="upload-actions">
                                <button className="change-btn" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>
                                    🔄 Change Image
                                </button>
                                <button className="analyze-btn" onClick={analyze} disabled={loading}>
                                    {loading ? <><span className="spin" />Analyzing…</> : '🔍 Decode Sign'}
                                </button>
                            </div>
                        )}
                        {error && <div className="lens-error">⚠️ {error}</div>}
                    </div>

                    {/* Result Panel */}
                    {result && (
                        <div className="lens-result">
                            {/* Translation Card */}
                            <div className="result-card translation-card">
                                <div className="result-card-title">🌐 Translation</div>
                                {result.translation.original_text && (
                                    <div className="trans-block">
                                        <div className="trans-label">Original Text</div>
                                        <div className="trans-content original">{result.translation.original_text}</div>
                                    </div>
                                )}
                                <div className="trans-block">
                                    <div className="trans-label">English</div>
                                    <div className="trans-content">{result.translation.english_translation}</div>
                                </div>
                            </div>

                            {/* Cultural Context Card */}
                            <div className="result-card cultural-card">
                                <div className="result-card-title">
                                    {result.cultural.type_emoji} The Insider Explanation
                                </div>
                                <div className="cultural-type-badge">{result.cultural.type}</div>
                                <div className="cultural-block">
                                    <div className="cultural-label">🧠 Cultural Nuance</div>
                                    <div className="cultural-text">{result.cultural.cultural_explanation}</div>
                                </div>
                                <div className="cultural-block insider">
                                    <div className="cultural-label">💎 Insider Tip</div>
                                    <div className="cultural-text">{result.cultural.insider_tip}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        /* Include the CSS styles from your original lens page here */
      `}</style>
        </>
    );
}
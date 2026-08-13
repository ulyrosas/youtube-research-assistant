'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

type Analysis = {
  videoId: string;
  transcript: string;
  summary: string;
  chapters: { timestamp: string; title: string }[];
  flashcards: { question: string; answer: string }[];
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seekTo, setSeekTo] = useState(0);

  const { messages, sendMessage, status } = useChat();

  async function analyze() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Analysis failed');
      setAnalysis(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function timestampToSeconds(ts: string): number {
    const [m, s] = ts.replace(/[[\]]/g, '').split(':').map(Number);
    return m * 60 + (s ?? 0);
  }

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>YouTube Research Assistant</h1>
      <p style={{ color: '#9aa4b8' }}>Paste a link. Get a summary, chapters, flashcards, and a chat that cites the exact moment it's talking about.</p>

      <div style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0' }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #232a3a', background: '#161b26', color: 'inherit' }}
        />
        <button onClick={analyze} disabled={loading || !url} style={{ padding: '0.6rem 1.2rem', borderRadius: 8, background: '#6ee7b7', color: '#0b0e14', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {analysis && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <iframe
              width="100%"
              height="220"
              src={`https://www.youtube.com/embed/${analysis.videoId}?start=${seekTo}`}
              title="video"
              style={{ borderRadius: 12, border: 'none' }}
              allow="autoplay"
            />

            <h3>Summary</h3>
            <p style={{ color: '#9aa4b8' }}>{analysis.summary}</p>

            <h3>Chapters</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {analysis.chapters.map((c) => (
                <li key={c.timestamp}>
                  <button
                    onClick={() => setSeekTo(timestampToSeconds(c.timestamp))}
                    style={{ background: 'none', border: 'none', color: '#7dd3fc', cursor: 'pointer', padding: '0.25rem 0' }}
                  >
                    {c.timestamp} — {c.title}
                  </button>
                </li>
              ))}
            </ul>

            <h3>Flashcards</h3>
            {analysis.flashcards.map((f, i) => (
              <details key={i} style={{ marginBottom: '0.5rem', background: '#161b26', borderRadius: 8, padding: '0.5rem 0.8rem' }}>
                <summary style={{ cursor: 'pointer' }}>{f.question}</summary>
                <p style={{ color: '#9aa4b8' }}>{f.answer}</p>
              </details>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3>Chat with this video</h3>
            <div style={{ flex: 1, overflowY: 'auto', background: '#161b26', borderRadius: 8, padding: '0.8rem', minHeight: 300 }}>
              {messages.map((m) => (
                <p key={m.id} style={{ color: m.role === 'user' ? '#e6e9f0' : '#7dd3fc' }}>
                  <strong>{m.role === 'user' ? 'You' : 'Assistant'}:</strong>{' '}
                  {m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')}
                </p>
              ))}
              {status === 'streaming' && <p style={{ color: '#9aa4b8' }}>Thinking...</p>}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem('chat') as HTMLInputElement;
                if (!input.value.trim()) return;
                sendMessage({ text: input.value }, { body: { transcript: analysis.transcript } });
                input.value = '';
              }}
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              <input name="chat" placeholder="Ask about this video..." style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #232a3a', background: '#161b26', color: 'inherit' }} />
              <button type="submit" style={{ padding: '0.6rem 1rem', borderRadius: 8, background: '#7dd3fc', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Send</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

import { YoutubeTranscript } from 'youtube-transcript';

export function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export type TranscriptSegment = { text: string; offsetSeconds: number };

export async function fetchTranscript(videoId: string): Promise<TranscriptSegment[]> {
  const raw = await YoutubeTranscript.fetchTranscript(videoId);
  return raw.map((seg) => ({ text: seg.text, offsetSeconds: Math.floor(seg.offset / 1000) }));
}

export function formatTranscriptForPrompt(segments: TranscriptSegment[]): string {
  return segments.map((s) => `[${formatTimestamp(s.offsetSeconds)}] ${s.text}`).join('\n');
}

export function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

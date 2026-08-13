import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { extractVideoId, fetchTranscript, formatTranscriptForPrompt } from '@/lib/transcript';

// ponytail: whole transcript stuffed into context, chunked retrieval if videos routinely blow the context window
const analysisSchema = z.object({
  summary: z.string(),
  chapters: z.array(z.object({ timestamp: z.string(), title: z.string() })),
  flashcards: z.array(z.object({ question: z.string(), answer: z.string() })),
});

export async function POST(req: Request) {
  const { url } = await req.json();
  const videoId = extractVideoId(url);
  if (!videoId) {
    return Response.json({ error: 'Not a valid YouTube URL' }, { status: 400 });
  }

  const segments = await fetchTranscript(videoId);
  const transcript = formatTranscriptForPrompt(segments);

  const { output } = await generateText({
    model: openai('gpt-4o-mini'),
    output: Output.object({ schema: analysisSchema }),
    prompt: `Transcript with timestamps:\n\n${transcript}\n\nSummarize this video, extract 4-8 chapters with timestamps (use the exact [m:ss] format from the transcript), and generate 5 study flashcards.`,
  });

  return Response.json({ videoId, transcript, ...output });
}

import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { model } from '@/lib/model';

export async function POST(req: Request) {
  const { messages, transcript }: { messages: UIMessage[]; transcript: string } = await req.json();

  const result = streamText({
    model,
    system: `Answer questions about this YouTube video using only the transcript below. Every answer must cite the timestamp(s) it came from, in [m:ss] format.\n\nTranscript:\n${transcript}`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

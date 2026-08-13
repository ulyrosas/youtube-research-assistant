import { openai } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';

// ponytail: Groq free tier for testing without an OpenAI bill; swap to openai() when you want production-grade quality
export const model = process.env.GROQ_API_KEY ? groq('openai/gpt-oss-120b') : openai('gpt-4o-mini');

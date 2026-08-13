import { openai } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';

// ponytail: Groq free tier for testing without an OpenAI bill; swap to openai() when you want production-grade quality
export const model = process.env.GROQ_API_KEY ? groq('llama-3.3-70b-versatile') : openai('gpt-4o-mini');

# YouTube Research Assistant

Paste a YouTube link. Get a summary, chapters, flashcards, and a chat that cites the exact timestamp its answer came from.

## How it works

Transcript (via `youtube-transcript`, no scraping) → whole transcript stuffed into an OpenAI prompt for summary/chapters/flashcards → chat grounded in the same transcript, streamed via the Vercel AI SDK.

No vector DB. Works for typical videos under ~2 hours; longer videos can blow the context window (see `// ponytail:` note in `app/api/analyze/route.ts` for the upgrade path).

## Setup

```bash
npm install
cp .env.example .env.local   # add OPENAI_API_KEY
npm run dev
```

## Stack

Next.js, Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`), `youtube-transcript`, Zod.

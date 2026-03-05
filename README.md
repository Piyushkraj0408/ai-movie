# CineInsight — AI Movie Intelligence

A full-stack Next.js application that lets users enter any IMDb movie ID and get comprehensive movie details along with AI-powered audience sentiment analysis.

---

## Features

- **Movie Details**: Title, poster, cast, release year, rating, runtime, genres, director, and plot
- **Multi-source Ratings**: IMDb, Rotten Tomatoes, and Metacritic scores
- **AI Sentiment Analysis**: Powered by Claude (Anthropic), analyzing ratings, vote counts, awards, and plot
- **Sentiment Classification**: Positive / Mixed / Negative with a 0–100 score
- **Key Themes & Audience Reaction**: AI-extracted thematic tags and a vivid audience reaction summary
- **Responsive Design**: Works on desktop and mobile
- **Input Validation**: Client-side and server-side IMDb ID format validation
- **Graceful Error Handling**: Clear, user-friendly error messages
- **Premium UI**: Cinematic dark theme with Playfair Display typography and gold accents

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack in one repo, API routes, server-side caching, ISR, great DX |
| Frontend | React 18 + TypeScript | Type safety, component model, hooks for state management |
| Styling | CSS-in-JS (inline + scoped) | No extra dependency, full control, responsive via CSS variables |
| Movie Data | OMDB API | Free tier available, comprehensive IMDb-linked data, simple REST |
| AI | Anthropic Claude (Haiku) | Fast, affordable, excellent at structured JSON sentiment analysis |
| Testing | Jest | Standard unit testing for utility functions and validation logic |
| Deployment | Vercel | Native Next.js support, 1-click deploy, free tier, env var management |

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-movie-insight.git
cd ai-movie-insight
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get API Keys

**OMDB API Key** (Free):
1. Visit https://www.omdbapi.com/apikey.aspx
2. Select the Free tier (1,000 requests/day)
3. You'll receive an email with your API key

**Anthropic API Key**:
1. Visit https://console.anthropic.com
2. Create an account and generate an API key
3. New accounts get free credits to start

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
OMDB_API_KEY=your_omdb_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 5. Run the development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Running Tests

```bash
npm test
```

Tests cover:
- IMDb ID format validation
- Sentiment color classification helper
- Rating source name formatting

---

## Deployment to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com and import your repository
3. Add environment variables in the Vercel dashboard:
   - `OMDB_API_KEY`
   - `ANTHROPIC_API_KEY`
4. Deploy — Vercel handles everything automatically

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── movie/route.ts       # OMDB proxy API route
│   │   └── sentiment/route.ts   # Anthropic AI sentiment route
│   ├── globals.css              # Global styles, animations, theme
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main page with orchestration logic
├── components/
│   ├── SearchBar.tsx            # Input with client-side validation
│   ├── MovieCard.tsx            # Full movie detail display
│   ├── SentimentCard.tsx        # AI sentiment results display
│   └── LoadingSkeleton.tsx      # Loading state skeleton screens
├── lib/
│   └── api.ts                   # Client-side API helper functions
├── types/
│   └── index.ts                 # Shared TypeScript interfaces
└── __tests__/
    └── utils.test.ts            # Unit tests
```

---

## Assumptions

1. **No review scraping**: OMDB doesn't provide user reviews. The AI sentiment analysis is based on available structured data (ratings from multiple sources, vote counts, awards, genre, and full plot) rather than scraping IMDb reviews directly. Scraping IMDb violates their Terms of Service.

2. **Haiku model for cost efficiency**: Claude Haiku is used for the sentiment endpoint — it's fast and inexpensive while still producing high-quality structured outputs for this use case.

3. **1-hour cache on movie data**: OMDB responses are cached for 1 hour via Next.js `fetch` caching to minimize API calls for the same movie.

4. **API keys are server-only**: Both API keys are never exposed to the client — all external API calls happen in Next.js API routes (Node.js server environment).

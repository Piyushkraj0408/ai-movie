import { NextRequest, NextResponse } from 'next/server';
import { SentimentResult, ApiError } from '@/types';

interface SentimentRequest {
  title: string;
  year: string;
  plot: string;
  imdbRating: string;
  imdbVotes: string;
  genre: string;
  awards: string;
  ratings: { Source: string; Value: string }[];
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json<ApiError>(
      { error: 'Gemini API key not configured. Please set GEMINI_API_KEY in your environment.' },
      { status: 500 }
    );
  }

  let body: SentimentRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiError>(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const { title, year, plot, imdbRating, imdbVotes, genre, awards, ratings } = body;

  if (!title || !plot) {
    return NextResponse.json<ApiError>(
      { error: 'Title and plot are required for sentiment analysis' },
      { status: 400 }
    );
  }

  const ratingsSummary = ratings
    .map((r) => `${r.Source}: ${r.Value}`)
    .join(', ');

  const prompt = `You are a film critic and audience sentiment analyst. Analyze the following movie and provide an audience sentiment report.

Movie: "${title}" (${year})
Genre: ${genre}
IMDb Rating: ${imdbRating}/10 (based on ${imdbVotes} votes)
Other Ratings: ${ratingsSummary || 'N/A'}
Awards: ${awards || 'N/A'}
Plot: ${plot}

Based on the ratings, vote count, awards, genre, and plot, provide a comprehensive audience sentiment analysis.

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "summary": "A 2-3 sentence summary of how audiences generally feel about this film",
  "classification": "positive",
  "score": 85,
  "keyThemes": ["theme1", "theme2", "theme3", "theme4"],
  "audienceReaction": "A vivid, engaging sentence about the typical audience experience"
}

classification must be exactly one of: positive, mixed, negative
score must be a number between 0 and 100`;

  try {
    // Using Gemini 2.0 Flash — fast and free tier available
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract text from Gemini response shape
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!rawText) {
      throw new Error('Empty response from Gemini API');
    }

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const sentiment: SentimentResult = JSON.parse(cleaned);

    // Validate response shape
    if (!sentiment.summary || !sentiment.classification || sentiment.score === undefined) {
      throw new Error('Invalid sentiment response structure from Gemini');
    }

    return NextResponse.json<SentimentResult>(sentiment);
  } catch (error) {
    console.error('Error generating sentiment:', error);
    return NextResponse.json<ApiError>(
      { error: 'Failed to generate AI sentiment analysis. Please try again.' },
      { status: 500 }
    );
  }
}

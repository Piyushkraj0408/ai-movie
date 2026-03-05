import { Movie, SentimentResult, ApiError } from '@/types';

/**
 * Fetches movie data from our Next.js API route (which calls OMDB)
 */
export async function fetchMovie(imdbId: string): Promise<Movie> {
  const response = await fetch(`/api/movie?id=${encodeURIComponent(imdbId.trim())}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as ApiError).error || 'Failed to fetch movie');
  }

  return data as Movie;
}

/**
 * Fetches AI-generated sentiment analysis from our Next.js API route
 */
export async function fetchSentiment(movie: Movie): Promise<SentimentResult> {
  const response = await fetch('/api/sentiment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: movie.Title,
      year: movie.Year,
      plot: movie.Plot,
      imdbRating: movie.imdbRating,
      imdbVotes: movie.imdbVotes,
      genre: movie.Genre,
      awards: movie.Awards,
      ratings: movie.Ratings,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as ApiError).error || 'Failed to generate sentiment');
  }

  return data as SentimentResult;
}

/**
 * Returns color class based on sentiment classification
 */
export function getSentimentColor(classification: string): string {
  switch (classification) {
    case 'positive':
      return '#22c55e';
    case 'negative':
      return '#ef4444';
    default:
      return '#f59e0b';
  }
}

/**
 * Returns a readable rating source name
 */
export function formatRatingSource(source: string): string {
  const map: Record<string, string> = {
    'Internet Movie Database': 'IMDb',
    'Rotten Tomatoes': 'Rotten Tomatoes',
    Metacritic: 'Metacritic',
  };
  return map[source] || source;
}

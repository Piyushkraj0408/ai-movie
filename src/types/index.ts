// Movie data returned from OMDB API
export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  imdbRating: string;
  imdbVotes: string;
  BoxOffice: string;
  Type: string;
  Response: string;
  Error?: string;
}

// Sentiment analysis result from AI
export interface SentimentResult {
  summary: string;
  classification: 'positive' | 'mixed' | 'negative';
  score: number; // 0-100
  keyThemes: string[];
  audienceReaction: string;
}

// Combined movie insight payload
export interface MovieInsight {
  movie: Movie;
  sentiment: SentimentResult;
}

// API error shape
export interface ApiError {
  error: string;
  details?: string;
}

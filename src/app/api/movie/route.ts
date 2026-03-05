import { NextRequest, NextResponse } from 'next/server';
import { Movie, ApiError } from '@/types';

// Validates IMDb ID format: starts with "tt" followed by 7-8 digits
function isValidImdbId(id: string): boolean {
  return /^tt\d{7,8}$/.test(id.trim());
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get('id');

  // Input validation
  if (!imdbId) {
    return NextResponse.json<ApiError>(
      { error: 'IMDb ID is required' },
      { status: 400 }
    );
  }

  if (!isValidImdbId(imdbId)) {
    return NextResponse.json<ApiError>(
      { error: 'Invalid IMDb ID format. Expected format: tt followed by 7-8 digits (e.g. tt0133093)' },
      { status: 400 }
    );
  }

  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json<ApiError>(
      { error: 'OMDB API key not configured. Please set OMDB_API_KEY in your environment.' },
      { status: 500 }
    );
  }

  try {
    const omdbUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}&plot=full`;
    const response = await fetch(omdbUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`OMDB API responded with status ${response.status}`);
    }

    const data: Movie = await response.json();

    if (data.Response === 'False') {
      return NextResponse.json<ApiError>(
        { error: data.Error || 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<Movie>(data);
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return NextResponse.json<ApiError>(
      { error: 'Failed to fetch movie data. Please try again.' },
      { status: 500 }
    );
  }
}

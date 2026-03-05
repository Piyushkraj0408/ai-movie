/**
 * Unit tests for IMDb ID validation, API helpers, and utility functions.
 * Run with: npm test
 */

// --- IMDb ID validation ---
function isValidImdbId(id: string): boolean {
  return /^tt\d{7,8}$/.test(id.trim());
}

describe('isValidImdbId', () => {
  test('accepts valid 7-digit IMDb ID', () => {
    expect(isValidImdbId('tt0133093')).toBe(true);
  });

  test('accepts valid 8-digit IMDb ID', () => {
    expect(isValidImdbId('tt10872600')).toBe(true);
  });

  test('accepts ID with surrounding whitespace', () => {
    expect(isValidImdbId('  tt0468569  ')).toBe(true);
  });

  test('rejects ID without tt prefix', () => {
    expect(isValidImdbId('0133093')).toBe(false);
  });

  test('rejects ID with too few digits', () => {
    expect(isValidImdbId('tt01234')).toBe(false);
  });

  test('rejects ID with too many digits', () => {
    expect(isValidImdbId('tt012345678')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(isValidImdbId('')).toBe(false);
  });

  test('rejects ID with letters after tt', () => {
    expect(isValidImdbId('ttabcdefg')).toBe(false);
  });
});

// --- Sentiment color helper ---
function getSentimentColor(classification: string): string {
  switch (classification) {
    case 'positive': return '#22c55e';
    case 'negative': return '#ef4444';
    default: return '#f59e0b';
  }
}

describe('getSentimentColor', () => {
  test('returns green for positive', () => {
    expect(getSentimentColor('positive')).toBe('#22c55e');
  });

  test('returns red for negative', () => {
    expect(getSentimentColor('negative')).toBe('#ef4444');
  });

  test('returns amber for mixed', () => {
    expect(getSentimentColor('mixed')).toBe('#f59e0b');
  });

  test('returns amber for unknown classification', () => {
    expect(getSentimentColor('unknown')).toBe('#f59e0b');
  });
});

// --- Rating source formatting ---
function formatRatingSource(source: string): string {
  const map: Record<string, string> = {
    'Internet Movie Database': 'IMDb',
    'Rotten Tomatoes': 'Rotten Tomatoes',
    Metacritic: 'Metacritic',
  };
  return map[source] || source;
}

describe('formatRatingSource', () => {
  test('formats OMDB source name to IMDb', () => {
    expect(formatRatingSource('Internet Movie Database')).toBe('IMDb');
  });

  test('keeps Rotten Tomatoes as-is', () => {
    expect(formatRatingSource('Rotten Tomatoes')).toBe('Rotten Tomatoes');
  });

  test('keeps Metacritic as-is', () => {
    expect(formatRatingSource('Metacritic')).toBe('Metacritic');
  });

  test('returns unknown sources unchanged', () => {
    expect(formatRatingSource('Some Other Source')).toBe('Some Other Source');
  });
});

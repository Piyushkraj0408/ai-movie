import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CineInsight — AI Movie Intelligence',
  description: 'Enter any IMDb movie ID to get AI-powered audience sentiment analysis and movie insights.',
  keywords: ['movies', 'IMDb', 'AI', 'sentiment analysis', 'film review'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

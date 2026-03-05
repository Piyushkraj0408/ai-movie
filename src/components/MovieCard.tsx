'use client';

import Image from 'next/image';
import { Movie } from '@/types';
import { formatRatingSource } from '@/lib/api';

interface MovieCardProps { movie: Movie; }

export default function MovieCard({ movie }: MovieCardProps) {
  const hasPoster = movie.Poster && movie.Poster !== 'N/A';
  const cast = movie.Actors?.split(',').map(a => a.trim()) || [];

  return (
    <div style={{ animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'clamp(180px, 22%, 260px) 1fr',
        gap: '44px', alignItems: 'start',
      }}>

        {/* ── Poster ── */}
        <div style={{ position: 'relative' }}>
          {/* Glow behind */}
          <div style={{
            position: 'absolute', inset: '-4px', borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(232,184,75,0.12), rgba(232,75,106,0.08))',
            filter: 'blur(16px)', zIndex: 0,
          }} />
          <div style={{
            position: 'relative', zIndex: 1,
            borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
            aspectRatio: '2/3',
            background: 'var(--elevated)',
          }}>
            {hasPoster ? (
              <Image src={movie.Poster} alt={movie.Title} fill style={{ objectFit: 'cover' }} sizes="260px" priority />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-3)' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                <span style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>NO POSTER</span>
              </div>
            )}
            {/* Bottom fade */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(transparent, rgba(2,2,10,0.9))' }} />
            {/* Rating */}
            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
              <div style={{
                position: 'absolute', bottom: '14px', left: '14px',
                background: 'rgba(2,2,10,0.85)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(232,184,75,0.2)', borderRadius: '10px',
                padding: '7px 13px', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#e8b84b">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
                <span style={{ color: 'var(--gold)', fontSize: '16px', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>{movie.imdbRating}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontFamily: 'DM Mono, monospace' }}>/10</span>
              </div>
            )}
            {/* Votes */}
            {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
              <div style={{ position: 'absolute', bottom: '14px', right: '14px' }}>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontFamily: 'DM Mono, monospace' }}>
                  {movie.imdbVotes} votes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Info ── */}
        <div style={{ minWidth: 0 }}>
          {/* Type badge */}
          {movie.Type && (
            <div style={{ display: 'inline-block', background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', color: 'var(--gold)', borderRadius: '6px', padding: '3px 10px', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace', marginBottom: '10px' }}>
              {movie.Type}
            </div>
          )}

          {/* Title */}
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            letterSpacing: '0.04em', lineHeight: 0.95,
            color: 'var(--text)', marginBottom: '16px',
          }}>
            {movie.Title}
          </h2>

          {/* Meta row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {movie.Year !== 'N/A' && <Chip>{movie.Year}</Chip>}
            {movie.Rated !== 'N/A' && <Chip gold>{movie.Rated}</Chip>}
            {movie.Runtime !== 'N/A' && <Chip>{movie.Runtime}</Chip>}
            {movie.Country && movie.Country !== 'N/A' && <Chip>{movie.Country.split(',')[0].trim()}</Chip>}
            {movie.Genre !== 'N/A' && movie.Genre.split(',').map(g => <Chip key={g}>{g.trim()}</Chip>)}
          </div>

          {/* Plot */}
          <p style={{ color: 'var(--text-2)', fontSize: '15px', lineHeight: 1.85, marginBottom: '28px', fontWeight: 300 }}>
            {movie.Plot}
          </p>

          {/* Director / Writer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            {movie.Director !== 'N/A' && <MetaRow label="Director" value={movie.Director} />}
            {movie.Writer   !== 'N/A' && <MetaRow label="Writer"   value={movie.Writer} />}
          </div>

          {/* Cast */}
          {cast.length > 0 && cast[0] !== 'N/A' && (
            <div style={{ marginBottom: '28px' }}>
              <Label>Cast</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {cast.map((a, i) => (
                  <div key={i} data-hover="true" style={{
                    background: 'var(--card)', border: '1px solid var(--border-2)',
                    borderRadius: '100px', padding: '6px 16px',
                    fontSize: '13px', color: 'var(--text-2)',
                    cursor: 'none', transition: 'all 0.2s',
                    animation: `fadeUp 0.4s ${i * 0.06}s ease both`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-2)'; }}
                  >
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings */}
          {movie.Ratings && movie.Ratings.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <Label>Ratings</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
                {movie.Ratings.map((r, i) => (
                  <div key={r.Source} data-hover="true" style={{
                    background: 'var(--card)', border: '1px solid var(--border-2)',
                    borderRadius: '14px', padding: '16px 22px', textAlign: 'center',
                    minWidth: '110px', cursor: 'none',
                    transition: 'all 0.3s',
                    animation: `popIn 0.5s ${i * 0.1}s ease both`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '0.04em', color: 'var(--gold)', animation: 'countNum 0.4s ease' }}>
                      {r.Value}
                    </div>
                    <div style={{ color: 'var(--text-3)', fontSize: '10px', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>
                      {formatRatingSource(r.Source)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {movie.Awards && movie.Awards !== 'N/A' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(232,184,75,0.05), transparent)',
              border: '1px solid rgba(232,184,75,0.12)', borderRadius: '14px',
              padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" style={{ flexShrink: 0 }}>
                <path d="M8 21h8M12 17v4M17 3H7l-2 5c0 3.87 3.13 7 7 7s7-3.13 7-7l-2-5zM3 8h2M22 8h-2"/>
              </svg>
              <p style={{ color: 'rgba(232,184,75,0.7)', fontSize: '13px', fontWeight: 300 }}>{movie.Awards}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn   { 0%{opacity:0;transform:scale(0.7)} 70%{transform:scale(1.04)} 100%{opacity:1;transform:scale(1)} }
        @keyframes countNum{ from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:620px){
          div[style*="grid-template-columns: clamp"]{grid-template-columns:1fr !important}
        }
      `}</style>
    </div>
  );
}

function Chip({ children, gold }: { children: React.ReactNode; gold?: boolean }) {
  return (
    <span style={{
      background: gold ? 'rgba(232,184,75,0.1)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${gold ? 'rgba(232,184,75,0.25)' : 'rgba(255,255,255,0.06)'}`,
      color: gold ? 'var(--gold)' : 'var(--text-2)',
      borderRadius: '100px', padding: '4px 13px',
      fontSize: '12px', fontWeight: gold ? 600 : 400,
      letterSpacing: gold ? '0.08em' : '0.02em',
    }}>
      {children}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ color: 'var(--text-3)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '5px', fontFamily: 'DM Mono, monospace' }}>{label}</p>
      <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.5, fontWeight: 300 }}>{value}</p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ color: 'var(--text-3)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>{children}</p>;
}
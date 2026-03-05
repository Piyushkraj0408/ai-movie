'use client';

import { useState, useEffect, useRef } from 'react';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import SentimentCard from '@/components/SentimentCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import FilmStrip from '@/components/FlimStrip';
import { fetchMovie, fetchSentiment } from '@/lib/api';
import { Movie, SentimentResult } from '@/types';

type LoadingState = 'idle' | 'loading-movie' | 'loading-sentiment' | 'done';

export default function HomePage() {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [introVisible, setIntroVisible] = useState(true);
  const [introProgress, setIntroProgress] = useState(0);
  const [appVisible, setAppVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringPos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  // ── Cursor logic ──
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    const animateRing = () => {
      ringPos.current.x += (cursorPos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (cursorPos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + 'px';
        ringRef.current.style.top = ringPos.current.y + 'px';
      }
      rafRef.current = requestAnimationFrame(animateRing);
    };
    const onEnter = () => document.body.classList.add('cursor-hover');
    const onLeave = () => document.body.classList.remove('cursor-hover');
    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('a,button,input,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    rafRef.current = requestAnimationFrame(animateRing);
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Intro animation ──
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 4 + 1;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIntroVisible(false);
          setTimeout(() => setAppVisible(true), 400);
        }, 400);
      }
      setIntroProgress(Math.min(progress, 100));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  async function handleSearch(imdbId: string) {
    setError(null);
    setMovie(null);
    setSentiment(null);
    setLoadingState('loading-movie');
    try {
      const movieData = await fetchMovie(imdbId);
      setMovie(movieData);
      setLoadingState('loading-sentiment');
      const sentimentData = await fetchSentiment(movieData);
      setSentiment(sentimentData);
      setLoadingState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoadingState('idle');
    }
  }

  const isLoading = loadingState === 'loading-movie' || loadingState === 'loading-sentiment';

  return (
    <>
      {/* ── Custom Cursor ── */}
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />
      <div id="grain" />

      {/* ── Intro Screen ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99990,
        background: 'var(--void)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '28px',
        opacity: introVisible ? 1 : 0,
        visibility: introVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.7s ease, visibility 0.7s ease',
      }}>
        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          animation: 'scanLine 2s ease-in-out infinite',
          top: 0,
        }} />

        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(60px, 12vw, 100px)',
            letterSpacing: '0.15em',
            background: 'linear-gradient(135deg, #e8b84b 0%, #ffd166 50%, #e84b6a 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradShift 2s ease infinite',
          }}>
            CINEINSIGHT
          </div>
          <div style={{
            color: 'var(--text-3)', fontSize: '11px', letterSpacing: '0.4em',
            textTransform: 'uppercase', marginTop: '4px',
          }}>
            AI MOVIE INTELLIGENCE
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '240px' }}>
          <div style={{
            height: '2px', background: 'var(--elevated)',
            borderRadius: '1px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${introProgress}%`,
              background: 'linear-gradient(90deg, var(--gold), var(--crimson))',
              borderRadius: '1px',
              transition: 'width 0.1s linear',
              boxShadow: '0 0 10px var(--gold-glow)',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '8px',
          }}>
            <span style={{ color: 'var(--text-3)', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'DM Mono, monospace' }}>
              LOADING
            </span>
            <span style={{ color: 'var(--gold)', fontSize: '10px', fontFamily: 'DM Mono, monospace' }}>
              {Math.round(introProgress)}%
            </span>
          </div>
        </div>

        {/* Film strip at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <FilmStrip />
        </div>
      </div>

      {/* ── Star Particles ── */}
      {appVisible && Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          position: 'fixed',
          left: `${Math.random() * 100}%`,
          width: '2px', height: '2px',
          background: i % 3 === 0 ? 'var(--gold)' : i % 3 === 1 ? 'var(--crimson)' : 'var(--sky)',
          borderRadius: '50%',
          pointerEvents: 'none', zIndex: 1,
          animation: `starFall ${6 + Math.random() * 8}s ${Math.random() * 5}s linear infinite`,
          opacity: 0,
        }} />
      ))}

      {/* ── Main App ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        opacity: appVisible ? 1 : 0,
        transform: appVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        {/* Background orbs */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,184,75,0.04) 0%, transparent 70%)', animation: 'float 9s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '30%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,75,106,0.04) 0%, transparent 70%)', animation: 'float 11s ease-in-out infinite reverse' }} />
          <div style={{ position: 'absolute', bottom: '0%', left: '20%', width: '700px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,214,160,0.03) 0%, transparent 70%)', animation: 'float 13s ease-in-out infinite' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1040px', margin: '0 auto', padding: '0 28px 120px' }}>

          {/* ── Hero ── */}
          <header style={{ textAlign: 'center', padding: '88px 0 72px' }}>
            {/* Film icon */}
            <div style={{
              width: '68px', height: '68px', margin: '0 auto 32px',
              background: 'linear-gradient(135deg, var(--card), var(--elevated))',
              border: '1px solid var(--border-gold)',
              borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px var(--gold-dim), inset 0 1px 0 rgba(255,255,255,0.05)',
              animation: 'float 5s ease-in-out infinite, glowPulse 3s ease-in-out infinite',
              position: 'relative', cursor: 'pointer',
            }}
            data-hover="true"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <defs>
                  <linearGradient id="ig" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#e8b84b"/>
                    <stop offset="100%" stopColor="#ffd166"/>
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="2.18" stroke="url(#ig)"/>
                <line x1="7" y1="2" x2="7" y2="22" stroke="url(#ig)"/>
                <line x1="17" y1="2" x2="17" y2="22" stroke="url(#ig)"/>
                <line x1="2" y1="12" x2="22" y2="12" stroke="url(#ig)"/>
                <line x1="2" y1="7" x2="7" y2="7" stroke="url(#ig)"/>
                <line x1="2" y1="17" x2="7" y2="17" stroke="url(#ig)"/>
                <line x1="17" y1="17" x2="22" y2="17" stroke="url(#ig)"/>
                <line x1="17" y1="7" x2="22" y2="7" stroke="url(#ig)"/>
              </svg>
              {/* Ripple */}
              <div style={{ position: 'absolute', inset: '-8px', borderRadius: '28px', border: '1px solid rgba(232,184,75,0.15)', animation: 'ripple 2s ease-in-out infinite' }} />
            </div>

            {/* Live badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(6,214,160,0.07)', border: '1px solid rgba(6,214,160,0.2)',
              borderRadius: '100px', padding: '5px 16px', marginBottom: '24px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)', animation: 'pulse 1.5s ease infinite' }} />
              <span style={{ color: 'var(--emerald)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '600' }}>
                Optimus AI · Live
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(52px, 11vw, 110px)',
              letterSpacing: '0.06em',
              lineHeight: 0.9,
              background: 'linear-gradient(135deg, #ffffff 0%, #e8b84b 45%, #ffd166 60%, #e84b6a 100%)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradShift 5s ease infinite',
              marginBottom: '20px',
            }}>
              CineInsight
            </h1>

            <p style={{
              color: 'var(--text-2)', fontSize: 'clamp(15px, 2vw, 18px)',
              maxWidth: '460px', margin: '0 auto 48px',
              lineHeight: 1.7, fontWeight: 300,
            }}>
              Drop any IMDb ID. Get AI-powered audience sentiment, cast intel, and cinematic analysis — instantly.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </header>

          {/* Film strip divider */}
          {!movie && !isLoading && !error && (
            <div style={{ marginBottom: '40px', animation: 'fadeIn 1s 0.5s ease both' }}>
              <FilmStrip reverse />
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(232,75,106,0.07), rgba(232,75,106,0.03))',
              border: '1px solid rgba(232,75,106,0.2)', borderRadius: '20px',
              padding: '22px 28px', display: 'flex', gap: '16px', alignItems: 'flex-start',
              animation: 'fadeUp 0.4s ease', marginBottom: '40px',
              backdropFilter: 'blur(20px)',
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(232,75,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <p style={{ color: 'var(--crimson)', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Error</p>
                <p style={{ color: 'rgba(232,75,106,0.7)', fontSize: '14px', fontWeight: 300 }}>{error}</p>
              </div>
            </div>
          )}

          {/* ── Loading ── */}
          {isLoading && !movie && <LoadingSkeleton />}

          {/* ── Results ── */}
          {movie && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold), var(--crimson), transparent)' }} />
              <MovieCard movie={movie} />
              {loadingState === 'loading-sentiment' && (
                <div style={{
                  background: 'linear-gradient(135deg, var(--card), var(--elevated))',
                  border: '1px solid var(--border-gold)', borderRadius: '20px',
                  padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '16px',
                  animation: 'fadeIn 0.3s ease', backdropFilter: 'blur(20px)',
                  animation2: 'borderGlow 2s ease infinite',
                }}>
                  <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(232,184,75,0.1)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <div style={{ position: 'absolute', inset: '6px', border: '2px solid rgba(232,75,106,0.1)', borderTopColor: 'var(--crimson)', borderRadius: '50%', animation: 'spinR 1.1s linear infinite' }} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 500, marginBottom: '3px' }}>
                      Optimus AI analyzing <span style={{ color: 'var(--gold)' }}>{movie.Title}</span>
                    </p>
                    <p style={{ color: 'var(--text-3)', fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>
                      Processing ratings · sentiment · themes · audience reaction
                    </p>
                  </div>
                </div>
              )}
              {sentiment && <SentimentCard sentiment={sentiment} movie={movie} />}
              {sentiment && (
                <p style={{ color: 'var(--text-3)', fontSize: '12px', textAlign: 'center', letterSpacing: '0.05em' }}>
                  Analysis by <span style={{ color: 'var(--gold)', opacity: 0.6 }}>Optimus AI</span> · Based on public ratings & metadata
                </p>
              )}
            </div>
          )}

          {/* ── Empty state ── */}
          {loadingState === 'idle' && !error && !movie && (
            <div style={{ textAlign: 'center', padding: '20px 0 60px', animation: 'fadeIn 1.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', marginBottom: '36px' }}>
                {[
                  { h: 120, rot: -8, delay: 0, color: 'rgba(232,184,75,0.08)' },
                  { h: 160, rot: 0, delay: 0.2, color: 'rgba(232,75,106,0.08)' },
                  { h: 120, rot: 8, delay: 0.4, color: 'rgba(72,202,228,0.08)' },
                ].map((item, i) => (
                  <div key={i} style={{
                    width: '80px', height: `${item.h}px`,
                    background: `linear-gradient(180deg, ${item.color}, var(--card))`,
                    borderRadius: '12px', border: '1px solid var(--border-2)',
                    transform: `rotate(${item.rot}deg)`,
                    animation: `float 4s ${item.delay}s ease-in-out infinite`,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(232,184,75,0.03), transparent)' }} />
                    {/* Film holes */}
                    {[20, 50, 80].map(pct => (
                      <div key={pct} style={{ position: 'absolute', top: `${pct}%`, left: '50%', transform: 'translateX(-50%)', width: '12px', height: '12px', background: 'var(--void)', borderRadius: '2px', opacity: 0.5 }} />
                    ))}
                  </div>
                ))}
              </div>
              <p style={{ color: 'var(--text-3)', fontSize: '14px', letterSpacing: '0.1em', fontFamily: 'DM Mono, monospace' }}>
                // your cinematic insights will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 40px rgba(232,184,75,0.1),inset 0 1px 0 rgba(255,255,255,0.05)} 50%{box-shadow:0 0 60px rgba(232,184,75,0.25),inset 0 1px 0 rgba(255,255,255,0.05)} }
        @keyframes scanLine  { 0%{top:0;opacity:0.8} 100%{top:100%;opacity:0} }
        @keyframes starFall  { 0%{transform:translateY(-20px);opacity:0} 10%{opacity:1} 90%{opacity:0.4} 100%{transform:translateY(100vh);opacity:0} }
        @keyframes ripple    { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(1.6);opacity:0} }
        @keyframes borderGlow{ 0%,100%{border-color:rgba(232,184,75,0.15)} 50%{border-color:rgba(232,184,75,0.4)} }
      `}</style>
    </>
  );
}
'use client';

import { SentimentResult } from '@/types';
import { Movie } from '@/types';
import { getSentimentColor } from '@/lib/api';

interface Props { sentiment: SentimentResult; movie: Movie; }

// Curated fake-style audience comments generated from sentiment data
function generateComments(sentiment: SentimentResult, movie: Movie) {
  const isPos = sentiment.classification === 'positive';
  const isMix = sentiment.classification === 'mixed';
  const score = sentiment.score;
  const title = movie.Title;

  const positive = [
    { user: 'CinematicSoul', avatar: 'CS', stars: 5, time: '2d ago', comment: `${title} is genuinely one of those rare films that stays with you long after the credits roll. Absolutely mesmerizing.`, likes: Math.floor(Math.random()*200+50) },
    { user: 'FilmBuffPriya', avatar: 'FP', stars: 5, time: '5d ago', comment: `I wasn't expecting to cry but here we are. The performances are extraordinary. ${title} deserves every award it got.`, likes: Math.floor(Math.random()*150+30) },
    { user: 'ReelTalk_Arjun', avatar: 'RA', stars: 4, time: '1w ago', comment: `A masterclass in storytelling. The direction is tight, the writing is sharp. ${title} sets the bar incredibly high.`, likes: Math.floor(Math.random()*180+20) },
    { user: 'NightOwlCritic', avatar: 'NC', stars: 5, time: '2w ago', comment: `Watched it with zero expectations and left completely blown away. ${title} is the kind of film that reminds you why cinema matters.`, likes: Math.floor(Math.random()*120+40) },
  ];

  const mixed = [
    { user: 'CriticalEye_Dev', avatar: 'CE', stars: 3, time: '3d ago', comment: `${title} has some genuinely stunning moments but the pacing in the second half loses steam. Worth watching once for sure.`, likes: Math.floor(Math.random()*80+20) },
    { user: 'MovieMaven_Riya', avatar: 'MM', stars: 4, time: '1w ago', comment: `The visuals are breathtaking but the plot has holes you could drive a truck through. Still enjoyed it though!`, likes: Math.floor(Math.random()*100+15) },
    { user: 'PopcornPhilosopher', avatar: 'PP', stars: 3, time: '2w ago', comment: `${title} tries to do too much. When it works, it really works. When it doesn't, it really doesn't. Ambivalent but intrigued.`, likes: Math.floor(Math.random()*60+10) },
    { user: 'FrameByFrame_Ankit', avatar: 'FA', stars: 4, time: '3w ago', comment: `Technically brilliant, emotionally uneven. ${title} earns its reputation even if it doesn't fully live up to the hype.`, likes: Math.floor(Math.random()*90+25) },
  ];

  const negative = [
    { user: 'HonestViewer_23', avatar: 'HV', stars: 2, time: '4d ago', comment: `I really wanted to love ${title} but the screenplay is a mess and the characters feel underdeveloped. Disappointing.`, likes: Math.floor(Math.random()*40+5) },
    { user: 'OverratedAlert', avatar: 'OA', stars: 2, time: '1w ago', comment: `The hype around ${title} is completely undeserved. Two hours of style over substance. Not for me.`, likes: Math.floor(Math.random()*35+8) },
    { user: 'TruthInCinema', avatar: 'TC', stars: 3, time: '2w ago', comment: `${title} had potential but squanders it in the third act. The ending feels rushed and unsatisfying.`, likes: Math.floor(Math.random()*55+12) },
    { user: 'BackRowReviewer', avatar: 'BR', stars: 1, time: '3w ago', comment: `Genuinely puzzled by the praise. ${title} is technically fine I suppose but emotionally hollow. Left feeling nothing.`, likes: Math.floor(Math.random()*30+5) },
  ];

  if (isPos) return positive;
  if (isMix) return mixed;
  return negative;
}

export default function SentimentCard({ sentiment, movie }: Props) {
  const color = getSentimentColor(sentiment.classification);
  const label = sentiment.classification.charAt(0).toUpperCase() + sentiment.classification.slice(1);
  const comments = generateComments(sentiment, movie);

  const cfgs = {
    positive: { bg: 'rgba(6,214,160,0.05)',  border: 'rgba(6,214,160,0.15)'  },
    negative: { bg: 'rgba(232,75,106,0.05)', border: 'rgba(232,75,106,0.15)' },
    mixed:    { bg: 'rgba(232,184,75,0.05)', border: 'rgba(232,184,75,0.15)' },
  };
  const cfg = cfgs[sentiment.classification] || cfgs.mixed;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Main Sentiment Panel ── */}
      <div style={{
        background: 'linear-gradient(160deg, var(--card) 0%, var(--surface) 100%)',
        borderRadius: '24px', border: `1px solid ${cfg.border}`,
        padding: '36px', position: 'relative', overflow: 'hidden',
        animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        boxShadow: `0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}>
        {/* Top line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
        {/* Ambient */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: `radial-gradient(circle, ${color}0a 0%, transparent 70%)`, pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(232,184,75,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
              </div>
              <span style={{ color: 'var(--text-3)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>
                Optimus AI · Sentiment Analysis
              </span>
            </div>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', letterSpacing: '0.06em', color: 'var(--text)' }}>
              Audience Intelligence Report
            </h3>
          </div>

          {/* Badge */}
          <div style={{
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            color, borderRadius: '100px', padding: '8px 20px',
            fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.08em', fontFamily: 'Outfit, sans-serif',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}`, animation: 'pulse 2s ease infinite' }} />
            {label}
          </div>
        </div>

        {/* Score */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: 'var(--text-3)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>
              Sentiment Score
            </span>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', letterSpacing: '0.04em', color, animation: 'countNum 0.5s ease' }}>
              {sentiment.score}<span style={{ fontSize: '14px', opacity: 0.4, fontFamily: 'DM Mono, monospace' }}>/100</span>
            </span>
          </div>
          {/* Bar */}
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{
              height: '100%', width: `${sentiment.score}%`,
              background: `linear-gradient(90deg, ${color}80, ${color})`,
              borderRadius: '4px', boxShadow: `0 0 20px ${color}60`,
              animation: 'progressW 1.4s cubic-bezier(0.16,1,0.3,1) forwards',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.2) 80%, transparent 100%)', animation: 'shimmer 2s linear infinite', backgroundSize: '200% 100%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            {['Negative', 'Mixed', 'Positive'].map(l => (
              <span key={l} style={{ color: 'var(--text-3)', fontSize: '9px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Summary */}
        <p style={{ color: 'var(--text-2)', fontSize: '15px', lineHeight: 1.85, marginBottom: '22px', fontWeight: 300 }}>
          {sentiment.summary}
        </p>

        {/* Quote */}
        <div style={{
          background: `linear-gradient(135deg, ${color}06, transparent)`,
          borderLeft: `3px solid ${color}50`,
          borderRadius: '0 12px 12px 0',
          padding: '16px 20px', marginBottom: '28px',
        }}>
          <p style={{ color: 'var(--text)', fontSize: '14px', lineHeight: 1.75, fontStyle: 'italic', opacity: 0.8 }}>
            "{sentiment.audienceReaction}"
          </p>
        </div>

        {/* Themes */}
        {sentiment.keyThemes?.length > 0 && (
          <div>
            <p style={{ color: 'var(--text-3)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'DM Mono, monospace' }}>
              Key Themes
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {sentiment.keyThemes.map((t, i) => (
                <span key={i} data-hover="true" style={{
                  background: `linear-gradient(135deg, ${color}08, rgba(255,255,255,0.02))`,
                  border: `1px solid ${color}20`,
                  color: 'var(--text-2)', borderRadius: '100px',
                  padding: '6px 16px', fontSize: '13px',
                  animation: `slideLeft 0.4s ${i * 0.07}s ease both`,
                  cursor: 'none', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.color = color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}20`; e.currentTarget.style.color = 'var(--text-2)'; }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Audience Comments ── */}
      <div style={{ animation: 'fadeUp 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h4 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '0.08em', color: 'var(--text)' }}>
              Audience Voices
            </h4>
            <span style={{ background: 'rgba(232,184,75,0.1)', border: '1px solid var(--border-gold)', color: 'var(--gold)', borderRadius: '6px', padding: '2px 10px', fontSize: '10px', fontFamily: 'DM Mono, monospace' }}>
              AI SIMULATED
            </span>
          </div>
          <span style={{ color: 'var(--text-3)', fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
            Based on {movie.imdbVotes || 'N/A'} IMDb votes
          </span>
        </div>

        {/* Comment cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {comments.map((c, i) => (
            <div key={i} data-hover="true" style={{
              background: 'var(--card)', border: '1px solid var(--border-2)',
              borderRadius: '18px', padding: '22px',
              animation: `fadeUp 0.5s ${0.3 + i * 0.1}s ease both`,
              cursor: 'none', transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,184,75,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 50px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* User row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                    border: `1px solid ${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, color,
                    fontFamily: 'DM Mono, monospace', flexShrink: 0,
                  }}>
                    {c.avatar}
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '1px' }}>{c.user}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'DM Mono, monospace' }}>{c.time}</p>
                  </div>
                </div>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <svg key={si} width="11" height="11" viewBox="0 0 24 24"
                      fill={si < c.stars ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}>
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                    </svg>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <p style={{ color: 'var(--text-2)', fontSize: '13px', lineHeight: 1.7, fontWeight: 300, marginBottom: '14px' }}>
                "{c.comment}"
              </p>

              {/* Like row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} data-hover="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
                <span style={{ color: 'var(--text-3)', fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>{c.likes} found helpful</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progressW { from{width:0} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideLeft { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes countNum  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}
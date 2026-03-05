'use client';

interface FilmStripProps { reverse?: boolean; }

const LABELS = ['ACTION', 'DRAMA', 'COMEDY', 'THRILLER', 'SCI-FI', 'ROMANCE', 'HORROR', 'ANIMATION', 'MYSTERY', 'ADVENTURE', 'FANTASY', 'CRIME'];

export default function FilmStrip({ reverse = false }: FilmStripProps) {
  const items = [...LABELS, ...LABELS]; // double for seamless loop

  return (
    <div style={{
      overflow: 'hidden', width: '100%', padding: '4px 0',
      maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
    }}>
      <div style={{
        display: 'flex', gap: '0',
        animation: `${reverse ? 'filmScrollR' : 'filmScroll'} 25s linear infinite`,
        width: 'max-content',
      }}>
        {items.map((label, i) => (
          <div key={i} style={{
            width: '72px', height: '52px',
            background: 'var(--card)',
            border: '1px solid var(--border-2)',
            flexShrink: 0,
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Top holes */}
            <div style={{ position: 'absolute', top: '5px', left: '8px', width: '8px', height: '8px', background: 'var(--void)', borderRadius: '2px' }} />
            <div style={{ position: 'absolute', top: '5px', right: '8px', width: '8px', height: '8px', background: 'var(--void)', borderRadius: '2px' }} />
            {/* Bottom holes */}
            <div style={{ position: 'absolute', bottom: '5px', left: '8px', width: '8px', height: '8px', background: 'var(--void)', borderRadius: '2px' }} />
            <div style={{ position: 'absolute', bottom: '5px', right: '8px', width: '8px', height: '8px', background: 'var(--void)', borderRadius: '2px' }} />
            {/* Label */}
            <span style={{
              color: i % 3 === 0 ? 'var(--gold)' : i % 3 === 1 ? 'var(--crimson)' : 'var(--text-3)',
              fontSize: '7px', letterSpacing: '0.1em',
              fontFamily: 'DM Mono, monospace', fontWeight: 500,
              textAlign: 'center', lineHeight: 1.2,
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
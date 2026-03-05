'use client';

import { useState, FormEvent } from 'react';

interface SearchBarProps { onSearch: (id: string) => void; isLoading: boolean; }

function isValid(id: string) { return /^tt\d{7,8}$/.test(id.trim()); }

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (!v) { setError('Enter an IMDb ID to analyze'); return; }
    if (!isValid(v)) { setError('Format: tt + 7-8 digits  e.g. tt0133093'); return; }
    setError('');
    onSearch(v);
  }

  const examples = ['tt0133093', 'tt0468569', 'tt0111161', 'tt1187043'];

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <form onSubmit={submit}>
        {/* Search box */}
        <div style={{
          position: 'relative',
          background: focused ? 'rgba(16,16,40,0.95)' : 'rgba(12,12,28,0.8)',
          border: `1.5px solid ${focused ? 'rgba(232,184,75,0.4)' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: '18px',
          padding: '7px 7px 7px 22px',
          display: 'flex', alignItems: 'center', gap: '14px',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: focused
            ? '0 0 0 5px rgba(232,184,75,0.07), 0 24px 60px rgba(0,0,0,0.5)'
            : '0 8px 40px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(24px)',
        }}>
          {/* Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={focused ? 'var(--gold)' : 'var(--text-3)'} strokeWidth="1.5"
            style={{ flexShrink: 0, transition: 'stroke 0.3s' }}>
            <rect x="2" y="2" width="20" height="20" rx="2.18"/>
            <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/>
            <line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>
          </svg>

          <input
            type="text" value={value}
            onChange={e => { setValue(e.target.value); if (error) setError(''); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="tt0133093"
            disabled={isLoading}
            data-hover="true"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: '17px',
              fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em',
              caretColor: 'var(--gold)',
            }}
          />

          {/* Clear */}
          {value && !isLoading && (
            <button type="button" onClick={() => { setValue(''); setError(''); }}
              data-hover="true"
              style={{
                background: 'rgba(255,255,255,0.04)', border: 'none', borderRadius: '50%',
                width: '30px', height: '30px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'none', color: 'var(--text-3)',
                transition: 'all 0.2s', flexShrink: 0,
              }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}

          {/* Submit */}
          <button type="submit" disabled={isLoading} data-hover="true" style={{
            background: isLoading ? 'var(--elevated)' : 'linear-gradient(135deg, #e8b84b, #ffd166 50%, #e84b6a)',
            backgroundSize: '200% 200%',
            color: isLoading ? 'var(--text-3)' : '#000',
            border: 'none', borderRadius: '13px',
            padding: '13px 32px', fontSize: '14px',
            fontWeight: '700', fontFamily: 'Outfit, sans-serif',
            cursor: isLoading ? 'not-allowed' : 'none',
            transition: 'all 0.3s', whiteSpace: 'nowrap',
            letterSpacing: '0.06em',
            boxShadow: isLoading ? 'none' : '0 4px 24px rgba(232,184,75,0.35)',
            animation: !isLoading ? 'gradShift 3s ease infinite' : 'none',
          }}>
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: 'rgba(255,255,255,0.6)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Analyzing
              </span>
            ) : 'ANALYZE →'}
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '10px', paddingLeft: '4px', animation: 'fadeIn 0.2s ease' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ color: 'var(--crimson)', fontSize: '13px' }}>{error}</span>
          </div>
        )}
      </form>

      {/* Examples */}
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-3)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>Try →</span>
        {examples.map(id => (
          <button key={id} onClick={() => { setValue(id); setError(''); }}
            disabled={isLoading} data-hover="true"
            style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--text-2)', borderRadius: '8px', padding: '5px 14px',
              fontSize: '12px', fontFamily: 'DM Mono, monospace',
              cursor: 'none', transition: 'all 0.2s', letterSpacing: '0.04em',
            }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = 'var(--border-gold)'; b.style.color = 'var(--gold)'; b.style.background = 'var(--gold-dim)'; }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = 'rgba(255,255,255,0.06)'; b.style.color = 'var(--text-2)'; b.style.background = 'rgba(255,255,255,0.02)'; }}
          >
            {id}
          </button>
        ))}
      </div>
      <style>{`@keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`}</style>
    </div>
  );
}
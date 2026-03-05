'use client';

export default function LoadingSkeleton() {
  return (
    <div style={{ width: '100%', animation: 'fadeIn 0.4s ease' }}>
      {/* Status */}
      <div style={{ textAlign: 'center', marginBottom: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {/* Dual spinner */}
        <div style={{ position: 'relative', width: '52px', height: '52px' }}>
          <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(232,184,75,0.08)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '8px', border: '2px solid rgba(232,75,106,0.08)', borderTopColor: 'var(--crimson)', borderRadius: '50%', animation: 'spinR 1.3s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '16px', border: '2px solid rgba(72,202,228,0.08)', borderTopColor: 'var(--sky)', borderRadius: '50%', animation: 'spin 1.7s linear infinite' }} />
        </div>
        <div>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Fetching cinematic data</p>
          <p style={{ color: 'var(--text-3)', fontSize: '11px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>
            CONNECTING TO OMDB API...
          </p>
        </div>
      </div>

      {/* Movie skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '40px', alignItems: 'start', marginBottom: '40px' }}>
        <Bone h="330px" r="16px" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Bone h="10px" w="30%" r="4px" />
          <Bone h="48px" w="70%" r="8px" />
          <div style={{ display: 'flex', gap: '8px' }}>
            <Bone h="26px" w="60px" r="100px" />
            <Bone h="26px" w="80px" r="100px" />
            <Bone h="26px" w="90px" r="100px" />
          </div>
          <Bone h="13px" r="4px" />
          <Bone h="13px" w="85%" r="4px" />
          <Bone h="13px" w="92%" r="4px" />
          <Bone h="13px" w="65%" r="4px" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Bone h="10px" w="60px" r="4px" />
              <Bone h="14px" w="90%" r="4px" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Bone h="10px" w="60px" r="4px" />
              <Bone h="14px" w="90%" r="4px" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Bone h="72px" w="110px" r="14px" />
            <Bone h="72px" w="110px" r="14px" />
            <Bone h="72px" w="110px" r="14px" />
          </div>
        </div>
      </div>

      {/* Sentiment skeleton */}
      <div style={{ background: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)', padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 1.2s ease infinite' }} />
          <span style={{ color: 'var(--text-3)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>
            Optimus AI processing...
          </span>
        </div>
        <Bone h="8px" r="4px" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
          <Bone h="14px" r="4px" />
          <Bone h="14px" w="80%" r="4px" />
          <Bone h="14px" w="92%" r="4px" />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
          <Bone h="30px" w="110px" r="100px" />
          <Bone h="30px" w="130px" r="100px" />
          <Bone h="30px" w="100px" r="100px" />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes spinR   { to{transform:rotate(-360deg)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.2} }
      `}</style>
    </div>
  );
}

function Bone({ h, w = '100%', r = '4px' }: { h: string; w?: string; r?: string }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: r,
      background: 'linear-gradient(90deg, var(--elevated) 25%, var(--hover) 50%, var(--elevated) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.8s ease infinite',
    }} />
  );
}
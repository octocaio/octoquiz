import { useState, useEffect } from 'react';

export default function PlayerWaiting({ playerName, pin }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 100%)',
        padding: '2rem',
      }}
    >
      <div
        className="animate-in"
        style={{
          textAlign: 'center',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(108, 99, 255, 0.3)',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          backdropFilter: 'blur(20px)',
          maxWidth: '420px',
          width: '100%',
        }}
      >
        <div
          style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            animation: 'pulse 2s ease infinite',
            display: 'inline-block',
          }}
        >
          🐙
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
            fontWeight: '800',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Welcome, {playerName}!
        </h2>

        <div
          style={{
            display: 'inline-block',
            background: 'rgba(108, 99, 255, 0.15)',
            border: '1px solid rgba(108, 99, 255, 0.3)',
            borderRadius: '10px',
            padding: '0.4rem 1rem',
            margin: '0.75rem 0 1.5rem',
          }}
        >
          <span style={{ color: '#a0a0c0', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Room PIN:{' '}
          </span>
          <span style={{ color: '#6c63ff', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '0.15em' }}>
            {pin}
          </span>
        </div>

        <p style={{ color: '#a0a0c0', fontSize: '1rem' }}>
          Waiting for host to start
          <span style={{ display: 'inline-block', width: '2rem', textAlign: 'left' }}>{dots}</span>
        </p>

        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#6c63ff',
                animation: `pulse 1.4s ease ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

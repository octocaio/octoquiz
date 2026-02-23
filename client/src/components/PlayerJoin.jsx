import { useState } from 'react';

export default function PlayerJoin({ onJoin, initialPin }) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState(initialPin || '');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedPin = pin.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (trimmedPin.length !== 6 || !/^\d{6}$/.test(trimmedPin)) {
      setError('Please enter a valid 6-digit game PIN.');
      return;
    }

    onJoin(trimmedPin, trimmedName);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 100%)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }} className="animate-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🐙</div>
          <h1
            style={{
              fontSize: '2.2rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            OctoQuiz
          </h1>
          <p style={{ color: '#a0a0c0', marginTop: '0.4rem' }}>Join a game</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #2e2e4e',
            borderRadius: '20px',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ marginBottom: '1.2rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                color: '#a0a0c0',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.4rem',
              }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                border: '1.5px solid #2e2e4e',
                background: '#1a1a2e',
                color: '#fff',
                fontSize: '1rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                color: '#a0a0c0',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.4rem',
              }}
            >
              Game PIN
            </label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit PIN"
              inputMode="numeric"
              pattern="\d{6}"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                border: '1.5px solid #2e2e4e',
                background: '#1a1a2e',
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: '800',
                letterSpacing: '0.2em',
                textAlign: 'center',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(231, 76, 60, 0.15)',
                border: '1px solid rgba(231, 76, 60, 0.4)',
                borderRadius: '10px',
                padding: '0.7rem 1rem',
                color: '#e74c3c',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff6584, #e0526e)',
              color: '#fff',
              fontWeight: '800',
              fontSize: '1.1rem',
              boxShadow: '0 8px 32px rgba(255, 101, 132, 0.4)',
            }}
          >
            🎯 Join Game
          </button>
        </form>
      </div>
    </div>
  );
}

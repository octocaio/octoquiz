import { useEffect, useState } from 'react';

const CONFETTI_COLORS = ['#6c63ff', '#ff6584', '#2ecc71', '#f39c12', '#e74c3c', '#3498db', '#fff'];

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: `${Math.random() * 3}s`,
    duration: `${2 + Math.random() * 2}s`,
    size: `${6 + Math.random() * 8}px`,
  }));

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${p.duration} ${p.delay} ease-in forwards`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
}

export default function Leaderboard({ leaderboard, isHost, onPlayAgain, onLeave }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
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
        padding: '2rem 1rem',
        position: 'relative',
      }}
    >
      {showConfetti && <Confetti />}

      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          position: 'relative',
          zIndex: 1,
        }}
        className="animate-in"
      >
        <h1
          style={{
            textAlign: 'center',
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: '900',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #ffd700, #ff6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          🎉 Game Over!
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: '#a0a0c0',
            marginBottom: '2rem',
            fontSize: '1rem',
          }}
        >
          Final Standings
        </p>

        {/* Podium area for top 3 */}
        {leaderboard.length >= 3 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: '1rem',
              marginBottom: '2rem',
              height: '120px',
            }}
          >
            {/* 2nd place */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🥈</div>
              <div
                style={{
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  marginBottom: '0.3rem',
                  color: '#c0c0c0',
                }}
              >
                {leaderboard[1].name}
              </div>
              <div
                style={{
                  background: 'rgba(192,192,192,0.2)',
                  border: '2px solid #c0c0c0',
                  borderRadius: '10px 10px 0 0',
                  height: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: '#c0c0c0',
                }}
              >
                {leaderboard[1].score.toLocaleString()}
              </div>
            </div>
            {/* 1st place */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>🥇</div>
              <div
                style={{
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  marginBottom: '0.3rem',
                  color: '#ffd700',
                }}
              >
                {leaderboard[0].name}
              </div>
              <div
                style={{
                  background: 'rgba(255,215,0,0.15)',
                  border: '2px solid #ffd700',
                  borderRadius: '10px 10px 0 0',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontSize: '1.1rem',
                  color: '#ffd700',
                }}
              >
                {leaderboard[0].score.toLocaleString()}
              </div>
            </div>
            {/* 3rd place */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>🥉</div>
              <div
                style={{
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  marginBottom: '0.3rem',
                  color: '#cd7f32',
                }}
              >
                {leaderboard[2].name}
              </div>
              <div
                style={{
                  background: 'rgba(205,127,50,0.15)',
                  border: '2px solid #cd7f32',
                  borderRadius: '10px 10px 0 0',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: '#cd7f32',
                }}
              >
                {leaderboard[2].score.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Full list */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid #2e2e4e',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {leaderboard.map((entry, idx) => (
            <div
              key={entry.id || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0',
                borderBottom:
                  idx < leaderboard.length - 1 ? '1px solid #1e1e3e' : 'none',
              }}
            >
              <span
                style={{
                  width: '36px',
                  fontWeight: '800',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  color:
                    idx === 0
                      ? '#ffd700'
                      : idx === 1
                      ? '#c0c0c0'
                      : idx === 2
                      ? '#cd7f32'
                      : '#a0a0c0',
                }}
              >
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
              </span>
              <span style={{ flex: 1, fontWeight: '600', fontSize: '1rem' }}>{entry.name}</span>
              <span
                style={{
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  color: idx < 3 ? '#6c63ff' : '#a0a0c0',
                }}
              >
                {entry.score.toLocaleString()}
              </span>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <p style={{ color: '#555', textAlign: 'center', fontStyle: 'italic' }}>
              No players
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isHost && (
            <button
              onClick={onPlayAgain}
              style={{
                flex: 1,
                padding: '0.9rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6c63ff, #5a52e0)',
                color: '#fff',
                fontWeight: '800',
                fontSize: '1rem',
                boxShadow: '0 8px 32px rgba(108, 99, 255, 0.4)',
              }}
            >
              🔄 Play Again
            </button>
          )}
          <button
            onClick={onLeave}
            style={{
              flex: 1,
              padding: '0.9rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.08)',
              color: '#a0a0c0',
              fontWeight: '700',
              fontSize: '1rem',
              border: '1px solid #2e2e4e',
            }}
          >
            🚪 Leave
          </button>
        </div>
      </div>
    </div>
  );
}

import QRCode from 'react-qr-code';

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  '#6c63ff', '#ff6584', '#2ecc71', '#f39c12',
  '#e74c3c', '#3498db', '#9b59b6', '#1abc9c',
];

export default function HostLobby({ pin, players, onStart, onBack }) {
  const joinUrl = `http://localhost:5173?pin=${pin}`;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 100%)',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '700px' }}>
        {/* Header */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}
        >
          <button
            onClick={onBack}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.08)',
              color: '#a0a0c0',
              fontWeight: '600',
              fontSize: '0.9rem',
            }}
          >
            ← Back
          </button>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🐙 Game Lobby
          </h1>
        </div>

        {/* PIN Display */}
        <div
          style={{
            background: 'rgba(108, 99, 255, 0.1)',
            border: '2px solid rgba(108, 99, 255, 0.4)',
            borderRadius: '20px',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}
          className="animate-in"
        >
          <p style={{ color: '#a0a0c0', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Game PIN
          </p>
          <div
            style={{
              fontSize: 'clamp(3rem, 12vw, 5rem)',
              fontWeight: '900',
              letterSpacing: '0.15em',
              color: '#6c63ff',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
              marginBottom: '1rem',
            }}
          >
            {pin}
          </div>
          <p style={{ color: '#a0a0c0', fontSize: '0.85rem' }}>
            Players go to <strong style={{ color: '#fff' }}>localhost:5173</strong> and enter this PIN
          </p>
        </div>

        {/* QR Code + Players side by side */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* QR Code */}
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QRCode value={joinUrl} size={140} />
          </div>

          {/* Players */}
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid #2e2e4e',
              borderRadius: '16px',
              padding: '1rem',
              overflowY: 'auto',
              maxHeight: '200px',
            }}
          >
            <p style={{ color: '#a0a0c0', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              Players ({players.length})
            </p>
            {players.length === 0 ? (
              <p style={{ color: '#555', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Waiting for players to join...
              </p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {players.map((p, i) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: '20px',
                      padding: '0.3rem 0.7rem',
                    }}
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: avatarColors[i % avatarColors.length],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(p.name)}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          disabled={players.length === 0}
          style={{
            width: '100%',
            padding: '1.1rem',
            borderRadius: '16px',
            background: players.length === 0
              ? 'rgba(108, 99, 255, 0.2)'
              : 'linear-gradient(135deg, #6c63ff, #5a52e0)',
            color: players.length === 0 ? '#555' : '#fff',
            fontWeight: '800',
            fontSize: '1.2rem',
            boxShadow: players.length > 0 ? '0 8px 32px rgba(108, 99, 255, 0.4)' : 'none',
            cursor: players.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {players.length === 0
            ? 'Waiting for players...'
            : `🚀 Start Game (${players.length} player${players.length !== 1 ? 's' : ''})`}
        </button>
      </div>
    </div>
  );
}

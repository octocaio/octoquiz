export default function Home({ onHost, onJoin }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 50%, #0f0f1a 100%)',
        padding: '2rem',
      }}
    >
      <div className="animate-in" style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <div style={{ fontSize: '5rem', marginBottom: '0.5rem' }}>🐙</div>
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            letterSpacing: '-1px',
          }}
        >
          OctoQuiz
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            color: '#a0a0c0',
            marginBottom: '3rem',
            letterSpacing: '0.05em',
          }}
        >
          Corporate Training Made Fun
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={onHost}
            style={{
              padding: '1.1rem 2rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6c63ff, #5a52e0)',
              color: '#fff',
              boxShadow: '0 8px 32px rgba(108, 99, 255, 0.4)',
              letterSpacing: '0.03em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(108, 99, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(108, 99, 255, 0.4)';
            }}
          >
            🎮 Host a Quiz
          </button>

          <button
            onClick={onJoin}
            style={{
              padding: '1.1rem 2rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ff6584, #e0526e)',
              color: '#fff',
              boxShadow: '0 8px 32px rgba(255, 101, 132, 0.4)',
              letterSpacing: '0.03em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 101, 132, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 101, 132, 0.4)';
            }}
          >
            🎯 Join a Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

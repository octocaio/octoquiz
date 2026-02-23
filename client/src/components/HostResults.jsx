const OPTION_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function HostResults({
  correctAnswer,
  question,
  leaderboard,
  onNext,
  onEndGame,
  isLastQuestion,
}) {
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
        <h2
          style={{
            textAlign: 'center',
            fontSize: '1.8rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          className="animate-in"
        >
          📊 Question Results
        </h2>

        {/* Question text */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid #2e2e4e',
            borderRadius: '16px',
            padding: '1.2rem 1.5rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontWeight: '600', color: '#a0a0c0', fontSize: '0.85rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            The Question
          </p>
          <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>{question.text}</p>
        </div>

        {/* Answers with correct highlighted */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          {question.options.map((opt, idx) => {
            const isCorrect = idx === correctAnswer;
            return (
              <div
                key={idx}
                style={{
                  background: isCorrect ? `${OPTION_COLORS[idx]}33` : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${isCorrect ? OPTION_COLORS[idx] : '#2e2e4e'}`,
                  borderRadius: '12px',
                  padding: '0.9rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  opacity: isCorrect ? 1 : 0.5,
                }}
              >
                <span
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isCorrect ? OPTION_COLORS[idx] : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    flexShrink: 0,
                    color: '#fff',
                  }}
                >
                  {isCorrect ? '✓' : OPTION_LABELS[idx]}
                </span>
                <span style={{ fontWeight: isCorrect ? '700' : '500', fontSize: '0.95rem' }}>
                  {opt}
                </span>
              </div>
            );
          })}
        </div>

        {/* Leaderboard */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid #2e2e4e',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <p style={{ fontWeight: '700', color: '#a0a0c0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            Leaderboard
          </p>
          {leaderboard.slice(0, 5).map((entry, idx) => (
            <div
              key={entry.id || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0',
                borderBottom: idx < Math.min(leaderboard.length, 5) - 1 ? '1px solid #1e1e3e' : 'none',
              }}
            >
              <span
                style={{
                  width: '28px',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  color: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#a0a0c0',
                  textAlign: 'center',
                }}
              >
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
              </span>
              <span style={{ flex: 1, fontWeight: '600' }}>{entry.name}</span>
              <span
                style={{
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  color: '#6c63ff',
                }}
              >
                {entry.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        {isLastQuestion ? (
          <button
            onClick={onEndGame}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ff6584, #e0526e)',
              color: '#fff',
              fontWeight: '800',
              fontSize: '1.1rem',
              boxShadow: '0 8px 32px rgba(255, 101, 132, 0.4)',
            }}
          >
            🏆 Show Final Results
          </button>
        ) : (
          <button
            onClick={onNext}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6c63ff, #5a52e0)',
              color: '#fff',
              fontWeight: '800',
              fontSize: '1.1rem',
              boxShadow: '0 8px 32px rgba(108, 99, 255, 0.4)',
            }}
          >
            ➡️ Next Question
          </button>
        )}
      </div>
    </div>
  );
}

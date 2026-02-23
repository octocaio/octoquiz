const OPTION_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function PlayerResult({ answerResult, correctAnswer, question }) {
  const { correct, points, totalScore } = answerResult;
  const questionEnded = correctAnswer !== null && correctAnswer !== undefined;

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
      <div
        style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}
        className="animate-in"
      >
        {/* Result emoji */}
        <div style={{ fontSize: '5rem', marginBottom: '0.75rem' }}>
          {correct ? '✅' : '❌'}
        </div>

        <h2
          style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            marginBottom: '0.5rem',
            color: correct ? '#2ecc71' : '#e74c3c',
          }}
        >
          {correct ? 'Correct!' : 'Wrong!'}
        </h2>

        {/* Points */}
        <div
          style={{
            background: correct
              ? 'rgba(46, 204, 113, 0.1)'
              : 'rgba(231, 76, 60, 0.1)',
            border: `1px solid ${correct ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <p style={{ color: '#a0a0c0', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Points earned
          </p>
          <p
            style={{
              fontSize: '3.5rem',
              fontWeight: '900',
              color: correct ? '#2ecc71' : '#a0a0c0',
              lineHeight: 1,
              marginBottom: '0.5rem',
            }}
          >
            +{points.toLocaleString()}
          </p>
          <p style={{ color: '#a0a0c0', fontSize: '0.9rem' }}>
            Total score:{' '}
            <strong style={{ color: '#6c63ff', fontSize: '1.1rem' }}>
              {totalScore.toLocaleString()}
            </strong>
          </p>
        </div>

        {/* Correct answer (shown after host ends question) */}
        {questionEnded && question && (
          <div
            style={{
              background: `${OPTION_COLORS[correctAnswer]}22`,
              border: `1.5px solid ${OPTION_COLORS[correctAnswer]}`,
              borderRadius: '14px',
              padding: '1rem 1.2rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textAlign: 'left',
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: OPTION_COLORS[correctAnswer],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                flexShrink: 0,
                color: '#fff',
              }}
            >
              ✓
            </span>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#a0a0c0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                Correct Answer ({OPTION_LABELS[correctAnswer]})
              </p>
              <p style={{ fontWeight: '700', color: '#fff' }}>
                {question.options[correctAnswer]}
              </p>
            </div>
          </div>
        )}

        {/* Waiting message */}
        {!questionEnded ? (
          <p style={{ color: '#a0a0c0', fontSize: '0.95rem' }}>
            ⏳ Waiting for next question...
          </p>
        ) : (
          <p style={{ color: '#a0a0c0', fontSize: '0.95rem' }}>
            ⏳ Get ready for the next question...
          </p>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';

const OPTION_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function HostQuestion({
  question,
  questionIndex,
  totalQuestions,
  timeLimit,
  answerCount,
  onEndQuestion,
}) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const endedRef = useRef(false);

  useEffect(() => {
    endedRef.current = false;
    setTimeLeft(timeLimit);
  }, [questionIndex, timeLimit]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!endedRef.current) {
        endedRef.current = true;
        onEndQuestion();
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onEndQuestion]);

  function handleEndQuestion() {
    if (!endedRef.current) {
      endedRef.current = true;
      onEndQuestion();
    }
  }

  const progress = (timeLeft / timeLimit) * 100;
  const progressColor =
    timeLeft > timeLimit * 0.5 ? '#2ecc71' : timeLeft > timeLimit * 0.25 ? '#f39c12' : '#e74c3c';

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
      <div style={{ width: '100%', maxWidth: '800px' }}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ color: '#a0a0c0', fontWeight: '700', fontSize: '0.9rem' }}>
            Question {questionIndex + 1} / {totalQuestions}
          </span>
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50px',
              padding: '0.4rem 1rem',
              fontSize: '1.5rem',
              fontWeight: '900',
              color: progressColor,
              minWidth: '60px',
              textAlign: 'center',
            }}
          >
            {timeLeft}
          </div>
          <span style={{ color: '#a0a0c0', fontWeight: '700', fontSize: '0.9rem' }}>
            {answerCount.count} / {answerCount.total} answered
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            marginBottom: '2rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: progressColor,
              borderRadius: '4px',
              transition: 'width 1s linear, background 0.5s ease',
            }}
          />
        </div>

        {/* Question text */}
        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid #2e2e4e',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
          className="animate-in"
        >
          <p
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              fontWeight: '700',
              lineHeight: 1.4,
              color: '#fff',
            }}
          >
            {question.text}
          </p>
        </div>

        {/* Answer options */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {question.options.map((opt, idx) => (
            <div
              key={idx}
              style={{
                background: `${OPTION_COLORS[idx]}22`,
                border: `2px solid ${OPTION_COLORS[idx]}`,
                borderRadius: '14px',
                padding: '1.2rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: OPTION_COLORS[idx],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1rem',
                  flexShrink: 0,
                  color: '#fff',
                }}
              >
                {OPTION_LABELS[idx]}
              </span>
              <span style={{ fontWeight: '600', fontSize: '1rem' }}>{opt}</span>
            </div>
          ))}
        </div>

        {/* End Question button */}
        <button
          onClick={handleEndQuestion}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #ff6584, #e0526e)',
            color: '#fff',
            fontWeight: '800',
            fontSize: '1.1rem',
            boxShadow: '0 8px 32px rgba(255, 101, 132, 0.3)',
          }}
        >
          ⏭ End Question
        </button>
      </div>
    </div>
  );
}

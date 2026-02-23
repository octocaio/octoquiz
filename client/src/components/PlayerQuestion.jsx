import { useState, useEffect, useRef } from 'react';

const OPTION_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function PlayerQuestion({ question, timeLimit, onAnswer }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selected, setSelected] = useState(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    submittedRef.current = false;
    setSelected(null);
    setTimeLeft(timeLimit);
  }, [question, timeLimit]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!submittedRef.current) {
        submittedRef.current = true;
        onAnswer(-1);
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onAnswer]);

  function handleSelect(idx) {
    if (submittedRef.current || selected !== null) return;
    submittedRef.current = true;
    setSelected(idx);
    onAnswer(idx);
  }

  const progress = (timeLeft / timeLimit) * 100;
  const progressColor =
    timeLeft > timeLimit * 0.5 ? '#2ecc71' : timeLeft > timeLimit * 0.25 ? '#f39c12' : '#e74c3c';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 100%)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {/* Timer */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50px',
              padding: '0.5rem 1.5rem',
              fontSize: '2rem',
              fontWeight: '900',
              color: progressColor,
            }}
          >
            {timeLeft}
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            marginBottom: '1.5rem',
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
            borderRadius: '18px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
          className="animate-in"
        >
          <p style={{ fontSize: 'clamp(1rem, 4vw, 1.4rem)', fontWeight: '700', lineHeight: 1.4 }}>
            {question.text}
          </p>
        </div>

        {/* Answer buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map((opt, idx) => {
            const isSelected = selected === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 1.2rem',
                  borderRadius: '14px',
                  background: isSelected
                    ? OPTION_COLORS[idx]
                    : `${OPTION_COLORS[idx]}22`,
                  border: `2px solid ${OPTION_COLORS[idx]}`,
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '1rem',
                  textAlign: 'left',
                  cursor: selected !== null ? 'default' : 'pointer',
                  opacity: selected !== null && !isSelected ? 0.4 : 1,
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isSelected ? 'rgba(255,255,255,0.3)' : OPTION_COLORS[idx],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    flexShrink: 0,
                  }}
                >
                  {isSelected ? '✓' : OPTION_LABELS[idx]}
                </span>
                <span>{opt}</span>
                {isSelected && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.85rem', opacity: 0.9 }}>
                    Answer submitted!
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

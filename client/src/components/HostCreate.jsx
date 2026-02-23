import { useState } from 'react';

const emptyQuestion = () => ({
  text: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  timeLimit: 30,
});

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.9rem',
  borderRadius: '8px',
  border: '1.5px solid #2e2e4e',
  background: '#1a1a2e',
  color: '#fff',
  fontSize: '0.95rem',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  color: '#a0a0c0',
  marginBottom: '0.3rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export default function HostCreate({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [error, setError] = useState('');

  function updateQuestion(idx, field, value) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  }

  function updateOption(qIdx, optIdx, value) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const options = [...q.options];
        options[optIdx] = value;
        return { ...q, options };
      })
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(idx) {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a quiz title.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setError(`Question ${i + 1} is missing its question text.`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          setError(`Question ${i + 1}, Option ${j + 1} is empty.`);
          return;
        }
      }
    }

    onSubmit({ title: title.trim(), questions });
  }

  const optionLabels = ['A', 'B', 'C', 'D'];
  const optionColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];

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
      <div style={{ width: '100%', maxWidth: '720px' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          🐙 Create Your Quiz
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Quiz Title */}
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid #2e2e4e',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <label style={labelStyle}>Quiz Title</label>
            <input
              style={inputStyle}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Company Culture Trivia"
            />
          </div>

          {/* Questions */}
          {questions.map((q, qIdx) => (
            <div
              key={qIdx}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid #2e2e4e',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.2rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <span style={{ fontWeight: '700', color: '#6c63ff', fontSize: '1rem' }}>
                  Question {qIdx + 1}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ ...labelStyle, margin: 0 }}>Time Limit:</label>
                  <select
                    value={q.timeLimit}
                    onChange={(e) => updateQuestion(qIdx, 'timeLimit', Number(e.target.value))}
                    style={{ ...inputStyle, width: 'auto', padding: '0.4rem 0.7rem' }}
                  >
                    <option value={15}>15s</option>
                    <option value={30}>30s</option>
                    <option value={60}>60s</option>
                  </select>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        background: 'rgba(231, 76, 60, 0.2)',
                        color: '#e74c3c',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        border: '1px solid rgba(231, 76, 60, 0.3)',
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <label style={labelStyle}>Question Text</label>
              <input
                style={{ ...inputStyle, marginBottom: '1rem' }}
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                placeholder="Enter your question..."
              />

              <label style={labelStyle}>Answer Options (select the correct one)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {q.options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: q.correctAnswer === optIdx
                        ? `${optionColors[optIdx]}22`
                        : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${q.correctAnswer === optIdx ? optionColors[optIdx] : '#2e2e4e'}`,
                      borderRadius: '10px',
                      padding: '0.5rem 0.75rem',
                    }}
                  >
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={q.correctAnswer === optIdx}
                      onChange={() => updateQuestion(qIdx, 'correctAnswer', optIdx)}
                      style={{ accentColor: optionColors[optIdx], width: '16px', height: '16px' }}
                    />
                    <span
                      style={{
                        fontWeight: '700',
                        color: optionColors[optIdx],
                        minWidth: '18px',
                        fontSize: '0.9rem',
                      }}
                    >
                      {optionLabels[optIdx]}
                    </span>
                    <input
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                      placeholder={`Option ${optionLabels[optIdx]}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '12px',
              background: 'rgba(108, 99, 255, 0.15)',
              color: '#6c63ff',
              fontWeight: '700',
              fontSize: '1rem',
              border: '1.5px dashed #6c63ff',
              marginBottom: '1rem',
            }}
          >
            + Add Question
          </button>

          {error && (
            <div
              style={{
                background: 'rgba(231, 76, 60, 0.15)',
                border: '1px solid rgba(231, 76, 60, 0.4)',
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                color: '#e74c3c',
                marginBottom: '1rem',
                fontSize: '0.95rem',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6c63ff, #5a52e0)',
              color: '#fff',
              fontWeight: '800',
              fontSize: '1.1rem',
              boxShadow: '0 8px 32px rgba(108, 99, 255, 0.4)',
              marginBottom: '2rem',
            }}
          >
            🚀 Create Room
          </button>
        </form>
      </div>
    </div>
  );
}

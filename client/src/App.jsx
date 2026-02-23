import { useState, useEffect, useRef } from 'react';
import socket from './socket';

import Home from './components/Home';
import HostCreate from './components/HostCreate';
import HostLobby from './components/HostLobby';
import HostQuestion from './components/HostQuestion';
import HostResults from './components/HostResults';
import PlayerJoin from './components/PlayerJoin';
import PlayerWaiting from './components/PlayerWaiting';
import PlayerQuestion from './components/PlayerQuestion';
import PlayerResult from './components/PlayerResult';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [role, setRole] = useState(null);
  const [pin, setPin] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLimit, setTimeLimit] = useState(30);
  const [answerResult, setAnswerResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [answerCount, setAnswerCount] = useState({ count: 0, total: 0 });

  // Read initial PIN from URL query params
  const initialPin = new URLSearchParams(window.location.search).get('pin') || '';

  // Keep refs to pin, players, and role so socket handlers always read the latest values
  const pinRef = useRef(pin);
  const playersRef = useRef(players);
  const roleRef = useRef(role);
  useEffect(() => { pinRef.current = pin; });
  useEffect(() => { playersRef.current = players; });
  useEffect(() => { roleRef.current = role; });

  useEffect(() => {
    socket.on('room_created', ({ pin: newPin }) => {
      setPin(newPin);
      setScreen('host-lobby');
    });

    socket.on('player_joined', ({ players: updatedPlayers }) => {
      setPlayers(updatedPlayers);
    });

    socket.on('joined_room', ({ pin: joinedPin, name, players: joinedPlayers }) => {
      setPin(joinedPin);
      setPlayerName(name);
      setPlayers(joinedPlayers);
      setScreen('player-waiting');
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });

    socket.on('game_started', () => {
      if (roleRef.current === 'host') {
        // Host immediately requests the first question
        socket.emit('next_question', { pin: pinRef.current });
      } else {
        setScreen('player-waiting');
      }
    });

    socket.on('question_started', ({ question, questionIndex: qIdx, timeLimit: tl, totalQuestions: total }) => {
      setCurrentQuestion(question);
      setQuestionIndex(qIdx);
      setTotalQuestions(total);
      setTimeLimit(tl);
      setCorrectAnswer(null);
      setAnswerCount({ count: 0, total: playersRef.current.length });

      if (roleRef.current === 'host') {
        setScreen('host-question');
      } else {
        setScreen('player-question');
      }
    });

    socket.on('answer_result', ({ correct, points, totalScore }) => {
      setAnswerResult({ correct, points, totalScore });
      setScreen('player-result');
    });

    socket.on('answer_count', ({ count, total }) => {
      setAnswerCount({ count, total });
    });

    socket.on('question_ended', ({ correctAnswer: ca, leaderboard: lb }) => {
      setCorrectAnswer(ca);
      setLeaderboard(lb);
      if (roleRef.current === 'host') {
        setScreen('host-results');
      }
      // player stays on player-result screen; correctAnswer state update reveals the answer
    });

    socket.on('game_ended', ({ leaderboard: lb }) => {
      setLeaderboard(lb);
      setScreen('leaderboard');
    });

    socket.on('host_left', () => {
      alert('The host left the game.');
      setScreen('home');
      resetState();
    });

    socket.on('player_left', ({ players: updatedPlayers }) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      socket.off('room_created');
      socket.off('player_joined');
      socket.off('joined_room');
      socket.off('error');
      socket.off('game_started');
      socket.off('question_started');
      socket.off('answer_result');
      socket.off('answer_count');
      socket.off('question_ended');
      socket.off('game_ended');
      socket.off('host_left');
      socket.off('player_left');
    };
  // Listeners are registered once on mount; refs keep values fresh without re-subscribing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetState() {
    setPin('');
    setPlayerName('');
    setPlayers([]);
    setQuiz(null);
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setTotalQuestions(0);
    setTimeLimit(30);
    setAnswerResult(null);
    setLeaderboard([]);
    setCorrectAnswer(null);
    setAnswerCount({ count: 0, total: 0 });
    setRole(null);
  }

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleHostQuiz(quizData) {
    setQuiz(quizData);
    setRole('host');
    socket.emit('create_room', quizData);
  }

  function handleJoin(joinPin, name) {
    setRole('player');
    socket.emit('join_room', { pin: joinPin, name });
  }

  function handleStartGame() {
    socket.emit('start_game', { pin });
  }

  function handleEndQuestion() {
    socket.emit('end_question', { pin });
  }

  function handleNextQuestion() {
    socket.emit('next_question', { pin });
  }

  function handleEndGame() {
    socket.emit('end_game', { pin });
  }

  function handlePlayAgain() {
    resetState();
    setRole('host');
    setScreen('host-create');
  }

  function handleLeave() {
    resetState();
    setScreen('home');
  }

  const isLastQuestion = questionIndex >= totalQuestions - 1;

  // ── Screen routing ────────────────────────────────────────────────────────

  switch (screen) {
    case 'home':
      return (
        <Home
          onHost={() => { setRole('host'); setScreen('host-create'); }}
          onJoin={() => { setRole('player'); setScreen('player-join'); }}
        />
      );

    case 'host-create':
      return <HostCreate onSubmit={handleHostQuiz} />;

    case 'host-lobby':
      return (
        <HostLobby
          pin={pin}
          players={players}
          onStart={handleStartGame}
          onBack={() => { resetState(); setScreen('home'); }}
        />
      );

    case 'host-question':
      return currentQuestion ? (
        <HostQuestion
          question={currentQuestion}
          questionIndex={questionIndex}
          totalQuestions={totalQuestions}
          timeLimit={timeLimit}
          answerCount={answerCount}
          onEndQuestion={handleEndQuestion}
        />
      ) : null;

    case 'host-results':
      return currentQuestion ? (
        <HostResults
          correctAnswer={correctAnswer}
          question={currentQuestion}
          leaderboard={leaderboard}
          onNext={handleNextQuestion}
          onEndGame={handleEndGame}
          isLastQuestion={isLastQuestion}
        />
      ) : null;

    case 'player-join':
      return <PlayerJoin onJoin={handleJoin} initialPin={initialPin} />;

    case 'player-waiting':
      return <PlayerWaiting playerName={playerName} pin={pin} />;

    case 'player-question':
      return currentQuestion ? (
        <PlayerQuestion
          question={currentQuestion}
          timeLimit={timeLimit}
          onAnswer={(answerIndex) => socket.emit('submit_answer', { pin, answerIndex })}
        />
      ) : null;

    case 'player-result':
      return answerResult ? (
        <PlayerResult
          answerResult={answerResult}
          correctAnswer={correctAnswer}
          question={currentQuestion}
        />
      ) : null;

    case 'leaderboard':
      return (
        <Leaderboard
          leaderboard={leaderboard}
          isHost={role === 'host'}
          onPlayAgain={handlePlayAgain}
          onLeave={handleLeave}
        />
      );

    default:
      return <Home onHost={() => { setRole('host'); setScreen('host-create'); }} onJoin={() => setScreen('player-join')} />;
  }
}

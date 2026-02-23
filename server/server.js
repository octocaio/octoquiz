const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// In-memory store: PIN -> room object
const rooms = new Map();

function generatePin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function calculateScore(timeUsed, timeLimit) {
  const bonus = Math.round(1000 * (1 - (timeUsed / timeLimit) * 0.5));
  return Math.max(500, bonus);
}

function getLeaderboard(room) {
  return room.players
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((p) => ({ id: p.id, name: p.name, score: p.score }));
}

function stripCorrectAnswer(question) {
  const { correctAnswer, ...rest } = question;
  return rest;
}

io.on('connection', (socket) => {
  // ── Host creates a room ──────────────────────────────────────────────────
  socket.on('create_room', (quiz) => {
    let pin = generatePin();
    while (rooms.has(pin)) {
      pin = generatePin();
    }

    const room = {
      pin,
      hostSocketId: socket.id,
      quiz,
      players: [],
      state: 'lobby',
      currentQuestion: -1,
      answers: new Map(),
      started: false,
      ended: false,
      questionStartTime: null,
    };

    rooms.set(pin, room);
    socket.join(pin);
    socket.emit('room_created', { pin });
  });

  // ── Player joins a room ──────────────────────────────────────────────────
  socket.on('join_room', ({ pin, name }) => {
    const room = rooms.get(pin);

    if (!room) {
      socket.emit('error', { message: 'Room not found. Check the PIN and try again.' });
      return;
    }
    if (room.started) {
      socket.emit('error', { message: 'Game has already started.' });
      return;
    }
    if (room.players.find((p) => p.name.toLowerCase() === name.toLowerCase())) {
      socket.emit('error', { message: 'That name is already taken in this room.' });
      return;
    }

    const player = { id: socket.id, name, score: 0, answers: [] };
    room.players.push(player);
    socket.join(pin);

    const playerList = room.players.map((p) => ({ id: p.id, name: p.name, score: p.score }));
    socket.emit('joined_room', { pin, name, players: playerList });
    io.to(pin).emit('player_joined', { players: playerList });
  });

  // ── Host starts the game ─────────────────────────────────────────────────
  socket.on('start_game', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    room.started = true;
    room.state = 'playing';
    io.to(pin).emit('game_started');
  });

  // ── Host advances to next question ───────────────────────────────────────
  socket.on('next_question', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    room.currentQuestion += 1;
    room.answers = new Map();
    room.questionStartTime = Date.now();

    const question = room.quiz.questions[room.currentQuestion];
    const payload = {
      question: stripCorrectAnswer(question),
      questionIndex: room.currentQuestion,
      timeLimit: question.timeLimit,
      totalQuestions: room.quiz.questions.length,
    };

    io.to(pin).emit('question_started', payload);
  });

  // ── Player submits an answer ─────────────────────────────────────────────
  socket.on('submit_answer', ({ pin, answerIndex }) => {
    const room = rooms.get(pin);
    if (!room) return;

    // Ignore duplicate submissions
    if (room.answers.has(socket.id)) return;

    const question = room.quiz.questions[room.currentQuestion];
    const timeUsed = (Date.now() - room.questionStartTime) / 1000;
    const correct = answerIndex === question.correctAnswer;
    const points = correct ? calculateScore(timeUsed, question.timeLimit) : 0;

    room.answers.set(socket.id, { answerIndex, correct, points });

    // Update player score
    const player = room.players.find((p) => p.id === socket.id);
    if (player) {
      player.score += points;
      player.answers.push({ questionIndex: room.currentQuestion, answerIndex, correct, points });
    }

    socket.emit('answer_result', { correct, points, totalScore: player ? player.score : 0 });

    // Notify host of answer count
    const hostSocket = io.sockets.sockets.get(room.hostSocketId);
    if (hostSocket) {
      hostSocket.emit('answer_count', {
        count: room.answers.size,
        total: room.players.length,
      });
    }

    // Auto-end if all players have answered
    if (room.players.length > 0 && room.answers.size === room.players.length) {
      endQuestion(pin, room);
    }
  });

  // ── Host ends the current question ──────────────────────────────────────
  socket.on('end_question', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;
    endQuestion(pin, room);
  });

  // ── Host ends the game ───────────────────────────────────────────────────
  socket.on('end_game', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    room.ended = true;
    room.state = 'ended';
    io.to(pin).emit('game_ended', { leaderboard: getLeaderboard(room) });
    rooms.delete(pin);
  });

  // ── Disconnect ───────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    for (const [pin, room] of rooms.entries()) {
      if (room.hostSocketId === socket.id) {
        // Host left
        io.to(pin).emit('host_left');
        rooms.delete(pin);
        break;
      }

      const playerIndex = room.players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        const playerList = room.players.map((p) => ({ id: p.id, name: p.name, score: p.score }));
        const hostSocket = io.sockets.sockets.get(room.hostSocketId);
        if (hostSocket) {
          hostSocket.emit('player_left', { players: playerList });
        }
        break;
      }
    }
  });
});

// ── Helper: emit question_ended to everyone in the room ─────────────────────
function endQuestion(pin, room) {
  const question = room.quiz.questions[room.currentQuestion];
  io.to(pin).emit('question_ended', {
    correctAnswer: question.correctAnswer,
    leaderboard: getLeaderboard(room),
  });
}

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`OctoQuiz server running on port ${PORT}`);
});

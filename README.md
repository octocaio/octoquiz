# 🐙 OctoQuiz

Uma aplicação de quiz em tempo real estilo Kahoot para treinamentos corporativos.

![OctoQuiz Home](https://github.com/user-attachments/assets/3bc94b93-9152-4edf-834b-e02baae2b728)

## ✨ Funcionalidades

- **Host**: cria uma sala com PIN de 6 dígitos, gera QR code para participantes
- **Participantes**: entram pelo PIN ou QR code, respondem perguntas de múltipla escolha
- **Pontuação em tempo real**: 500–1.000 pontos por resposta correta, proporcional à velocidade
- **Ranking ao vivo** após cada pergunta
- **Leaderboard final** com troféus 🥇🥈🥉
- **UI dark mode** moderna, responsiva e com animações
- **Barra de progresso** de tempo por pergunta
- **QR code** para entrada rápida na sala

## 🛠️ Stack

| Camada      | Tecnologia                  |
|-------------|-----------------------------|
| Frontend    | React 18 + Vite             |
| Backend     | Node.js + Express           |
| Tempo real  | Socket.io                   |
| Estado      | Em memória (sem banco)      |

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/octocaio/octoquiz.git
cd octoquiz

# Instale as dependências de todos os projetos
npm install
npm run install:all
```

### Executar

```bash
npm run dev
```

Isso inicia:
- **Backend** em `http://localhost:3001`
- **Frontend** em `http://localhost:5173`

### Fluxo de uso

1. Abra `http://localhost:5173` no navegador do **apresentador**
2. Clique em **Host a Quiz** e crie as perguntas
3. Clique em **Create Room** — você verá o PIN e QR code
4. **Participantes** escaneiam o QR code ou acessam `http://localhost:5173?pin=XXXXXX`
5. O apresentador clica em **Start Game** quando todos entrarem
6. Após cada pergunta, o apresentador avança para a próxima
7. Ao final, o leaderboard é exibido para todos

## 📁 Estrutura de pastas

```
octoquiz/
├── package.json          # Script npm run dev (raiz)
├── server/
│   ├── package.json
│   └── server.js         # Express + Socket.io (porta 3001)
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx           # Roteamento por estado
        ├── socket.js         # Cliente Socket.io
        ├── index.css         # Tema dark + animações
        └── components/
            ├── Home.jsx
            ├── HostCreate.jsx
            ├── HostLobby.jsx
            ├── HostQuestion.jsx
            ├── HostResults.jsx
            ├── PlayerJoin.jsx
            ├── PlayerWaiting.jsx
            ├── PlayerQuestion.jsx
            ├── PlayerResult.jsx
            └── Leaderboard.jsx
```

## 🧮 Lógica de pontuação

```
pontos = max(500, round(1000 × (1 − tempoUsado / tempoLimite × 0.5)))
```

- Resposta errada: **0 pontos**
- Resposta correta imediata: **1.000 pontos**
- Resposta correta no último segundo: **~500 pontos**

## ☁️ Deploy

### Render (recomendado para o backend)

1. Crie um novo **Web Service** apontando para `/server`
2. Build command: `npm install`
3. Start command: `npm start`
4. Adicione a variável de ambiente `PORT=3001`

### Vercel (frontend)

1. Crie um novo projeto apontando para `/client`
2. Framework: **Vite**
3. Defina `VITE_APP_URL=https://seu-dominio.vercel.app` nas env vars
4. Atualize a origem CORS no `server.js` para o domínio do Vercel

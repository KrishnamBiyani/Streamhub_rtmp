# 🎥 StreamHub — Live from Browser to the World

**StreamHub** is a real-time browser-based live streaming platform that lets users stream directly to **YouTube (RTMP)** and **StreamHub (HLS)** using only a webcam and mic — powered by React, Socket.IO, FFmpeg, and Docker.

---

## 🚀 Features

- 🎙️ Stream from browser (camera + mic)
- ⚡ Real-time chunk streaming via MediaRecorder
- 🔁 FFmpeg piping to both YouTube & RTMP server
- 📺 HLS output for live viewers (StreamHub)
- 🔐 JWT authentication (Sign Up / Sign In)
- 🧠 Zustand global state management
- 💅 Fully responsive UI with Tailwind CSS
- 🐳 Dockerized backend + RTMP server

---

## 🛠️ Tech Stack

- **Frontend**: React, Zustand, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Streaming**: MediaRecorder API, FFmpeg
- **Server**: NGINX RTMP + HLS
- **Auth**: JWT
- **Deployment**: Docker & Docker Compose

---

## ⚙️ Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/streamhub.git
cd streamhub

# 2. Start backend and RTMP server
docker compose up --build

# 3. Start the frontend
cd frontend
npm install
npm run dev
```

---

## 📁 Environment Variables (Backend)

Create a `.env` file inside the `backend/` folder:

```
JWT_SECRET=your_secret_here
MONGODB_URL=your_mongodb_url
```

---

## 📡 Streaming Flow

```txt
                  ┌────────────────────────────┐
                  │  Browser (MediaRecorder)   │
                  └────────────┬───────────────┘
                               ↓
                        ┌──────────────┐
                        │   Socket.IO  │
                        └──────┬───────┘
                               ↓
                  ┌────────────────────────────┐
                  │ Node.js Backend (FFmpeg)   │
                  └────────────┬───────────────┘
                               ↓
                        ┌──────────────┐
                        │  RTMP Server │
                        └──────┬───────┘
                               ↓
       ┌────────────────────── ┴─────────────────────┐
       │                                             │
┌────────────────────┐                   ┌────────────────────┐
│   YouTube (RTMP)   │                   │  StreamHub (HLS)   │
└────────────────────┘                   └────────────────────┘
```


---

## ✅ Completed

- [x] RTMP live streaming from browser
- [x] YouTube + StreamHub dual stream support
- [x] JWT auth (Sign In / Sign Up)
- [x] Zustand state management
- [x] HLS player for viewers
- [x] Responsive UI with Tailwind
- [x] Dockerized backend setup

---

## 🔮 Coming Soon

- [ ] In-stream chat system
- [ ] Stream recording & archive downloads
- [ ] Viewer count and analytics
- [ ] Stream categories & tags

---

## 🤝 Contributing

Got ideas or improvements? Feel free to [open an issue](https://github.com/your-username/streamhub/issues) or submit a pull request.

---

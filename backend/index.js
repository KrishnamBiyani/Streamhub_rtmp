import http from "http";
import express from "express";
import { Server } from "socket.io";
import { spawn } from "child_process";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 3000;

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  let ffmpegProcess = null;

  socket.on("start-stream", ({ destination, streamKey }) => {
    const rtmpUrl =
      destination === "youtube"
        ? `rtmp://a.rtmp.youtube.com/live2/${streamKey}`
        : `rtmp://rtmp-server:1935/hls/${streamKey}`;

    const options = [
      "-i",
      "-",
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-tune",
      "zerolatency",
      "-r",
      "25",
      "-g",
      "50",
      "-keyint_min",
      "25",
      "-crf",
      "25",
      "-pix_fmt",
      "yuv420p",
      "-sc_threshold",
      "0",
      "-profile:v",
      "main",
      "-level",
      "3.1",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-ar",
      "44100",
      "-f",
      "flv",
      rtmpUrl,
    ];

    ffmpegProcess = spawn("ffmpeg", options);

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`[ffmpeg stderr]: ${data}`);
    });

    ffmpegProcess.on("close", (code) => {
      console.log(`FFmpeg process fully closed with code ${code}`);
      ffmpegProcess = null;
    });

    ffmpegProcess.on("error", (err) => {
      console.error("FFmpeg failed to start:", err);
    });

    console.log("Started FFmpeg process for", socket.id);
  });

  socket.on("binarystream", (chunk) => {
    if (ffmpegProcess && ffmpegProcess.stdin.writable) {
      ffmpegProcess.stdin.write(chunk);
    } else {
      console.warn("Attempted to write to closed FFmpeg stdin.");
    }
  });

  const stopFFmpeg = (reason) => {
    if (ffmpegProcess) {
      try {
        ffmpegProcess.stdin.end();
        ffmpegProcess.kill("SIGINT");
        console.log(`Stopped FFmpeg (${reason}) for`, socket.id);
        ffmpegProcess = null;
      } catch (err) {
        console.error("Error stopping FFmpeg:", err.message);
      }
    }
  };

  socket.on("stop-stream", () => stopFFmpeg("manual stop"));
  socket.on("disconnect", () => stopFFmpeg("disconnect"));
});

server.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});

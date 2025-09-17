import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const StreamYt = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const recorderRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamKey, setStreamKey] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Failed to access camera/mic:", err);
      }
    };

    getMedia();

    return () => {
      // Stop media stream
      streamRef.current?.getTracks().forEach((track) => track.stop());

      // Close socket
      socket.disconnect();
    };
  }, []);

  const handleStart = () => {
    if (!streamKey.trim()) {
      alert("Please enter a valid YouTube stream key.");
      return;
    }

    if (isStreaming) return;

    const socket = socketRef.current;
    const stream = streamRef.current;

    socket.emit("start-stream", {
      destination: "youtube",
      streamKey: streamKey.trim(),
    });

    const mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      mimeType: "video/webm;codecs=vp8,opus",
    });

    recorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        socket.emit("binarystream", event.data);
      }
    };

    mediaRecorder.start(100); // every 100ms
    setIsStreaming(true);
  };

  const handleStop = () => {
    if (!isStreaming) return;

    const recorder = recorderRef.current;
    const socket = socketRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      recorderRef.current = null;
    }

    socket.emit("stop-stream");
    setIsStreaming(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400">
        🎥 Stream to YouTube
      </h1>

      <div className="w-full max-w-3xl aspect-[16/8] bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <input
        type="text"
        placeholder="Enter YouTube Stream Key"
        className="bg-gray-800 border border-gray-700 rounded px-4 py-3 w-full max-w-xl text-white placeholder-white/60"
        value={streamKey}
        onChange={(e) => setStreamKey(e.target.value)}
        disabled={isStreaming}
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleStart}
          disabled={isStreaming}
          className={`px-6 py-3 rounded text-lg font-semibold transition cursor-pointer ${
            isStreaming
              ? "bg-green-800 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          ▶️ Start Stream
        </button>
        <button
          onClick={handleStop}
          disabled={!isStreaming}
          className={`px-6 py-3 rounded text-lg font-semibold transition cursor-pointer ${
            !isStreaming
              ? "bg-red-800 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          ⏹️ Stop Stream
        </button>
      </div>
    </div>
  );
};

export default StreamYt;

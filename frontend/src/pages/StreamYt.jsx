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
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      console.log("Connected to server:", socketRef.current.id);
    });

    async function getMedia() {
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
    }

    getMedia();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleStart = () => {
    setIsStreaming(true);
    const socket = socketRef.current;
    const stream = streamRef.current;

    socket.emit("start-stream", {
      destination: "youtube",
      streamKey: streamKey,
    });

    const mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      mimeType: "video/webm;codecs=vp8,opus",
    });

    recorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (ev) => {
      console.log("Binary stream available: ", ev.data);
      socket.emit("binarystream", ev.data);
    };

    mediaRecorder.start(100);
  };

  const handleStop = () => {
    setIsStreaming(false);
    socketRef.current.emit("stop-stream");

    // Stop the MediaRecorder
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
      recorderRef.current = null;
    }

    // Stop media input (optional)
    streamRef.current?.getTracks().forEach((track) => track.stop());
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">🎥 Stream to YouTube</h1>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-xl rounded shadow-lg"
      ></video>

      <input
        type="text"
        placeholder="Enter YouTube Stream Key"
        className="bg-gray-800 border border-gray-700 rounded px-4 py-2 w-full max-w-xl text-white"
        value={streamKey}
        onChange={(e) => setStreamKey(e.target.value)}
      />

      <div className="flex gap-4">
        <button
          onClick={handleStart}
          disabled={isStreaming}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Start Stream
        </button>
        <button
          onClick={handleStop}
          disabled={!isStreaming}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Stop Stream
        </button>
      </div>
    </div>
  );
};

export default StreamYt;

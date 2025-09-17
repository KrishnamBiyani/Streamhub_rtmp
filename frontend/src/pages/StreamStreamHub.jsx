import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const StreamStreamHub = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const recorderRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamName, setStreamName] = useState("");
  const [watchLink, setWatchLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      console.log("Connected to backend");
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
      socketRef.current?.disconnect();
    };
  }, []);

  const handleStart = () => {
    if (!streamName.trim()) {
      alert("Please enter a stream name");
      return;
    }

    setIsStreaming(true);
    const socket = socketRef.current;
    const stream = streamRef.current;

    socket.emit("start-stream", {
      destination: "rtmp",
      streamKey: streamName,
    });

    const mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      mimeType: "video/webm;codecs=vp8,opus",
    });

    recorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (ev) => {
      socket.emit("binarystream", ev.data);
    };

    mediaRecorder.start(100);

    setWatchLink(`http://localhost:5173/watchstream/${streamName}`);
  };

  const handleStop = () => {
    setIsStreaming(false);
    socketRef.current.emit("stop-stream");

    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
      recorderRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    setWatchLink("");
  };

  const handleCopy = () => {
    if (watchLink) {
      navigator.clipboard.writeText(watchLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        🟣 Stream on StreamHub
      </h1>

      <div className="w-full max-w-3xl aspect-[16/8] bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg">
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
        placeholder="Enter a Stream Name"
        className="bg-gray-800 border border-gray-700 rounded px-4 py-3 w-full max-w-xl text-white placeholder-white/60"
        value={streamName}
        onChange={(e) => setStreamName(e.target.value)}
        disabled={isStreaming}
      />

      {watchLink && (
        <div className="w-full max-w-xl bg-gray-800 border border-gray-700 rounded px-4 py-3 shadow-md">
          <p className="text-sm text-gray-400 mb-2">🔗 Watch Link:</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="text"
              readOnly
              value={watchLink}
              className="w-full bg-gray-900 text-blue-400 font-mono px-3 py-2 rounded outline-none cursor-text text-sm"
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition cursor-pointer"
            >
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-4">
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

export default StreamStreamHub;

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

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to backend");
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
        console.error("❌ Failed to access camera/mic:", err);
      }
    }

    getMedia();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
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

    // Set the watch link
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
      alert("✅ Watch link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">🎥 Stream to StreamHub</h1>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-xl rounded shadow-lg"
      ></video>

      <input
        type="text"
        placeholder="Enter Custom Stream Name"
        className="bg-gray-800 border border-gray-700 rounded px-4 py-2 w-full max-w-xl text-white"
        value={streamName}
        onChange={(e) => setStreamName(e.target.value)}
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

      {watchLink && (
        <div className="mt-4 text-center">
          <p className="mb-2">📺 Share this link to watch:</p>
          <div className="flex items-center gap-2 justify-center">
            <a
              href={watchLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline break-all"
            >
              {watchLink}
            </a>
            <button
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamStreamHub;

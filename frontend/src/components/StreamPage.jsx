import { useEffect, useRef, useState } from "react";

export default function StreamPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamKey, setStreamKey] = useState("");

  useEffect(() => {
    // Request webcam + mic access
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
      // Stop media tracks on unmount
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleStart = () => {
    setIsStreaming(true);
    console.log("Start streaming to:", streamKey);
    // TODO: Send stream to backend
  };

  const handleStop = () => {
    setIsStreaming(false);
    console.log("Stop streaming");
    // TODO: Signal backend to stop FFmpeg
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">🎥 StreamHub</h1>

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
}

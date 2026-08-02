import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Youtube } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const StreamYt = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const recorderRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamKey, setStreamKey] = useState("");

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL);
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
        toast.error("Camera/microphone access is required to stream");
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
      toast.error("Please enter a valid YouTube stream key");
      return;
    }

    if (isStreaming) return;

    const socket = socketRef.current;
    const stream = streamRef.current;

    if (!stream) {
      toast.error("Camera/microphone access is required to stream");
      return;
    }

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-800">
        <Youtube className="h-6 w-6 text-red-500" aria-hidden="true" />
        <h1 className="text-lg sm:text-xl font-semibold text-zinc-50">
          Stream to YouTube
        </h1>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="w-full lg:flex-1 lg:min-w-0">
          <Card className="relative w-full aspect-video overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-xl"
            >
              <track kind="captions" />
            </video>

            {isStreaming && (
              <div
                role="status"
                className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-1 text-xs font-semibold text-white"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"
                  aria-hidden="true"
                />
                LIVE
              </div>
            )}
          </Card>
        </div>

        <div className="w-full lg:w-80 xl:w-96 lg:shrink-0">
          <Card className="p-4 sm:p-5 flex flex-col gap-4">
            <Input
              label="YouTube stream key"
              id="youtube-stream-key"
              type="text"
              placeholder="Enter YouTube stream key"
              value={streamKey}
              onChange={(e) => setStreamKey(e.target.value)}
              disabled={isStreaming}
            />

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button
                variant="success"
                onClick={handleStart}
                disabled={isStreaming}
                className="w-full sm:w-auto lg:w-full"
              >
                Start stream
              </Button>
              <Button
                variant="danger"
                onClick={handleStop}
                disabled={!isStreaming}
                className="w-full sm:w-auto lg:w-full"
              >
                Stop stream
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StreamYt;

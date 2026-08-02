import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Radio, Check, Copy } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

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
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL);

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
        toast.error("Camera/microphone access is required to stream");
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
      toast.error("Please enter a stream name");
      return;
    }

    const stream = streamRef.current;
    if (!stream) {
      toast.error("Camera/microphone access is required to stream");
      return;
    }

    setIsStreaming(true);
    const socket = socketRef.current;

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

    setWatchLink(
      `${import.meta.env.VITE_APP_URL}/watchstream/${streamName}`
    );
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-800">
        <Radio className="h-6 w-6 text-indigo-400" aria-hidden="true" />
        <h1 className="text-lg sm:text-xl font-semibold text-zinc-50">
          Stream on StreamHub
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

        <div className="w-full lg:w-80 xl:w-96 lg:shrink-0 flex flex-col gap-4">
          <Card className="p-4 sm:p-5 flex flex-col gap-4">
            <Input
              label="Stream name"
              id="streamhub-stream-name"
              type="text"
              placeholder="Enter a stream name"
              value={streamName}
              onChange={(e) => setStreamName(e.target.value)}
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

          {watchLink && (
            <Card className="p-4 sm:p-5">
              <p className="text-sm text-zinc-400 mb-2">Watch link</p>
              <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-stretch gap-2">
                <label htmlFor="watch-link" className="sr-only">
                  Watch link
                </label>
                <input
                  id="watch-link"
                  type="text"
                  readOnly
                  value={watchLink}
                  className="w-full min-w-0 bg-zinc-950 border border-zinc-800 text-indigo-400 font-mono px-3 py-2 rounded-md outline-none cursor-text text-sm focus-visible:ring-2 focus-visible:ring-indigo-400"
                  onClick={(e) => e.target.select()}
                />
                <Button
                  variant="secondary"
                  onClick={handleCopy}
                  className="shrink-0 w-full sm:w-auto lg:w-full"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" /> Copy
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default StreamStreamHub;

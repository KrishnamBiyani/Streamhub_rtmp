import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Card from "../components/ui/Card";

const WatchStream = () => {
  const { streamName } = useParams();
  const videoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    const streamUrl = `${import.meta.env.VITE_HLS_URL}/hls/${streamName}/index.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        console.error("HLS.js error:", data);
        if (data.fatal) {
          setError("Stream not available or ended.");
          setLoading(false);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => setLoading(false));
    } else {
      console.error("This browser does not support HLS.");
      setError("Your browser doesn't support live streaming.");
      setLoading(false);
    }
  }, [streamName]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6">
      <h1 className="max-w-full break-words text-center text-xl font-semibold text-zinc-50 mb-4">
        Watching: <span className="text-indigo-400">{streamName}</span>
      </h1>

      <Card className="w-full max-w-5xl aspect-video flex items-center justify-center relative overflow-hidden">
        {loading && !error && (
          <p className="flex items-center gap-2 text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading stream...
          </p>
        )}

        {error && (
          <p role="alert" className="text-red-400 font-medium px-4 text-center">
            {error}
          </p>
        )}

        {!error && (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            className="absolute top-0 left-0 w-full h-full rounded-xl object-cover"
          >
            <track kind="captions" />
          </video>
        )}
      </Card>
    </div>
  );
};

export default WatchStream;

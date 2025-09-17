import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useParams } from "react-router-dom";

const WatchStream = () => {
  const { streamName } = useParams();
  const videoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    const streamUrl = `http://localhost:8080/hls/${streamName}/index.m3u8`;

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold text-purple-400 mb-4">
        🎬 Watching: <span className="text-white">{streamName}</span>
      </h2>

      <div className="w-full max-w-5xl aspect-video bg-gray-800 rounded-lg shadow-lg flex items-center justify-center relative">
        {loading && !error && (
          <p className="text-white/70 animate-pulse">Loading stream...</p>
        )}

        {error && <p className="text-red-400 font-medium">{error}</p>}

        {!error && (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default WatchStream;

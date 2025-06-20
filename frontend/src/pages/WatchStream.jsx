import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { useParams } from "react-router-dom";

const WatchStream = () => {
  const { streamName } = useParams();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const streamUrl = `http://localhost:8080/hls/${streamName}/index.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (event, data) {
        console.error("HLS.js error:", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else {
      console.error("This browser does not support HLS.");
    }
  }, [streamName]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h2 className="text-2xl mb-4">Watching: {streamName}</h2>
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        className="w-full max-w-4xl rounded shadow-lg"
      />
    </div>
  );
};

export default WatchStream;

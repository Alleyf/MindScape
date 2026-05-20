import React, { useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
    }
    setShowSpeedMenu(false);
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="w-full rounded-2xl aspect-video"
        src={src}
        controls
        preload="metadata"
      >
        您的浏览器不支持视频播放
      </video>

      {/* Custom Speed Control */}
      <div className="absolute bottom-12 right-4">
        <button
          type="button"
          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
          className="px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white text-sm rounded-lg transition-colors backdrop-blur-sm"
        >
          {playbackRate}x
        </button>

        {showSpeedMenu && (
          <div className="absolute bottom-full right-0 mb-2 py-2 bg-black/90 rounded-lg backdrop-blur-sm min-w-[80px]">
            {speeds.map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => handleSpeedChange(speed)}
                className={`w-full px-4 py-1.5 text-sm text-left hover:bg-white/10 transition-colors ${
                  playbackRate === speed ? 'text-nebula-accent font-bold' : 'text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
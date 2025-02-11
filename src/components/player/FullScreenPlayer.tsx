import { useEffect, useState, useRef } from "react";
import { usePlayback } from "@/contexts/PlaybackContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
  Volume1,
  VolumeX,
  X,
  Heart,
  Share2,
  ListMusic,
  Minimize2
} from "lucide-react";

interface FullScreenPlayerProps {
  onClose: () => void;
}

interface TouchPosition {
  x: number;
  y: number;
}

export function FullScreenPlayer({ onClose }: FullScreenPlayerProps) {
  const {
    state,
    togglePlay,
    previousTrack,
    nextTrack,
    seek,
    setVolume,
    getVolume
  } = usePlayback();

  const [volume, setVolumeState] = useState<number>(0.5);
  const [position, setPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showQueue, setShowQueue] = useState<boolean>(false);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const touchStart = useRef<TouchPosition | null>(null);
  const swipeThreshold = 100; // minimum distance to trigger swipe

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current || !isSwiping) return;

    const xDiff = e.touches[0].clientX - touchStart.current.x;
    const yDiff = e.touches[0].clientY - touchStart.current.y;

    // Only handle horizontal swipes
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      setSwipeOffset(xDiff);
      e.preventDefault(); // Prevent scrolling
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !isSwiping || !state) return;

    if (swipeOffset > swipeThreshold && !state.disallows.skipping_prev) {
      previousTrack();
    } else if (swipeOffset < -swipeThreshold && !state.disallows.skipping_next) {
      nextTrack();
    }

    touchStart.current = null;
    setIsSwiping(false);
    setSwipeOffset(0);
  };

  // Update position for progress bar
  useEffect(() => {
    if (!state || isDragging) return;

    const interval = setInterval(() => {
      setPosition((prev: number) => {
        if (state.paused) return prev;
        return prev + 1000;
      });
    }, 1000);

    setPosition(state.position);

    return () => clearInterval(interval);
  }, [state, isDragging]);

  // Sync volume with player
  useEffect(() => {
    getVolume().then(setVolumeState);
  }, [getVolume]);

  if (!state?.track_window.current_track) return null;

  const currentTrack = state.track_window.current_track;
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const handleSeek = async (value: number[]) => {
    setPosition(value[0]);
    setIsDragging(false);
    await seek(value[0]);
  };

  const handleVolumeChange = async (value: number[]) => {
    const newVolume = value[0];
    setVolumeState(newVolume);
    await setVolume(newVolume);
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50">
      <div className="h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Minimize2 className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-semibold">Now Playing</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowQueue(!showQueue)}>
            <ListMusic className="h-6 w-6" />
          </Button>
        </div>

        {/* Main Content */}
        <div 
          className="flex-1 flex flex-col items-center justify-center gap-8"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: isSwiping ? `translateX(${swipeOffset}px)` : 'none',
            transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {/* Album Art with Swipe Indicators */}
          <div className="relative group">
            {isSwiping && (
              <>
                {swipeOffset > swipeThreshold && !state.disallows.skipping_prev && (
                  <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-primary">
                    <SkipBack className="w-12 h-12" />
                  </div>
                )}
                {swipeOffset < -swipeThreshold && !state.disallows.skipping_next && (
                  <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-primary">
                    <SkipForward className="w-12 h-12" />
                  </div>
                )}
              </>
            )}
            <img
              src={currentTrack.album.images[0]?.url || '/placeholder-album.svg'}
              alt={currentTrack.name}
              className="w-64 h-64 md:w-96 md:h-96 rounded-lg shadow-2xl"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button 
                size="lg" 
                className="rounded-full w-16 h-16"
                onClick={togglePlay}
              >
                {state.paused ? (
                  <Play className="h-8 w-8 ml-1" />
                ) : (
                  <Pause className="h-8 w-8" />
                )}
              </Button>
            </div>
          </div>

          {/* Track Info */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">{currentTrack.name}</h1>
            <p className="text-muted-foreground">
              {currentTrack.artists.map((artist, i) => (
                <span key={artist.name}>
                  {i > 0 && ", "}
                  <Link
                    to={`/artist/${artist.id}`}
                    className="hover:underline"
                    onClick={onClose}
                  >
                    {artist.name}
                  </Link>
                </span>
              ))}
            </p>
          </div>

          {/* Controls */}
          <div className="w-full max-w-2xl space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-12 text-right">
                {formatTime(position)}
              </span>
              <Slider
                value={[position]}
                min={0}
                max={state.duration}
                step={1000}
                onValueChange={value => {
                  setPosition(value[0]);
                  setIsDragging(true);
                }}
                onValueCommit={handleSeek}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">
                {formatTime(state.duration)}
              </span>
            </div>

            {/* Playback Controls */}
            <div className="flex justify-center items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-12 w-12",
                  state.shuffle && "text-primary"
                )}
              >
                <Shuffle className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12"
                onClick={previousTrack}
                disabled={state.disallows.skipping_prev}
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button
                size="icon"
                className="h-16 w-16 rounded-full"
                onClick={togglePlay}
              >
                {state.paused ? (
                  <Play className="h-8 w-8 ml-1" />
                ) : (
                  <Pause className="h-8 w-8" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12"
                onClick={nextTrack}
                disabled={state.disallows.skipping_next}
              >
                <SkipForward className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-12 w-12",
                  state.repeat_mode > 0 && "text-primary"
                )}
              >
                {state.repeat_mode === 2 ? (
                  <Repeat1 className="h-6 w-6" />
                ) : (
                  <Repeat className="h-6 w-6" />
                )}
              </Button>
            </div>

            {/* Volume and Additional Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VolumeIcon className="h-5 w-5 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-24"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-10 w-10", isLiked && "text-primary")}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Queue Panel */}
        {showQueue && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-background/95 border-l border-border p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Queue</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowQueue(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {state.track_window.next_tracks.map((track) => (
                <div key={track.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded">
                  <img
                    src={track.album.images[2]?.url || '/placeholder-album.svg'}
                    alt={track.name}
                    className="w-10 h-10 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artists.map(a => a.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 
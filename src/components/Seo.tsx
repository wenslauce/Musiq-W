import { useEffect } from 'react';
import { usePlayback } from '@/contexts/PlaybackContext';

export function Seo() {
  const { state, togglePlay, previousTrack, nextTrack } = usePlayback();
  const currentTrack = state?.track_window.current_track;

  useEffect(() => {
    if (!currentTrack) return;

    // Update document title
    document.title = `${currentTrack.name} • ${currentTrack.artists[0].name} | Musiq Wave`;

    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        `Now playing ${currentTrack.name} by ${currentTrack.artists[0].name} on Musiq Wave`
      );
    }

    // Set up Media Session API
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.name,
        artist: currentTrack.artists.map(a => a.name).join(', '),
        album: currentTrack.album.name,
        artwork: currentTrack.album.images.map(img => ({
          src: img.url,
          sizes: `${img.width}x${img.height}`,
          type: 'image/jpeg'
        }))
      });

      // Set up media session handlers
      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => previousTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
    }
  }, [currentTrack, togglePlay, previousTrack, nextTrack]);

  return null;
} 
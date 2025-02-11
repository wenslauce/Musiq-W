const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "app-remote-control"
].join(" ");

export const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES)}&response_type=${RESPONSE_TYPE}&show_dialog=true`;

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial: { [key: string]: string }, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

export const api = {
  getMe: async (token: string) => {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
  
  getArtist: async (token: string, id: string) => {
    const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getAlbum: async (token: string, id: string) => {
    const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getPlaylist: async (token: string, id: string) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getGenres: async (token: string) => {
    const response = await fetch("https://api.spotify.com/v1/browse/categories?limit=50&locale=en_US", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return api.handleResponse(response);
  },

  getGenreDetails: async (token: string, genreId: string) => {
    const response = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return api.handleResponse(response);
  },

  getGenrePlaylists: async (token: string, genreId: string, limit = 20) => {
    const response = await fetch(
      `https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return api.handleResponse(response);
  },

  getRecommendationsByGenre: async (token: string, genreId: string) => {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_genres=${genreId}&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return api.handleResponse(response);
  },

  search: async (token: string, query: string, types: string[] = ['track', 'artist', 'album', 'playlist']) => {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${types.join(',')}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getNewReleases: async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/browse/new-releases', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return api.handleResponse(response);
  },

  getFeaturedPlaylists: async (token: string, country?: string, limit = 20) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      ...(country && { country }),
      locale: navigator.language
    });

    const response = await fetch(
      `https://api.spotify.com/v1/browse/featured-playlists?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return api.handleResponse(response);
  },

  getCategoryPlaylists: async (token: string, categoryId: string) => {
    const response = await fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getArtistTopTracks: async (token: string, artistId: string) => {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getArtistAlbums: async (token: string, artistId: string) => {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getRelatedArtists: async (token: string, artistId: string) => {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  handleResponse: async (response: Response) => {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        window.location.href = '/'; // Redirect to login
        throw new Error('Authentication required');
      }
      if (response.status === 403) {
        throw new Error('Forbidden - Premium required');
      }
      if (response.status === 404) {
        throw new Error('Resource not found');
      }
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  getDevices: async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return api.handleResponse(response);
  },

  play: async (token: string, deviceId: string, uri?: string) => {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: uri ? JSON.stringify({ uris: [uri] }) : undefined,
      }
    );
    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to start playback');
    }
  },

  transferPlayback: async (token: string, deviceId: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
    });
    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to transfer playback');
    }
  },

  getCurrentUser: async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return api.handleResponse(response);
  },

  getUserPlaylists: async (token: string, limit = 20) => {
    const response = await fetch(
      `https://api.spotify.com/v1/me/playlists?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return api.handleResponse(response);
  },

  getTopTracks: async (token: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit = 20) => {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return api.handleResponse(response);
  },

  getTopArtists: async (token: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit = 20) => {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return api.handleResponse(response);
  },

  getPlaybackState: async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 204) {
      return null;
    }
    return api.handleResponse(response);
  },
};

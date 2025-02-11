# Musiq Wave - Modern Music Experience

A beautiful and modern music streaming application built with React and the Spotify Web Playback SDK.

## Features

- 🎵 Full Spotify integration with real-time playback
- 🎨 Beautiful glass-morphism UI design
- 📱 Responsive layout for all devices
- 🎮 Media controls in browser and OS
- 🌐 PWA support for installation
- 🎧 Full-screen player with swipe gestures
- 🔍 Search tracks, artists, and playlists
- 📚 Library management
- 🎵 Genre exploration
- 👤 User profile and preferences

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router
- **Music Playback**: Spotify Web Playback SDK
- **PWA Support**: Vite PWA Plugin

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Spotify Premium Account
- Spotify Developer Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/musiq-wave.git
cd musiq-wave
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback/success
```

4. Start the development server:
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run check-assets` - Verify required assets

## Project Structure

```
musiq-wave/
├── public/          # Static assets
│   ├── components/  # Reusable components
│   ├── contexts/    # React contexts
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Utilities and APIs
│   ├── pages/       # Route components
│   └── types/       # TypeScript types
└── scripts/         # Build and utility scripts
```

## Features in Detail

### Music Playback
- Real-time synchronization with Spotify
- Full playback controls
- Queue management
- Volume control
- Shuffle and repeat modes

### User Interface
- Glass-morphism design
- Responsive layouts
- Touch-friendly controls
- Beautiful animations
- Dark theme

### Mobile Features
- Swipe gestures for navigation
- Bottom sheet player
- Mobile-optimized layouts
- PWA installation
- Media notification controls

### Browser Integration
- Media session API support
- Keyboard shortcuts
- Browser notifications
- Tab title updates
- Favicon animations

## Development

### Required Assets

Before building, ensure all required assets are present in the `public` directory:

```bash
npm run check-assets
```

This will verify:
- Icons (favicon.svg, app icons)
- Screenshots
- Social media images
- PWA manifest

### Environment Setup

1. Create a Spotify Developer account
2. Register your application
3. Set up environment variables
4. Configure redirect URIs

### Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` directory to your hosting provider

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

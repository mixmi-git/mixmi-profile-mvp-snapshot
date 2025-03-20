# Mixmi Profile Media

A Next.js + TypeScript implementation for embedding and displaying media content from multiple platforms in a customizable profile page.

## Application Modes

The application operates in two distinct modes:

### View Mode
- Public-facing profile display
- Read-only presentation of all sections
- Optimized for content consumption
- Accessible to any visitor
- Clean, distraction-free interface

### Edit Mode
- Private editing interface for profile owners
- Full editing capabilities with form inputs
- Real-time preview capabilities
- Debug information for development
- Authenticated access only

## Features

### Media Platform Support
- ✅ YouTube videos
- ✅ SoundCloud tracks and playlists
- ✅ Apple Music playlists and albums
- ✅ Mixcloud shows
- ✅ Spotify tracks and playlists

### URL Sharing Guide
For adding media content, use direct URLs from supported platforms:
- YouTube: Use the video URL (e.g., https://youtube.com/watch?v=...)
- SoundCloud: Use track or playlist URL (e.g., https://soundcloud.com/...)
- Spotify: Use track or playlist URL (e.g., https://open.spotify.com/...)
- Apple Music: Use album or playlist URL
- Mixcloud: Use show URL

Note: Please use direct URLs rather than embed codes for all platforms.

### Profile Features
- 🎨 Consistent section styling with modern dark theme
- 🖼️ Square image format for Spotlight showcase (supports GIF)
- 🎵 Embedded media players from multiple platforms
- 🛍️ Integrated shop with product management uses square image format
- 🎯 Section visibility controls
- 🌟 Custom profile stickers with auto-animation and positioning
- 💳 Optional wallet address display
- 🔗 Customizable social media links
- 👤 Profile image with GIF support
- 💾 Flexible save options (per-section and global)
- 📱 Responsive design with mobile optimization
- 🔄 Preview mode with live updates
- 💫 Smooth animations and transitions
- 🐛 Comprehensive debug system in edit mode

### Technical Features
- 🔒 Stacks Wallet integration
- 📱 Responsive design with Tailwind CSS
- 🎯 Full TypeScript implementation
- ⚡ Next.js 14 with App Router
- 🎨 ShadCN UI components
- 🧩 Modular component architecture
- 💾 Local storage persistence
- 🖼️ Image cropping with aspect ratio control
- 🎵 Optimized media embeds
- 🔍 SEO-friendly structure
- 🌓 Consistent dark mode implementation

## Development

This is a Next.js project bootstrapped with `create-next-app`.

### Prerequisites
- Node.js 14.x or later
- npm or yarn

### Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd mixmi-profile-media
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Project Structure
```
mixmi-profile-media/
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── profile/      # Profile-specific components
│   │   │   ├── editor/   # Edit mode components
│   │   │   │   └── sections/  # Section-specific editors
│   │   │   └── view/     # View mode components
│   │   └── media/        # Media embedding components
│   ├── hooks/            # Custom React hooks
│   │   └── useProfileForm.ts  # Form state management
│   ├── lib/              # Utility functions
│   │   ├── validation/   # Form validation
│   │   └── media/        # Media utilities
│   └── types/            # TypeScript type definitions
├── public/               # Static files
└── styles/              # Global styles
```

### Documentation
- See [REFACTORING.md](REFACTORING.md) for current refactoring progress and plans
- Debug features are available in Edit mode for development 
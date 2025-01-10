# Mixmi Profile Media

A Next.js + TypeScript implementation for embedding and displaying media content from multiple platforms in a customizable profile page.

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
- 🎨 Customizable profile sections
- 🖼️ Spotlight projects showcase with image upload support
- 🛍️ Shop integration
- 🎯 Section visibility controls
- 🌟 Custom profile stickers
- 📱 Responsive design
- 🎨 Dark mode UI
- 💾 Local storage for profile data

### Technical Features
- 🔒 Wallet connection support
- 📱 Responsive design
- 🎯 TypeScript implementation
- ⚡ Next.js for optimal performance
- 💾 Tailwind CSS for styling
- 🧩 ShadCN UI components
- 💾 Local storage for profile data

## Development

This is a Next.js project bootstrapped with `create-next-app`.

### Prerequisites
- Node.js 16.8 or later
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
│   │   └── media/        # Media embedding components
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript type definitions
├── public/               # Static files
└── styles/              # Global styles
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
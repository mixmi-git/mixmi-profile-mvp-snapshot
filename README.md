# MIXMI Profile Phoenix 03

## Current Working Version (March 2024)

A Next.js-based profile page with dynamic content sections and wallet authentication.

### ✨ Working Features

- **Profile Display**
  - Public view with clean, responsive design
  - Profile image with crop functionality
  - Social media links
  - Customizable sections visibility

- **Spotlight Section**
  - Example content display (3 cards)
  - Proper transition from example to user content
  - Image upload functionality
  - Add/Remove items
  - Persistent storage

- **Media Section**
  - YouTube, Spotify, SoundCloud integration
  - Playlist and single track support
  - Responsive embeds

- **Shop Section**
  - Multiple platform support
  - Image upload
  - Dynamic platform detection

- **UI Components**
  - Error boundaries
  - Loading states
  - Responsive design
  - Dark mode

### 🔧 Technical Details

- Built with Next.js
- TypeScript implementation
- Wallet authentication
- Local storage persistence
- Image handling with crop functionality

### 📁 File Structure

```
app/
├── components/
│   ├── media/
│   │   └── MediaEmbed.tsx
│   ├── profile/
│   │   ├── MediaSection.tsx
│   │   ├── ShopSection.tsx
│   │   ├── SocialLinks.tsx
│   │   └── SpotlightSection.tsx
│   └── ui/
│       ├── accordion.tsx
│       ├── avatar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── ErrorBoundary.tsx
│       ├── ImageUpload.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── fonts/
├── i18n/
├── lib/                  # App-level utilities
│   ├── auth.ts
│   ├── example-content.ts
│   ├── mediaUtils.ts
│   └── utils.ts
├── public/
│   └── images/
│       ├── featured-artist-placeholder.jpg
│       ├── latest-project-placeholder.jpg
│       ├── next-event-placeholder.jpg
│       ├── placeholder.png
│       └── shop-placeholder.jpg
├── types/
├── UserProfile.tsx
├── favicon.ico
├── globals.css
├── layout.tsx
├── page.tsx
└── providers.tsx

# Configuration Files
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.js
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
├── tailwind.config.ts
└── tsconfig.json
```

### 🔑 Key Implementation Details
[rest of README remains the same...]





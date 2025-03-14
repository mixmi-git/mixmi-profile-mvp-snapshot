# MiXMi Profile Styling Guide

This document captures the styling details for the MiXMi Profile components to ensure consistency when rebuilding or refactoring UI components.

## Color Palette

### Background Colors
- Main background: `bg-gray-900` (dark navy)
- Card backgrounds: `bg-gray-800/50` (semi-transparent dark gray)
- Section cards: `bg-gray-800/50` (with borders)
- Form fields: `bg-gray-800` with `border-gray-700`

### Text Colors
- Primary text: `text-gray-100` (almost white)
- Secondary text: `text-gray-200` (slightly darker white)
- Muted text: `text-gray-300` and `text-gray-400` (various gray shades)
- Headings/accents: `text-cyan-300` (teal/cyan)
- Button text: `text-white`
- Error text: `text-red-500`

### Accent Colors
- Primary accent: `text-cyan-300`, `border-cyan-300`, `bg-cyan-500`
- Button hover: `hover:bg-cyan-600`
- Button borders: `border-cyan-300/60` (60% opacity cyan)
- Button hover borders: `hover:border-cyan-300/80` (80% opacity cyan)
- Card hover: `hover:border-cyan-300/50`

## Typography

### Text Sizes
- Page headings: `text-3xl font-semibold` (MEDIA, SPOTLIGHT, SHOP section headers)
- Profile name: `text-3xl sm:text-4xl font-bold`
- Section headings: `text-2xl font-bold`
- Card titles: `text-lg font-semibold`
- Regular text: `text-sm sm:text-base`
- Description text: `text-sm text-gray-400`

### Font Treatments
- Bold text: `font-bold`, `font-semibold`
- Line clamp: `line-clamp-2`, `line-clamp-3` (text truncation)
- Whitespace: `whitespace-pre-wrap break-words` (for user-generated content)

## Component Styling

### Cards
- Base: `rounded-lg overflow-hidden bg-gray-800/50 mb-12`
- Hover state: `hover:border-cyan-300/50 transition-all duration-300`
- Group hover: `group-hover:scale-105` (for images inside cards)
- Animation: `opacity-0 animate-fadeIn` with staggered delays

### Buttons
- Primary: `bg-cyan-500 hover:bg-cyan-600 text-white transition-all shadow-md hover:shadow-lg`
- Outline: `border-2 border-cyan-300/60 hover:border-cyan-300/80 transition-colors`
- Ghost: `variant="ghost"`
- Icon: `w-10 h-10 sm:w-12 sm:h-12`

### Images
- Profile image: Border styling `border border-cyan-300 rounded-lg`
- Card images: `aspect-[16/9]` ratio with `object-cover`
- Hover effect: `transition-transform duration-300 group-hover:scale-105`

## Animations

### Fade-in Animation
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
```
- Used with staggered delays: 
  - Profile section: `0ms`
  - Media section: `50ms`
  - Spotlight section: `150ms`
  - Shop section: `250ms`

### Sticker Animation
```css
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.sticker-rotate {
  animation: rotate 20s linear infinite;
}
```

## Responsive Design

### Media Queries (via Tailwind)
- Mobile first design
- Small devices: `sm:` prefix (640px+)
- Medium devices: `md:` prefix (768px+) 
- Large devices: `lg:` prefix (1024px+)

### Layout Changes
- Main container: `p-4 sm:p-8 md:p-12 lg:p-16`
- Profile layout: `flex-col lg:flex-row` (stacks vertically on small screens, horizontal on large)
- Grid layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (responsive grid for cards)
- Text alignment: `text-center lg:items-start` (centered on mobile, left-aligned on desktop)

## Spacing Patterns

### Container Spacing
- Page container: `p-4 sm:p-8 md:p-12 lg:p-16` (responsive padding)
- Section max width: `max-w-6xl mx-auto` (centered with max width)
- Content padding: `p-6 md:p-8` (inner container padding)

### Vertical Rhythm
- Section spacing: `mt-24 sm:mt-32 mb-24` (large gaps between major sections)
- Card margins: `mb-12` (bottom margin for cards)
- Header spacing: `mb-4` (small margin after headings)
- Description spacing: `mb-12` (margin after section descriptions)
- Form field spacing: `mt-1`, `mb-4` (consistent form element spacing)

### Gaps and Gutters
- Grid gap: `gap-8` (consistent gap for grid layouts)
- Flex gaps: `gap-4`, `gap-6`, `gap-8` (various sizes depending on content)
- Icon spacing: `mr-2` (margin after icons in buttons)

### Responsive Spacing
- Vertical spacing scale: `space-y-6 lg:space-y-8` (increases on larger screens)
- Section vertical margin: `mt-16 sm:mt-24` (increases on larger screens)
- Element gaps: `gap-8 lg:gap-16` (wider spacing on larger screens)

### Padding Inside Components
- Card content: `p-4`, `p-6`
- Button padding: `px-6 py-2` (horizontal and vertical padding)
- Form inputs: `p-2` (consistent internal padding)

## Media Embeds

### Media Aspect Ratios
```javascript
const getAspectRatio = () => {
  switch (item.type) {
    case 'youtube': return 'pb-[56.25%]' // 16:9 ratio
    case 'soundcloud': return 'pb-[300px]'  // Fixed height for tracks
    case 'soundcloud-playlist': return 'pb-[400px]'  // Taller height for playlists
    case 'spotify': return 'pb-[152px]'  // Single track
    case 'spotify-playlist': return 'pb-[380px]'  // Playlist height
    case 'apple-music-album': return 'pb-[175px]'  // Height for album
    case 'apple-music-playlist': return 'pb-[450px]'  // Height for playlist
    case 'apple-music-station': return 'pb-[175px]'  // Height for station
    case 'mixcloud': return 'pb-[400px]'  // Height for Mixcloud shows
    case 'instagram-reel': return 'pb-[125%]'  // Instagram's aspect ratio
    default: return 'pb-[56.25%]'
  }
}
```

## Default Images and Content

### Example Content
- Profile images: Default to `/images/placeholder.png`
- Example spotlight items: From `exampleProjects` constant
- Example media items: From `exampleMediaItems` constant
- Example shop items: From `exampleShopItems` constant
- Default sticker image: `https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png`

### Section Headers and Descriptions
- SPOTLIGHT: "Share your work and favorite projects"
- MEDIA: "Share your music, DJ mixes, playlists and videos"
- SHOP: "Share your products, merch, and token-gated content"

## Special Elements

### Sticky Footer (Edit Mode)
```jsx
<div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
  <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <div className="text-sm text-gray-400">
        Changes save automatically
      </div>
      <Button>
        {previewMode ? 'Exit Preview' : 'Preview'}
      </Button>
    </div>
    <Button className="px-6 py-2 text-lg border-2 border-cyan-300/60 hover:border-cyan-300/80 transition-colors">
      Done Editing
    </Button>
  </div>
</div>
```

### Social Icons
Social media icons with hover effects:
- Youtube: `<Youtube />`
- Spotify: `<Music2 />`
- Soundcloud: `<CloudRain />`
- Twitter: `<Twitter />`
- Instagram: `<Instagram />`
- LinkedIn: `<Linkedin />`
- TikTok: Custom SVG icon

## Component Structure

### Profile Layout
```jsx
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16">
  {/* Left column - Profile image */}
  <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
    <div className="relative aspect-square overflow-hidden border border-cyan-300 rounded-lg">
      <Image
        src={profile.image}
        alt="Artist profile photo"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        priority
      />
    </div>
  </div>

  {/* Right column - Profile info */}
  <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-center text-center">
    <div className="space-y-6 lg:space-y-8 max-w-sm">
      {/* Name and Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300">
          {profile.name}
        </h1>
        <h2 className="text-lg sm:text-xl text-gray-200">
          {profile.title}
        </h2>
      </div>

      {/* Bio */}
      <div>
        <p className="text-sm sm:text-base text-gray-300">
          {profile.bio}
        </p>
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-4">
        {profile.socialLinks.map((link, index) => (
          <SocialLinkButton key={index} link={link} />
        ))}
      </div>

      {/* Edit Profile button (if authenticated) */}
      {isAuthenticated && (
        <Button onClick={() => setIsEditing(true)}>
          <Edit2 className="mr-2 h-4 w-4" />
          <span>Edit Profile</span>
        </Button>
      )}
    </div>
  </div>
</div>
```

### Section Layout
```jsx
<div className="mt-24 sm:mt-32 max-w-6xl mx-auto px-4 mb-24 opacity-0 animate-fadeIn"
  style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
  <h2 className="text-3xl font-semibold text-white text-center mb-4">
    SECTION TITLE
  </h2>
  <p className="text-sm text-gray-400 text-center mb-12">
    Section description text
  </p>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {/* Section items */}
  </div>
</div>
```

This guide should be a valuable reference for maintaining consistent styling as you refactor the components. 
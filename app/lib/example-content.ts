import { Project, ShopItem } from '@/types/content'
import { MediaItem } from '@/types/media'

export const exampleProjects: Project[] = [
  {
    id: 1,
    title: "Latest Release",
    description: "Check out my new track on all platforms",
    image: "/images/featured-artist-placeholder.jpg",
    link: "https://example.com/latest-release"
  },
  {
    id: 2,
    title: "Upcoming Show",
    description: "Join me for a live performance",
    image: "/images/next-event-placeholder.jpg",
    link: "https://example.com/upcoming-show"
  },
  {
    id: 3,
    title: "Featured Collaboration",
    description: "A special project with amazing artists",
    image: "/images/latest-project-placeholder.jpg",
    link: "https://example.com/collaboration"
  }
]

export const exampleMediaItems: MediaItem[] = [
  {
    id: '1HDScCZndSk',
    type: 'youtube',
    title: 'Share Your Music & Videos',
    rawUrl: 'https://www.youtube.com/watch?v=1HDScCZndSk'
  },
  {
    id: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator',
    type: 'spotify-playlist',
    title: 'Add Your Playlists',
    rawUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
  }
]

export const exampleShopItems: ShopItem[] = [
  {
    id: 1,
    title: 'Your Store',
    storeUrl: '#',
    image: '/images/shop-placeholder.jpg',
    platform: 'other',
    description: 'Connect your online store to showcase your products'
  }
] 
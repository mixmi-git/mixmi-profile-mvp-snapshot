import { Project, MediaItem, ShopItem } from '@/components/UserProfile'

export const exampleProjects: Project[] = [
  {
    id: 1,
    title: "Your Next Event",
    description: "Share details about your upcoming shows, releases, or collaborations",
    image: "/images/next-event-placeholder.jpg",
    link: "#"
  },
  {
    id: 2,
    title: "Featured Artist",
    description: "Highlight creators and collaborators you want to support",
    image: "/images/featured-artist-placeholder.jpg",
    link: "#"
  },
  {
    id: 3,
    title: "Latest Project",
    description: "Showcase your work, ideas, or upcoming releases",
    image: "/images/latest-project-placeholder.jpg",
    link: "#"
  }
]

export const exampleMediaItems: MediaItem[] = [
  { 
    id: '1HDScCZndSk',
    type: 'youtube',
    rawUrl: 'https://www.youtube.com/watch?v=1HDScCZndSk',
    title: 'Share Your Music & Videos'
  },
  {
    id: '37i9dQZF1DXcBWIGoYBM5M',
    type: 'spotify-playlist',
    rawUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    title: 'Add Your Playlists'
  }
]

export const exampleShopItems: ShopItem[] = [
  {
    id: 'example-store',
    title: 'Your Store',
    storeUrl: '#',
    image: '/images/shop-placeholder.jpg',
    platform: 'other',
    description: 'Connect your online store to showcase your products'
  }
] 
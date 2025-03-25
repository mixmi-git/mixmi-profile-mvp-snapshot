import { MediaItem, SpotlightItem, ShopItem } from '../types';
import { Project } from '../types/content';

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
    id: '1',
    type: 'youtube',
    title: '',
    embedUrl: 'https://www.youtube.com/embed/coh2TB6B2EA',
    rawUrl: 'https://youtu.be/coh2TB6B2EA'
  },
  {
    id: '2',
    type: 'spotify-playlist',
    title: '',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZEVXbMDoHDwVN2tF',
    rawUrl: 'https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF?si=3Puyx2VJSxSoKu6tNk5KkA'
  }
]

export const exampleSpotlightItems: SpotlightItem[] = [
  {
    id: '1',
    title: 'Latest Release',
    description: 'Check out my new track available on all platforms',
    image: '/images/featured-artist-placeholder.jpg',
    link: 'https://example.com/latest-release'
  },
  {
    id: '2',
    title: 'Upcoming Shows',
    description: 'See where I\'m performing next and get tickets',
    image: '/images/next-event-placeholder.jpg',
    link: 'https://example.com/tour-dates'
  },
  {
    id: '3',
    title: 'New Collaboration',
    description: 'A special project with amazing artists',
    image: '/images/latest-project-placeholder.jpg',
    link: 'https://example.com/collaboration'
  }
]

export const exampleShopItems: ShopItem[] = [
  {
    id: '1',
    title: 'Limited Edition Merch',
    description: 'Exclusive merchandise from the latest tour',
    image: '/images/shop-placeholder.jpg',
    price: '$25.00',
    link: 'https://example.com/merch/limited-edition'
  },
  {
    id: '2',
    title: 'Digital Album',
    description: 'Download my latest album in high quality',
    image: '/images/digital-album-placeholder.jpg',
    price: '$9.99',
    link: 'https://example.com/album/digital'
  }
] 
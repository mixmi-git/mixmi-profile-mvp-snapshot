import { ShopItem } from '@/types/content';

/**
 * Example data for the Shop section
 */
export const exampleShopItems: ShopItem[] = [
  {
    id: 1,
    title: 'Limited Edition Vinyl',
    description: 'Special edition vinyl with exclusive artwork and bonus tracks. $29.99',
    storeUrl: 'https://shop.example.com/vinyl',
    image: '/images/placeholder.png',
    platform: 'shopify',
  },
  {
    id: 2,
    title: 'Tour Merchandise',
    description: 'Official tour merchandise including t-shirts, hoodies, and accessories. $24.99',
    storeUrl: 'https://shop.example.com/merch',
    image: '/images/placeholder.png',
    platform: 'shopify',
  },
  {
    id: 3,
    title: 'Digital Album Download',
    description: 'High-quality digital download of the latest album with exclusive bonus content. $9.99',
    storeUrl: 'https://gumroad.com/example',
    image: '/images/placeholder.png',
    platform: 'gumroad',
  },
]; 
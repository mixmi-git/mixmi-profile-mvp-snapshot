import { ProfileData, SpotlightItemType, MediaItemType, ShopItemType } from './UserProfileContainer';
import UserProfileContainer from './UserProfileContainer';

const exampleSpotlightItems: SpotlightItemType[] = [
  {
    id: '1',
    title: 'Latest Project',
    description: 'Check out my latest music project - a collaboration with amazing artists.',
    image: '/images/placeholder-project.jpg',
    link: 'https://example.com/project'
  },
  {
    id: '2',
    title: 'Upcoming Event',
    description: 'Join me at the upcoming music festival where I\'ll be performing live!',
    image: '/images/placeholder-event.jpg',
    link: 'https://example.com/event'
  }
];

const UserProfile = () => {
  return (
    <UserProfileContainer
      initialSpotlightItems={exampleSpotlightItems}
      initialMediaItems={[]}
      initialShopItems={[]}
    />
  );
};

export default UserProfile; 
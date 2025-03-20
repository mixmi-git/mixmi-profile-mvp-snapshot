import { UserProfile } from "@/components/UserProfile";
import ResetProfileButton from './resetProfileButton';

export default function Home() {
  return (
    <>
      <UserProfile />
      {process.env.NODE_ENV === 'development' && (
        <ResetProfileButton />
      )}
    </>
  );
}
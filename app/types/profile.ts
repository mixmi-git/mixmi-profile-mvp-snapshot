export interface SocialLinkType {
  platform: string;
  url: string;
}

export interface ProfileData {
  id: string;
  name: string;
  title: string;
  bio: string;
  image?: string;
  walletAddress?: string;
  showWalletAddress?: boolean;
  btcAddress?: string;
  showBtcAddress?: boolean;
  socialLinks: SocialLinkType[];
  sectionVisibility?: {
    spotlight?: boolean;
    media?: boolean;
    shop?: boolean;
    sticker?: boolean;
  };
  sticker?: {
    image: string;
    visible: boolean;
  };
  hasEditedProfile?: boolean;
}

export interface PersonalInfoEditorProps {
  profile: ProfileData;
  onSave: (updates: Partial<ProfileData>) => void;
  onClose: () => void;
}

export interface PersonalInfoEditorModalProps extends PersonalInfoEditorProps {
  isOpen: boolean;
} 
export const validateSocialUrl = (platform: string, url: string): { isValid: boolean; message: string } => {
  // Basic URL validation
  if (!url.trim()) {
    return { isValid: false, message: 'URL is required' };
  }

  try {
    new URL(url); // Basic URL format check
  } catch {
    return { isValid: false, message: 'Please enter a valid URL' };
  }

  // Platform-specific validation
  switch (platform) {
    case 'youtube':
      if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return { isValid: false, message: 'Please enter a valid YouTube URL' };
      }
      break;
    case 'spotify':
      if (!url.includes('spotify.com')) {
        return { isValid: false, message: 'Please enter a valid Spotify URL' };
      }
      break;
    case 'soundcloud':
      if (!url.includes('soundcloud.com')) {
        return { isValid: false, message: 'Please enter a valid SoundCloud URL' };
      }
      break;
    case 'twitter':
      if (!url.includes('twitter.com') && !url.includes('x.com')) {
        return { isValid: false, message: 'Please enter a valid Twitter/X URL' };
      }
      break;
    case 'instagram':
      if (!url.includes('instagram.com')) {
        return { isValid: false, message: 'Please enter a valid Instagram URL' };
      }
      break;
    case 'linkedin':
      if (!url.includes('linkedin.com')) {
        return { isValid: false, message: 'Please enter a valid LinkedIn URL' };
      }
      break;
    case 'tiktok':
      if (!url.includes('tiktok.com')) {
        return { isValid: false, message: 'Please enter a valid TikTok URL' };
      }
      break;
  }

  return { isValid: true, message: '' };
}; 
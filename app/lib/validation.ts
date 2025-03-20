export function validateSocialUrl(platform: string, url: string) {
  if (!url) {
    return { isValid: false, message: 'URL is required' };
  }

  try {
    new URL(url);
  } catch {
    return { isValid: false, message: 'Invalid URL format' };
  }

  // Platform-specific validation
  switch (platform.toLowerCase()) {
    case 'twitter':
      if (!url.includes('twitter.com') && !url.includes('x.com')) {
        return { isValid: false, message: 'Must be a Twitter/X URL' };
      }
      break;
    case 'instagram':
      if (!url.includes('instagram.com')) {
        return { isValid: false, message: 'Must be an Instagram URL' };
      }
      break;
    case 'facebook':
      if (!url.includes('facebook.com')) {
        return { isValid: false, message: 'Must be a Facebook URL' };
      }
      break;
    case 'linkedin':
      if (!url.includes('linkedin.com')) {
        return { isValid: false, message: 'Must be a LinkedIn URL' };
      }
      break;
    case 'youtube':
      if (!url.includes('youtube.com')) {
        return { isValid: false, message: 'Must be a YouTube URL' };
      }
      break;
    case 'github':
      if (!url.includes('github.com')) {
        return { isValid: false, message: 'Must be a GitHub URL' };
      }
      break;
    case 'website':
      // No specific validation for personal websites
      break;
    default:
      return { isValid: false, message: 'Invalid platform' };
  }

  return { isValid: true, message: '' };
}

export const validateSpotlightItem = (field: string, value: string): { isValid: boolean; message: string } => {
  switch (field) {
    case 'title':
      if (!value.trim()) {
        return { isValid: false, message: 'Title is required' };
      }
      if (value.length > 80) {
        return { isValid: false, message: 'Title must be less than 80 characters' };
      }
      return { isValid: true, message: '' };

    case 'description':
      if (!value.trim()) {
        return { isValid: false, message: 'Description is required' };
      }
      if (value.length > 180) {
        return { isValid: false, message: 'Description must be less than 180 characters' };
      }
      return { isValid: true, message: '' };

    case 'link':
      if (value.trim()) { // Only validate if link is provided
        try {
          new URL(value);
          return { isValid: true, message: '' };
        } catch {
          return { isValid: false, message: 'Please enter a valid URL' };
        }
      }
      return { isValid: true, message: '' };

    default:
      return { isValid: true, message: '' };
  }
};

export const validateSpotlightImage = (file: File): { isValid: boolean; message: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return { 
      isValid: false, 
      message: 'Please upload a valid image (JPEG, PNG, GIF, or WebP)' 
    };
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB
    return { 
      isValid: false, 
      message: 'Image must be less than 5MB' 
    };
  }

  return { isValid: true, message: '' };
};

// Add shop validation
export const validateShopItem = (field: string, value: string): { isValid: boolean; message: string } => {
  switch (field) {
    case 'title':
      if (value.length > 80) {
        return { isValid: false, message: 'Title must be less than 80 characters' };
      }
      return { isValid: true, message: '' };

    case 'description':
      if (value.length > 180) {
        return { isValid: false, message: 'Description must be less than 180 characters' };
      }
      return { isValid: true, message: '' };

    case 'link':
    case 'storeUrl':
      if (value.trim()) {
        try {
          // First, try to parse as a standard URL
          try {
            new URL(value);
            return { isValid: true, message: '' };
          } catch (e) {
            // If that fails, check if it's a valid URL with the http:// prefix added
            if (!/^https?:\/\//i.test(value)) {
              try {
                new URL(`https://${value}`);
                // It's valid with prefix, so accept it but suggest the proper format
                console.log(`URL validation: accepting url without protocol: ${value}`);
                return { 
                  isValid: true, 
                  message: 'Consider adding https:// for proper URL format' 
                };
              } catch {
                // It's not a valid URL even with prefix
                console.log(`URL validation: invalid url: ${value}`);
                return { isValid: false, message: 'Please enter a valid URL (e.g., https://example.com)' };
              }
            } else {
              // Has prefix but still not valid
              console.log(`URL validation: invalid url with protocol: ${value}`);
              return { isValid: false, message: 'Please enter a valid URL (e.g., https://example.com)' };
            }
          }
        } catch (e) {
          console.log(`URL validation error: ${e}`);
          return { isValid: false, message: 'Please enter a valid URL (e.g., https://example.com)' };
        }
      }
      return { isValid: true, message: '' };

    default:
      return { isValid: true, message: '' };
  }
};

export const validateShopImage = (file: File): { isValid: boolean; message: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, message: 'Please upload an image file' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, message: 'Image must be less than 5MB' };
  }
  return { isValid: true, message: '' };
}; 
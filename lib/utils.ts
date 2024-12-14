export const getMediaDisplayName = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Common media platforms
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube';
    if (hostname.includes('spotify.com')) return 'Spotify';
    if (hostname.includes('soundcloud.com')) return 'SoundCloud';
    if (hostname.includes('apple.com')) return 'Apple Music';
    if (hostname.includes('tidal.com')) return 'Tidal';
    if (hostname.includes('bandcamp.com')) return 'Bandcamp';
    
    // If no match, return the hostname without www. and .com
    return hostname.replace('www.', '').split('.')[0];
  } catch {
    return 'Link';
  }
}; 
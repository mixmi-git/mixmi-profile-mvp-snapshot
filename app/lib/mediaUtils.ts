export const getMediaDisplayName = (url: string, type?: string): string => {
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

export const isValidAppleMusicUrl = (url: string): boolean => {
  // Check for basic Apple Music URL structure
  const validUrlPattern = /^https:\/\/music\.apple\.com\/[a-z]{2}\/(album|playlist)\/[^\/]+\/[0-9]+(\?.*)?$/i
  return validUrlPattern.test(url)
} 

export const transformAppleMusicUrl = (url: string): string => {
  try {
    console.log('Transforming Apple Music URL:', url);
    // Clean up the URL - remove any extra 'h' at the start
    const cleanUrl = url.replace(/^h+ttps:\/\//, 'https://')
                       .replace(/^@/, '')
                       .trim();
    console.log('Cleaned URL:', cleanUrl);
    
    const match = cleanUrl.match(/music\.apple\.com\/([^\/]+)\/(album|playlist|station)\/([^\/]+)\/([^\/\?]+)/)
    if (match) {
      const [_, country, mediaType, name, id] = match
      const transformedUrl = `https://embed.music.apple.com/${country}/${mediaType}/${id}`;
      console.log('Transformed URL:', transformedUrl);
      return transformedUrl;
    }
    return url
  } catch (error) {
    console.error('Error parsing Apple Music URL:', error)
    return url
  }
} 
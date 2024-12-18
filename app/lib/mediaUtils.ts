export const getMediaDisplayName = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube';
    if (hostname.includes('spotify.com')) return 'Spotify';
    if (hostname.includes('soundcloud.com')) return 'SoundCloud';
    if (hostname.includes('apple.com')) return 'Apple Music';
    if (hostname.includes('mixcloud.com')) return 'Mixcloud';
    if (hostname.includes('tidal.com')) return 'Tidal';
    if (hostname.includes('bandcamp.com')) return 'Bandcamp';
    
    return hostname.replace('www.', '').split('.')[0];
  } catch {
    return 'Link';
  }
}; 

export const transformSoundCloudUrl = (url: string): string => {
  try {
    // Clean the URL
    const cleanUrl = url.trim().replace(/^h+ttps:\/\//, 'https://');
    
    // If it's already an embed URL, return it
    if (cleanUrl.includes('w.soundcloud.com/player')) {
      return cleanUrl;
    }

    // If it's an iframe code, extract the src URL
    if (cleanUrl.includes('<iframe')) {
      const srcMatch = cleanUrl.match(/src="([^"]+)"/);
      return srcMatch ? srcMatch[1] : url;
    }
    
    // Transform regular SoundCloud URL to embed URL
    // Remove query parameters first
    const urlWithoutParams = cleanUrl.split('?')[0];
    const scRegex = /soundcloud\.com\/([^\/]+\/[^\/]+)/;
    const scMatch = urlWithoutParams.match(scRegex);
    if (scMatch) {
      return `https://w.soundcloud.com/player/?url=https://soundcloud.com/${scMatch[1]}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    }
    
    return url;
  } catch (error) {
    console.error('Error transforming SoundCloud URL:', error);
    return url;
  }
};

export const transformAppleMusicUrl = (url: string): string => {
  try {
    // Clean up the URL
    const cleanUrl = url.trim()
      .replace(/^h+ttps:\/\//, 'https://')
      .replace(/^@/, '')
      .trim();
    
    console.log('Processing Apple Music URL:', cleanUrl);

    // Handle stations (they have a different format)
    if (cleanUrl.includes('/station/')) {
      const stationMatch = cleanUrl.match(/music\.apple\.com\/([^\/]+)\/station\/([^\/]+)\/([^?\s]+)/);
      if (stationMatch) {
        const [, country, stationName, id] = stationMatch;
        console.log('Station match:', { country, stationName, id });
        return `https://embed.music.apple.com/${country}/station/${id}?app=music`;
      }
    }

    // Handle albums and playlists
    const otherMatch = cleanUrl.match(/music\.apple\.com\/([^\/]+)\/(album|playlist)\/([^\/]+)\/([^\/\?]+)/);
    if (otherMatch) {
      const [, country, mediaType, name, id] = otherMatch;
      console.log('Album/Playlist match:', { country, mediaType, name, id });
      return `https://embed.music.apple.com/${country}/${mediaType}/${id}?app=music`;
    }

    console.log('No match found for URL');
    return url;
  } catch (error) {
    console.error('Error transforming Apple Music URL:', error);
    return url;
  }
};

export const transformMixcloudUrl = (url: string): string => {
  try {
    // Clean the URL
    const cleanUrl = url.trim().replace(/^h+ttps:\/\//, 'https://');
    
    // If it's already a widget URL, return it
    if (cleanUrl.includes('player-widget.mixcloud.com')) {
      const srcMatch = cleanUrl.match(/src="([^"]+)"/);
      return srcMatch ? srcMatch[1] : cleanUrl;
    }

    // If it's an iframe code, extract the src URL
    if (cleanUrl.includes('<iframe')) {
      const srcMatch = cleanUrl.match(/src="([^"]+)"/);
      return srcMatch ? srcMatch[1] : url;
    }
    
    return cleanUrl;
  } catch (error) {
    console.error('Error transforming Mixcloud URL:', error);
    return url;
  }
};

export const transformInstagramUrl = (url: string): string => {
  try {
    const cleanUrl = url.trim()
      .replace(/^@/, '')
      .replace(/^h+ttps:\/\//, 'https://');
    
    // If it's already an embed URL, return it
    if (cleanUrl.includes('/embed')) {
      return cleanUrl;
    }
    
    // Extract the reel code from either /reel/ or /p/ format
    const match = cleanUrl.match(/instagram\.com\/(reel|p)\/([A-Za-z0-9_-]+)/);
    if (match) {
      const [, , code] = match;
      return `https://www.instagram.com/p/${code}/embed`;
    }
    
    return url;
  } catch (error) {
    console.error('Error transforming Instagram URL:', error);
    return url;
  }
};

export const transformTikTokUrl = (url: string): string => {
  try {
    const cleanUrl = url.trim()
      .replace(/^@/, '')
      .replace(/^h+ttps:\/\//, 'https://');
    
    // Extract TikTok video ID and username from URL
    const match = cleanUrl.match(/tiktok\.com\/@([^\/]+)\/video\/(\d+)/);
    if (match) {
      const [, username, videoId] = match;
      return `https://www.tiktok.com/@${username}/video/${videoId}`;
    }
    
    return url;
  } catch (error) {
    console.error('Error transforming TikTok URL:', error);
    return url;
  }
};

export const detectMediaType = (url: string): string => {
  const cleanUrl = url.toLowerCase();
  console.log('detectMediaType checking URL:', cleanUrl);
  
  // Check Instagram first - handle both reel and embed URLs
  if (cleanUrl.includes('instagram.com') && 
     (cleanUrl.includes('/reel/') || 
      cleanUrl.includes('/p/') || 
      cleanUrl.includes('?utm_source=ig_web_copy_link'))) {
    console.log('Detected as Instagram Reel');
    return 'instagram-reel';
  }

  if (cleanUrl.includes('mixcloud.com') || cleanUrl.includes('player-widget.mixcloud.com')) {
    return 'mixcloud';
  }
  
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    return 'youtube';
  }
  if (cleanUrl.includes('soundcloud.com')) {
    return cleanUrl.includes('/sets/') ? 'soundcloud-playlist' : 'soundcloud';
  }
  if (cleanUrl.includes('spotify.com')) {
    return cleanUrl.includes('/playlist/') ? 'spotify-playlist' : 'spotify';
  }
  if (cleanUrl.includes('music.apple.com')) {
    if (cleanUrl.includes('/album/')) return 'apple-music-album';
    if (cleanUrl.includes('/playlist/')) return 'apple-music-playlist';
    return 'apple-music-station';
  }
  if (cleanUrl.includes('tiktok.com')) {
    return 'tiktok';
  }
  return 'unknown';
};

export const transformYouTubeUrl = (url: string): string => {
  try {
    const cleanUrl = url.trim().replace(/^h+ttps:\/\//, 'https://');
    
    // Handle youtu.be format
    if (cleanUrl.includes('youtu.be')) {
      const match = cleanUrl.match(/youtu\.be\/([^?]+)/);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    // Handle youtube.com format
    const match = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  } catch (error) {
    console.error('Error transforming YouTube URL:', error);
    return url;
  }
};
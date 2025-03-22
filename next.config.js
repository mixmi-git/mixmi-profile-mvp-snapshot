/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    unoptimized: true
  },
  // Disable webpack persistence caching which is causing corrupted cache
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent caching in development
      config.cache = false;
      
      // Use memory filesystem instead of disk
      config.optimization = {
        ...config.optimization,
        runtimeChunk: false,
      };
    }
    
    return config;
  },
  
  // Strict mode can cause additional renders that may trigger the issue
  reactStrictMode: false,
  
  // Suppress excessive warnings in the console
  onDemandEntries: {
    // Keep pages in memory for longer to reduce rebuilds
    maxInactiveAge: 60 * 60 * 1000,
    // Reduce the number of simultaneous pages to compile
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig 
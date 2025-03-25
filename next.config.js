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
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
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

  // Add experimental features to fix CSS issues
  experimental: {
    optimizeCss: true
  },
}

module.exports = nextConfig 
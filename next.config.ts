import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker production image
  output: 'standalone',
}

export default nextConfig

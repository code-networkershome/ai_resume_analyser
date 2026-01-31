/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // PERFORMANCE: Enable SWC minification (faster than Terser)
    swcMinify: true,

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
        // PERFORMANCE: Optimize images
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
        // PERFORMANCE: Optimize package imports
        optimizePackageImports: [
            'lucide-react',
            'recharts',
            '@radix-ui/react-icons',
            'date-fns',
            'framer-motion',
        ],
    },
    poweredByHeader: false, // Security: Hide Next.js footprint
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https://openrouter.ai https://*.vercel-insights.com;",
                    }
                ],
            },
        ];
    },
};

module.exports = nextConfig;

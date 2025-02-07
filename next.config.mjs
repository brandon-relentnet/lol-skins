/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.leagueoflegends.com',
                port: '',
                search: '',
            },
        ],
    },
};

export default nextConfig;

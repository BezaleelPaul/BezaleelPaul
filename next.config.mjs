/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  allowedDevOrigins: ['192.168.1.14', 'localhost', '127.0.0.1'],
  ...(isGitHubPages ? { basePath: '/Testingwebsite-' } : {}),
  env: { NEXT_PUBLIC_SITE_BASE_PATH: isGitHubPages ? '/Testingwebsite-' : '' },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

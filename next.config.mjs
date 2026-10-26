/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: "/case-studies",
        destination: "/stories",
        permanent: true,
      },
      {
        source: "/team",
        destination: "/creators",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/join",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

/** @type {import("next").NextConfig} */
const nextConfig = () => {
  return {
    reactStrictMode: true,
    // images: {
    //   remotePatterns: [
    //     {
    //       protocol: 'https',
    //       hostname: 'mdbcdn.b-cdn.net/img/new/avatars/2.webp',
    //       port: '',
    //       pathname: '/account123/**',
    //     },
    //   ],
    // },
    // basePath: "/dashboard"
    // async rewrites() {
    //   return [
    //     {
    //       source: "/",
    //       destination: "/welcome/first-post"
    //     }
    //   ];
    // }
  };
};


module.exports = () => nextConfig();

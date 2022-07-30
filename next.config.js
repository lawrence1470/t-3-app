/** @type {import("next").NextConfig} */
const nextConfig = () => {
  return {
    reactStrictMode: true,
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

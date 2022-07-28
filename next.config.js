/** @type {import("next").NextConfig} */
const nextConfig = () => {
  return {
    reactStrictMode: true
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

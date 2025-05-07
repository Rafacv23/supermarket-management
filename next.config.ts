// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  reactStrictMode: true, // This ends up in the wrong place!
}

module.exports = withPWA(nextConfig)

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
})

module.exports = withPWA({
  reactStrictMode: true,
})

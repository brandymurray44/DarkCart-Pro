import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
};

export default withSentryConfig(nextConfig, {
  silent: true,
  hideSourceMaps: true,
});

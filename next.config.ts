import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Emits .next/standalone with a minimal server.js and only the traced node_modules,
   * so the runtime image does not need an install step.
   *
   * Chosen over `output: "export"` because a static export supports no non-GET route
   * handlers, which would push the contact form to a third-party endpoint — adding an
   * origin we do not control to sites whose entire selling point is that we control
   * the technical surface. It also keeps next/image optimisation, which is worth real
   * mobile Lighthouse points on an image-heavy brochure site.
   */
  output: "standalone",

  /**
   * Serves the site under a path, e.g. BASE_PATH=/demos/dental, for hosting a demo
   * behind another origin. Read at build time like CLIENT_ID; set NEXT_PUBLIC_SITE_URL
   * to the full URL including the path so canonicals match. robots.txt and llms.txt
   * then sit under the path too, where crawlers don't look for them, so a client's
   * real site still gets its own origin.
   */
  basePath: process.env.BASE_PATH || undefined,

  /**
   * Mixed trailing slashes are a self-inflicted duplicate-content bug: /services and
   * /services/ become two URLs with the same content. Fixed here, asserted by the audit.
   */
  trailingSlash: false,

  /** Surfaces sloppy effects and unsafe lifecycles in development only. */
  reactStrictMode: true,

  /**
   * The build fails on a type error rather than shipping one. There is no matching
   * `eslint` key any more: Next 16 removed `next lint`, so linting is a separate CI
   * step invoking the ESLint CLI against the flat config.
   */
  typescript: { ignoreBuildErrors: false },

  poweredByHeader: false,
};

export default nextConfig;

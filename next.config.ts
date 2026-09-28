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

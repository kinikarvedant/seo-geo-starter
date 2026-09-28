# One Dockerfile, one image per client.
#
# CLIENT_ID and NEXT_PUBLIC_SITE_URL are BUILD arguments, not runtime environment.
# Next inlines NEXT_PUBLIC_* at build time, so an image built for one origin has that
# origin baked into every canonical URL, sitemap entry and llms.txt link. Reusing a
# single image across clients would ship the wrong canonicals everywhere — which is
# exactly why the config is selected at build time and each client gets its own image.

FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-bookworm-slim AS builder
WORKDIR /app
ARG CLIENT_ID=dental
ARG NEXT_PUBLIC_SITE_URL
ENV CLIENT_ID=$CLIENT_ID \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-bookworm-slim AS runner
WORKDIR /app

# CLIENT_ID must be set in the runtime stage too, not just the builder.
# It is not a NEXT_PUBLIC_* variable, so it is never inlined: src/config/load.ts reads
# process.env.CLIENT_ID every time the module is evaluated, which includes inside this
# container. Unset, it silently falls back to the default client — so the cafe image
# would serve the dental clinic's phone number from any on-demand route.
ARG CLIENT_ID=dental
ENV NODE_ENV=production \
    CLIENT_ID=$CLIENT_ID \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

# Unprivileged runtime user.
RUN useradd --uid 10001 --create-home nextjs

# Owned by the runtime user: standalone ships no .next/cache, so Next creates it on
# first request. Root-owned copies would make that mkdir fail and silently disable the
# next/image optimisation cache this image exists to keep.
# server.js does not copy public/ or .next/static itself — see next docs on standalone.
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]

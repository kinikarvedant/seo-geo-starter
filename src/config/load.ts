import { z } from "zod";
import { clientConfigSchema, type ClientConfig } from "./schema";
import { registry, type ClientId } from "@/clients/registry";

/**
 * Which client this build is for. Baked at build time, never read per request:
 * the prerendered HTML *is* the product, so one image serves exactly one client.
 */
const DEFAULT_CLIENT: ClientId = "dental";

function resolveClientId(raw: string | undefined): ClientId {
  const id = (raw ?? DEFAULT_CLIENT) as ClientId;
  // Object.hasOwn, not `in`: `in` walks the prototype chain, so CLIENT_ID=toString
  // would pass this guard and then hand a Function to the schema parser, producing a
  // wall of Zod issues instead of "Unknown CLIENT_ID".
  if (!Object.hasOwn(registry, id)) {
    throw new Error(
      `Unknown CLIENT_ID "${id}". Known clients: ${Object.keys(registry).join(", ")}`,
    );
  }
  return id;
}

/**
 * The override is validated with the same rule as the config's own origin.
 *
 * Skipping this is worse than it sounds: `htps://site.example` (one missing t) is a
 * perfectly legal URL as far as `new URL()` is concerned, so the build would succeed
 * and bake the typo into metadataBase, every canonical, every sitemap entry and
 * llms.txt. A scheme-less value crashes later with a bare "Invalid URL" instead.
 */
const originSchema = z.url({ protocol: /^https?$/ }).transform((u) => u.replace(/\/+$/, ""));

function resolveOrigin(raw: string | undefined): string | undefined {
  if (raw === undefined || raw === "") return undefined;

  const parsed = originSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is not a valid http(s) origin: "${raw}"\n` +
        parsed.error.issues.map((i) => `  - ${i.message}`).join("\n"),
    );
  }
  return parsed.data;
}

/**
 * Parses the active client config, failing the build rather than a request.
 *
 * NEXT_PUBLIC_SITE_URL wins over the config's own `site.url` so the same source tree
 * can be built for a staging origin without editing config. It is inlined at build
 * time — reusing one image across origins would bake the wrong canonical into every
 * page, which is why each client gets its own image.
 */
export function loadClient(rawId = process.env.CLIENT_ID): ClientConfig {
  const id = resolveClientId(rawId);
  const parsed = clientConfigSchema.safeParse(registry[id]);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid config for client "${id}":\n${issues}`);
  }

  const override = resolveOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  const config = override
    ? { ...parsed.data, site: { ...parsed.data.site, url: override } }
    : parsed.data;

  return Object.freeze(config);
}

/** The active client. Module-level, so the config is parsed once per process. */
export const client = loadClient();

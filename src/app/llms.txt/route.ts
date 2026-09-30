import { client } from "@/config/load";
import { renderLlmsTxt } from "@/lib/geo/llms";

/**
 * Route handlers are dynamic by default in Next 16, so this is opted back into static
 * generation: the content is built entirely from config and cannot vary per request.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(renderLlmsTxt(client), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}

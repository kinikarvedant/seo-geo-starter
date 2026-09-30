import { client } from "@/config/load";
import { renderLlmsFullTxt } from "@/lib/geo/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(renderLlmsFullTxt(client), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}

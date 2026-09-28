/**
 * Container liveness probe. Deliberately dynamic: a prerendered health check would
 * report healthy from a cached response even if the process were wedged.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true });
}

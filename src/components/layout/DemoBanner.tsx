import { client } from "@/config/load";

/**
 * Every demo site says so, in the page, above the fold.
 *
 * These sites carry fabricated business names, addresses and phone numbers. Presenting
 * them as real would be dishonest to a visitor and actively harmful in local search —
 * fake NAP data can be picked up and matched against real business listings. The
 * config's `demo` flag also forces `noindex`, so this banner and the robots directive
 * are two halves of the same decision.
 */
export function DemoBanner() {
  if (!client.demo) return null;

  return (
    <div
      role="note"
      className="bg-brand-950 px-4 py-2 text-center text-sm text-white"
      data-demo-banner
    >
      <strong className="font-semibold">Demo site.</strong>{" "}
      <span className="text-white/80">
        {client.name} is a fictional business, built to show what this template produces. The
        address, phone number and reviews are invented.
      </span>
    </div>
  );
}

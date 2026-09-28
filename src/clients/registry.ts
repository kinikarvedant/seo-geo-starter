import type { ClientConfigInput } from "@/config/schema";

import { dental } from "./dental/client.config";
import { cafe } from "./cafe/client.config";
import { plumber } from "./plumber/client.config";

/**
 * Every client this template can be built for. `CLIENT_ID` selects one at build time.
 *
 * The three demos live here permanently: they are the showcase *and* the fixtures the
 * config layer is tested against. A real client gets its own directory alongside them,
 * or its own repo forked from this template.
 */
export const registry = {
  dental,
  cafe,
  plumber,
} as const satisfies Record<string, ClientConfigInput>;

export type ClientId = keyof typeof registry;

export const clientIds = Object.keys(registry) as ClientId[];

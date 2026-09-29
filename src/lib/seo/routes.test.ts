import { describe, expect, it } from "vitest";
import { clientConfigSchema } from "@/config/schema";
import { registry, clientIds } from "@/clients/registry";
import { allRoutes, areaServiceRoutes, routeFor } from "./routes";
import { absoluteUrl, hrefs } from "@/lib/linking/hrefs";

const configs = clientIds.map((id) => ({ id, config: clientConfigSchema.parse(registry[id]) }));

describe.each(configs)("route inventory: $id", ({ config }) => {
  const routes = allRoutes(config);

  it("produces no duplicate paths", () => {
    const paths = routes.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("starts every path with a slash and ends none with one", () => {
    for (const route of routes) {
      expect(route.path.startsWith("/")).toBe(true);
      if (route.path !== "/") expect(route.path.endsWith("/")).toBe(false);
    }
  });

  it("gives every route a unique title", () => {
    // Duplicate titles are the single most common finding in a site audit, and they
    // are always a generator bug rather than a content one.
    const titles = routes.map((r) => r.title);
    const seen = new Map<string, number>();
    for (const title of titles) seen.set(title, (seen.get(title) ?? 0) + 1);
    const dupes = [...seen.entries()].filter(([, n]) => n > 1);
    expect(dupes, dupes.map(([t]) => t).join("\n")).toEqual([]);
  });

  it("gives every route a unique description", () => {
    const descriptions = routes.map((r) => r.description);
    const seen = new Map<string, number>();
    for (const d of descriptions) seen.set(d, (seen.get(d) ?? 0) + 1);
    const dupes = [...seen.entries()].filter(([, n]) => n > 1);
    expect(dupes, dupes.map(([d]) => d.slice(0, 60)).join("\n")).toEqual([]);
  });

  it("keeps descriptions inside the length Google will render", () => {
    for (const route of routes) {
      expect(
        route.description.length,
        `${route.path}: ${route.description.length} chars`,
      ).toBeLessThanOrEqual(156);
      expect(route.description.length, `${route.path} is too thin`).toBeGreaterThanOrEqual(50);
    }
  });

  it("covers every service and every area exactly once", () => {
    const servicePaths = routes.filter((r) => r.kind === "service").map((r) => r.path);
    expect(servicePaths).toHaveLength(config.services.length);

    const areaPaths = routes.filter((r) => r.kind === "area").map((r) => r.path);
    expect(areaPaths).toHaveLength(config.serviceAreas.length);
  });

  it("emits an area-service page only where prose exists for that pair", () => {
    const expected = config.services.flatMap((s) =>
      s.areaPages.enabled ? Object.keys(s.areaPages.intros).map((a) => `${a}/${s.slug}`) : [],
    );
    const actual = areaServiceRoutes(config).map((r) => `${r.source!.area}/${r.source!.service}`);
    expect(actual.sort()).toEqual(expected.sort());
  });

  it("never invents an area-service page for a service with area pages disabled", () => {
    const disabled = new Set(
      config.services.filter((s) => !s.areaPages.enabled).map((s) => s.slug),
    );
    for (const route of areaServiceRoutes(config)) {
      expect(disabled.has(route.source!.service!)).toBe(false);
    }
  });

  it("is deterministic across calls", () => {
    expect(allRoutes(config)).toEqual(routes);
  });

  it("matches the href builders, so no component can link somewhere that is not a route", () => {
    const paths = new Set(routes.map((r) => r.path));
    expect(paths.has(hrefs.home())).toBe(true);
    expect(paths.has(hrefs.services())).toBe(true);
    expect(paths.has(hrefs.areas())).toBe(true);
    expect(paths.has(hrefs.about())).toBe(true);
    expect(paths.has(hrefs.contact())).toBe(true);
    expect(paths.has(hrefs.faq())).toBe(true);

    for (const service of config.services) {
      expect(paths.has(hrefs.service(service.slug))).toBe(true);
    }
    for (const area of config.serviceAreas) {
      expect(paths.has(hrefs.area(area.slug))).toBe(true);
    }
  });

  it("keeps sitemap priorities inside the valid range", () => {
    for (const route of routes) {
      expect(route.priority).toBeGreaterThan(0);
      expect(route.priority).toBeLessThanOrEqual(1);
    }
  });

  it("gives the home page top priority", () => {
    expect(routes.find((r) => r.kind === "home")!.priority).toBe(1);
  });
});

describe("routeFor", () => {
  const config = clientConfigSchema.parse(registry.dental);

  it("finds a route by path", () => {
    expect(routeFor(config, "/services").kind).toBe("services");
  });

  it("throws on a path that is not in the inventory", () => {
    expect(() => routeFor(config, "/nope")).toThrow(/No route in the inventory/);
  });
});

describe("absoluteUrl", () => {
  const origin = "https://bridgeroaddental.duckdns.org";

  it("returns the bare origin for the root", () => {
    expect(absoluteUrl(origin, "/")).toBe(origin);
  });

  it("joins a path without doubling slashes", () => {
    expect(absoluteUrl(origin, "/services/emergency-dentist")).toBe(
      `${origin}/services/emergency-dentist`,
    );
  });

  it("strips a trailing slash, matching trailingSlash: false", () => {
    expect(absoluteUrl(origin, "/services/")).toBe(`${origin}/services`);
  });

  it("refuses a path that is not rooted, rather than producing a broken URL", () => {
    expect(() => absoluteUrl(origin, "services")).toThrow(/rooted path/);
  });
});

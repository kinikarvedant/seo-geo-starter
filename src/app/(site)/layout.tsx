import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Chrome for every content page. Lives in a route group so that sitemap.ts, robots.ts
 * and llms.txt sit outside it without adding a URL segment — those are files, not pages,
 * and must not inherit a header and footer.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

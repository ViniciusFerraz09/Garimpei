import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/** Volta ao topo a cada navegação (evita abrir a página no meio do conteúdo). */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

export const SiteLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-background">
    <ScrollToTop />
    <AnnouncementBar />
    <SiteHeader />
    <main className="flex-1 pb-4">{children}</main>
    <SiteFooter />
  </div>
);

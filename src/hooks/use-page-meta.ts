import { useEffect } from "react";

import { siteConfig } from "@/lib/site-config";

interface PageMeta {
  title: string;
  description?: string;
  image?: string | null;
  /** Dados estruturados (JSON-LD) apenas com informações reais do produto. */
  jsonLd?: Record<string, unknown> | null;
}

const setMetaTag = (attribute: "name" | "property", key: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setJsonLd = (data: Record<string, unknown> | null) => {
  const existing = document.getElementById("garimpei-jsonld");
  if (existing) existing.remove();
  if (!data) return;

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "garimpei-jsonld";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

/** Atualiza título, descrição, Open Graph e JSON-LD da página atual. */
export const usePageMeta = ({ title, description, image, jsonLd }: PageMeta) => {
  useEffect(() => {
    const resolvedTitle = title.includes(siteConfig.name)
      ? title
      : `${title} | ${siteConfig.name}`;
    const resolvedDescription = description ?? siteConfig.description;

    document.title = resolvedTitle;
    setMetaTag("name", "description", resolvedDescription);
    setMetaTag("property", "og:title", resolvedTitle);
    setMetaTag("property", "og:description", resolvedDescription);
    setMetaTag("property", "og:type", jsonLd ? "product" : "website");
    if (image) setMetaTag("property", "og:image", image);
    setJsonLd(jsonLd ?? null);

    return () => {
      setJsonLd(null);
    };
  }, [title, description, image, jsonLd]);
};

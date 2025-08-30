import { useEffect } from "react";

type SEOProps = {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  robots?: string; // e.g., "index,follow" or "noindex,nofollow"
  canonical?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  publishedTime?: string; // ISO string for og:article:published_time
  modifiedTime?: string; // ISO string for og:article:modified_time
};

function setMetaByName(name: string, content: string, marker: string) {
  let tag = document.head.querySelector(`meta[name='${name}']`) as
    | HTMLMetaElement
    | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
  tag.setAttribute("data-managed-seo", marker);
}

function setMetaByProperty(property: string, content: string, marker: string) {
  let tag = document.head.querySelector(`meta[property='${property}']`) as
    | HTMLMetaElement
    | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
  tag.setAttribute("data-managed-seo", marker);
}

function setLink(rel: string, href: string, marker: string) {
  let tag = document.head.querySelector(`link[rel='${rel}']`) as
    | HTMLLinkElement
    | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
  tag.setAttribute("data-managed-seo", marker);
}

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  robots,
  canonical,
  jsonLd,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  useEffect(() => {
    const marker = "true";
    const brand = "ROCKTOP Premium Events";
    const fullTitle = title.includes("ROCKTOP") ? title : `${title} — ${brand}`;
    const currentUrl = url || window.location.href;
    const canonicalUrl = canonical || currentUrl;
    const imageUrl = image || "/favicon.ico";

    // Clean previously managed SEO tags
    const previous = Array.from(
      document.head.querySelectorAll("[data-managed-seo='true']")
    );
    previous.forEach((el) => el.parentElement?.removeChild(el));

    // Title
    document.title = fullTitle;

    // Basic meta
    if (description) setMetaByName("description", description, marker);
    setMetaByName("robots", robots || "index,follow", marker);
    setLink("canonical", canonicalUrl, marker);

    // Open Graph
    setMetaByProperty("og:title", fullTitle, marker);
    setMetaByProperty("og:site_name", brand, marker);
    if (description) setMetaByProperty("og:description", description, marker);
    setMetaByProperty("og:type", type, marker);
    setMetaByProperty("og:url", currentUrl, marker);
    setMetaByProperty("og:image", imageUrl, marker);
    if (publishedTime)
      setMetaByProperty("article:published_time", publishedTime, marker);
    if (modifiedTime)
      setMetaByProperty("article:modified_time", modifiedTime, marker);

    // Twitter
    setMetaByName("twitter:card", "summary_large_image", marker);
    setMetaByName("twitter:title", fullTitle, marker);
    if (description) setMetaByName("twitter:description", description, marker);
    setMetaByName("twitter:image", imageUrl, marker);

    // Structured data JSON-LD
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-managed-seo", marker);
      const data = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    }

    return () => {
      const managed = Array.from(
        document.head.querySelectorAll("[data-managed-seo='true']")
      );
      managed.forEach((el) => el.parentElement?.removeChild(el));
    };
  }, [
    title,
    description,
    image,
    url,
    type,
    robots,
    canonical,
    JSON.stringify(jsonLd),
    publishedTime,
    modifiedTime,
  ]);

  return null;
}

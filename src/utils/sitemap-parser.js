import { INVALID_SITEMAP_URL_ERROR } from "../errors/invalid-sitemap-url-error.js";

export async function fetchContentFromSitemap(sitemapURL) {
  try {
    const response = await fetch(sitemapURL);

    if (!response.ok) {
      throw new INVALID_SITEMAP_URL_ERROR();
    }

    return await response.text();
  } catch (error) {
    throw new INVALID_SITEMAP_URL_ERROR();
  }
}

export function parseSitemap(sitemapContent) {
  const urls = extractURLsFromSitemap(sitemapContent);
  return urls;
}

export function extractURLsFromSitemap(XMLContent) {
  const regex = /<loc>(.*?)<\/loc>/g;
  return Array.from(XMLContent.matchAll(regex), (match) => match[1]);
}

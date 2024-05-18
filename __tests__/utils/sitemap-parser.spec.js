import { deepEqual, deepStrictEqual, ok, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { INVALID_SITEMAP_URL_ERROR } from "../../src/errors/invalid-sitemap-url-error.js";
import {
  fetchContentFromSitemap,
  parseSitemap,
} from "../../src/utils/sitemap-parser.js";

describe("Sitemap parser test suit", () => {
  it("should fails when it receives an invalid sitemap URL", async () => {
    const address = "https://invalid-sitemap-address/sitemap.xml";

    try {
      await fetchContentFromSitemap(address);
    } catch (error) {
      deepEqual(error instanceof INVALID_SITEMAP_URL_ERROR, true);
    }
  });

  it("should return xml content when it receives a valid sitemap URL", async () => {
    const address = "https://webmotors.com.br/wm1/sitemap-news.xml";

    const response = await fetchContentFromSitemap(address);
    ok(response);
  });

  it("should extract URLs from sitemap XML content when the content is valid", () => {
    const sitemapContent = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://example.com/content-1</loc>
        </url>
        <url>
          <loc>https://example.com/content-2</loc>
        </url>
      </urlset>
    `;

    const parsedUrls = parseSitemap(sitemapContent);
    deepStrictEqual(parsedUrls, [
      "https://example.com/content-1",
      "https://example.com/content-2",
    ]);
  });

  it("should handle sitemap content with no URLs", () => {
    const sitemapContent = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      </urlset>
    `;

    const parsedUrls = parseSitemap(sitemapContent);
    strictEqual(parsedUrls.length, 0);
  });
});

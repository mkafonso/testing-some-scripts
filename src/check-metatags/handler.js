import { once } from "node:events";
import {
  fetchContentFromSitemap,
  parseSitemap,
} from "../utils/sitemap-parser.js";

export async function checkMetatagsHandler(request, response) {
  const data = await once(request, "data");
  const { sitemapUrl, requiredMetatags } = JSON.parse(data);

  const sitemapContent = await fetchContentFromSitemap(sitemapUrl);
  const availableUrls = parseSitemap(sitemapContent);

  console.log(availableUrls);

  response.end();
}

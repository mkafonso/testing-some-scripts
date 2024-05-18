import { once } from "node:events";
import { pipeline } from "node:stream";
import { Readable } from "stream";
import {
  fetchContentFromSitemap,
  parseSitemap,
} from "../utils/sitemap-parser.js";
import { checkMetatagProcessor } from "./check-metatag-processor.js";
import { resultCollector } from "./result-collector.js";

export async function checkMetatagsHandler(request, response) {
  const data = await once(request, "data");
  const { sitemapUrl, requiredMetatags } = JSON.parse(data);

  const sitemapContent = await fetchContentFromSitemap(sitemapUrl);
  const availableUrls = parseSitemap(sitemapContent);

  const urlStream = Readable.from(availableUrls);
  const processor = checkMetatagProcessor(requiredMetatags);

  const { results, collectResults } = resultCollector();

  response.writeHead(200, { "Content-Type": "application/json" });

  pipeline(urlStream, processor, collectResults, (err) => {
    if (err) {
      console.error("Pipeline failed", err);
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({
          error: true,
          status: 500,
          message: "Error processing URLs",
        })
      );
      return;
    }

    const missingTags = results.filter((result) => result.status === "missing");
    response.end(
      JSON.stringify({
        error: false,
        status: 200,
        message:
          missingTags.length > 0
            ? "Some links of the sitemap are missing the required metatags"
            : "Every link of the sitemap has the required metatags",
        results: missingTags,
      })
    );
  });
}

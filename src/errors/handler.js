import { INVALID_SITEMAP_URL_ERROR } from "./invalid-sitemap-url-error.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof INVALID_SITEMAP_URL_ERROR) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: true,
        code: "INVALID_SITEMAP_URL_ERROR",
        action: "Try using a different sitemapURL",
      })
    );
    return;
  }

  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      error: true,
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    })
  );
}

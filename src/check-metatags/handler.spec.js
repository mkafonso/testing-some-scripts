import { after, before, describe, it } from "node:test";
import { makeRequest } from "../utils/make-request.js";

const BASE_URL = "http://localhost:8080";

describe("CheckMetatags test suit", () => {
  let _server = {};

  before(async () => {
    _server = (await import("../server.js")).app;

    await new Promise((resolve) => _server.once("listening", resolve));
  });

  after((done) => _server.close(done));

  it("should receive valid inputs", async () => {
    const input = {
      sitemapUrl: "https://webmotors.com.br/wm1/sitemap-news.xml",
      requiredMetatags: ["title"],
    };

    // test if required metatags is one of the known metatags

    const data = await makeRequest(`${BASE_URL}/check-metatags`, input);
    // deepStrictEqual(data.error, false);
    // deepStrictEqual(data.status, 200);
    // deepStrictEqual(
    //   data.message,
    //   "every link of the sitemap has the required metatags"
    // );
  });
});

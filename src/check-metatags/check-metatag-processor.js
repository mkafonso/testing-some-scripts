import puppeteer from "puppeteer";
import { Transform } from "stream";

export function checkMetatagProcessor(requiredMetatags) {
  return new Transform({
    objectMode: true,
    async transform(url, _encoding, callback) {
      try {
        const result = await checkMetatags(url, requiredMetatags);
        this.push(JSON.stringify(result));
        callback();
      } catch (error) {
        callback(error);
      }
    },
  });
}

async function checkMetatags(url, requiredMetatags) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.content();

  const pageMetatags = await page.evaluate(() => {
    const metatags = {};

    document.querySelectorAll("meta").forEach((tag) => {
      const name = tag.getAttribute("name") || tag.getAttribute("property");
      const content = tag.getAttribute("content");
      if (name && content) {
        metatags[name.toLowerCase()] = content.toLowerCase();
      }
    });

    const title = document.querySelector("title")?.innerText.toLowerCase();

    const headingCounts = {};
    ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tagName) => {
      headingCounts[tagName] = document.querySelectorAll(tagName).length;
    });

    return { metatags, title, headingCounts };
  });

  await browser.close();

  const missingMetatags = requiredMetatags.filter((tag) => {
    if (tag.toLowerCase() === "title") {
      return !pageMetatags.title;
    }
    return !(tag.toLowerCase() in pageMetatags.metatags);
  });

  const headingErrors = requiredMetatags
    .filter((tag) => tag.toLowerCase().startsWith("h"))
    .filter((tagName) => !(tagName.toLowerCase() in pageMetatags.headingCounts))
    .map((tagName) => `Missing <${tagName}> tag.`);

  return {
    url,
    status:
      missingMetatags.length > 0 || headingErrors.length > 0
        ? "missing"
        : "complete",
    missing_metatags: missingMetatags,
    heading: headingErrors.length > 0 ? headingErrors : undefined,
  };
}

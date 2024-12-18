import puppeteer from "puppeteer";

export async function getPageContent(page_url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'light' }
  ]);


  // Enable request interception
  await page.setRequestInterception(true);

  // Intercept and block the specific JS resource
  page.on("request", (request) => {
    const blockedUrl = "https://www.sbab.se/static/consent-management-app/bundle.js?v=20241029__0";
    if (request.url() === blockedUrl) {
      request.abort(); // Block the request
    } else {
      request.continue(); // Allow other requests
    }
  });

  await page.goto(page_url, { waitUntil: "networkidle0" });
  const screenshot = await page.screenshot({ fullPage: true, path: "./screenshots/screenshot.jpg" });
  const title = await page.title();
  await browser.close();

  return { screenshot, title };
}

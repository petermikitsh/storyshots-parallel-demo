import "./preview";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import puppeteer from "puppeteer";

expect.extend({ toMatchImageSnapshot });

const noop = () => undefined;
const asyncNoop = () => Promise.resolve(undefined);

export function testCsf(storyMeta) {
  /** @type {import('@storybook/addon-storyshots-puppeteer').ImageSnapshotConfig } */
  const config = {
    storybookUrl: "http://localhost:6006",
    chromeExecutablePath:
      process.env.SB_CHROMIUM_PATH || "/usr/local/bin/chrome",
    getGotoOptions: noop,
    customizePage: asyncNoop,
    getCustomBrowser: async function () {
      // add some options "no-sandbox" to make it work properly on some Linux systems as proposed here: https://github.com/Googlechrome/puppeteer/issues/290#issuecomment-322851507
      const browser = await puppeteer.launch({
        args: [
          "--no-sandbox ",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
        executablePath: config.chromeExecutablePath,
      });
      return browser;
    },
    setupTimeout: 15000,
    testTimeout: 15000,
    getMatchOptions: noop,
    // We consider taking the full page is a reasonable default.
    getScreenshotOptions: () => ({ fullPage: true, encoding: "base64" }),
    beforeScreenshot: noop,
    afterScreenshot: noop,
    suite: "storyshots",
    ...global.imageSnapshotOpts,
  };

  describe(config.suite, () => {
    const { id: firstStoryId } = storyMeta[Object.keys(storyMeta)[0]];
    const [kind] = firstStoryId.split("--");
    describe(kind, () => {
      // Reuse browser and page for each storybook file
      let browser;
      let page;

      beforeAll(async () => {
        browser = await config.getCustomBrowser();
        page = await browser.newPage();
      });

      afterAll(async () => {
        await page.close();
        await browser.close();
      });

      Object.values(storyMeta).forEach(({ id, name: ExportName }) => {
        const [, story] = id.split("--");

        it(ExportName, async () => {
          expect.hasAssertions();

          const options = {
            context: {
              kind,
              story,
              parameters: {},
            },
            url: `${config.storybookUrl}iframe.html?id=${id}`,
          };

          await page.goto(options.url, config.getGotoOptions(options));
          const element = await config.beforeScreenshot(page, options);
          const image = await (element || page).screenshot(
            config.getScreenshotOptions(options)
          );
          await config.afterScreenshot({ image, context: options.context });
          expect(image).toMatchImageSnapshot(config.getMatchOptions(options));
        });
      });
    });
  });
}

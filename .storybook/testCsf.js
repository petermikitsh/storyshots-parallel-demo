import "./preview";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import puppeteer from "puppeteer";
import { sanitize } from "@storybook/csf";
import { paramCase } from "change-case";

expect.extend({ toMatchImageSnapshot });

function matches(storyKey, arrayOrRegex) {
  if (Array.isArray(arrayOrRegex)) {
    return arrayOrRegex.includes(storyKey);
  }

  return storyKey.match(arrayOrRegex);
}

const noop = () => undefined;
const asyncNoop = () => Promise.resolve(undefined);

export function testCsf(
  { default: defaultExport, ...otherExports },
  storyMeta
) {
  if (!defaultExport) {
    throw new Error("Story file not in CSF, please fix!");
  }

  const {
    args: componentArgs,
    decorators: componentDecorators = [],
    excludeStories = [],
    includeStories,
  } = defaultExport;

  let storyEntries = Object.entries(otherExports);
  if (includeStories) {
    storyEntries = storyEntries.filter(([storyKey]) =>
      matches(storyKey, includeStories)
    );
  }

  if (excludeStories) {
    storyEntries = storyEntries.filter(
      ([storyKey]) => !matches(storyKey, excludeStories)
    );
  }

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

      storyEntries
        .filter(
          ([exportName]) =>
            !(Array.isArray(excludeStories)
              ? excludeStories.includes(exportName)
              : exportName.matches(excludeStories))
        )
        .forEach(([exportName, exported]) => {
          const name = exported.story?.name || exported.storyName || exportName;
          it(name, async () => {
            expect.hasAssertions();

            const { id } = storyMeta[exportName];
            const [, story] = id.split("--");

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

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
  firstFileNameSegment
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

  storyEntries
    .filter(
      ([exportName]) =>
        !(Array.isArray(excludeStories)
          ? excludeStories.includes(exportName)
          : exportName.matches(excludeStories))
    )
    .forEach(([exportName, exported]) => {
      it(exported.story?.name || exported.storyName || exportName, async () => {
        expect.hasAssertions();

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
          ...global.imageSnapshotOpts,
        };

        const finalStoryKind = sanitize(
          paramCase(defaultExport.title || firstFileNameSegment)
        );

        const finalStoryName = sanitize(
          paramCase(exported.story?.name || exported.storyName || exportName)
        );

        const finalStoryID = `${finalStoryKind}--${finalStoryName}`;

        const options = {
          context: {
            kind: finalStoryKind,
            story: finalStoryName,
            parameters: {},
          },
          url: `${config.storybookUrl}iframe.html?id=${finalStoryID}`,
        };

        const browser = await config.getCustomBrowser();
        const page = await browser.newPage();
        await page.goto(options.url, config.getGotoOptions(options));
        const element = await config.beforeScreenshot(page, options);
        const image = await (element || page).screenshot(
          config.getScreenshotOptions(options)
        );
        await config.afterScreenshot({ image, context: options.context });
        // cleanup
        await page.close();
        await browser.close();
        // end clean up
        expect(image).toMatchImageSnapshot(config.getMatchOptions(options));
      });
    });
}

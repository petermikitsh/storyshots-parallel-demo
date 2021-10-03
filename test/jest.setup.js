import puppeteer from "puppeteer";

/** @type {import('@storybook/addon-storyshots-puppeteer').ImageSnapshotConfig } */
global.imageSnapshotOpts = {
  getCustomBrowser: () => {
    console.log("Connecting to Browserless puppeteer...");

    const instance = puppeteer.connect({
      browserURL: `http://localhost:${process.env.BROWSERLESS_PORT}`,
    });

    instance.then(() => {
      console.log("Browserless puppeteer connected.");
    });

    return Promise.resolve(instance);
  },
  beforeScreenshot: (page, { context, url }) => {
    console.log("url is", url);
  },
  storybookUrl: `http://host.docker.internal:${process.env.STORYBOOK_PORT}/`,
};

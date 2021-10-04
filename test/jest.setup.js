import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

/** @type {import('@storybook/addon-storyshots-puppeteer').ImageSnapshotConfig } */
global.imageSnapshotOpts = {
  getCustomBrowser: () => {
    // console.log("Connecting to Browserless puppeteer...");

    const instance = puppeteer.connect({
      // browserURL: `http://localhost:${process.env.BROWSERLESS_PORT}`,
      // instead of local puppeteer, use the cloud!
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
    });

    // instance.then(() => {
    //   console.log("Browserless puppeteer connected.");
    // });

    return Promise.resolve(instance);
  },
  beforeScreenshot: (page, { context, url }) => {
    // console.log("url is", url);
  },

  // storybookUrl: `http://host.docker.internal:${process.env.STORYBOOK_PORT}/`,
  // instead of local storybook, use the cloud!
  storybookUrl: `https://petermikitsh.github.io/storyshots-parallel-demo/`,
};

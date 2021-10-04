const { transform } = require("@babel/core");
const { loadCsf } = require("@storybook/csf-tools");
const { inspect } = require("util");
// Take each *.stories.tsx file and add the test code to it
// If you change this file, be sure to run jest with "--no-cache" to see the changes!
module.exports = {
  process(src, filename) {
    const storyMeta = loadCsf(src).parse()._stories;
    const storyMetaSerialized = inspect(storyMeta, {
      compact: true,
      breakLength: Infinity,
    });

    const runTestCode = filename.indexOf("stories.") > -1;
    const resolvedSrc = runTestCode
      ? `require('${__dirname}/testCsf').testCsf(${storyMetaSerialized});`
      : src;

    const result = transform(resolvedSrc, {
      filename,
      presets: [
        [
          "@babel/preset-env",
          // needed for async/await support
          { modules: "commonjs", useBuiltIns: "usage", corejs: "3" },
        ],
        "@babel/preset-typescript",
        "@babel/preset-react",
      ],
    });

    return result ? result.code : src;
  },
};

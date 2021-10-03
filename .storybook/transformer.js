const { transform } = require("@babel/core");

// Take each *.stories.tsx file and add the test code to it
// If you change this file, be sure to run jest with "--no-cache" to see the changes!
module.exports = {
  process(src, filename) {
    const addTestCode = filename.indexOf("stories.") > -1;
    const resolvedSrc = addTestCode
      ? `
${src}
if (!require.main) {
  require('${__dirname}/testCsf').testCsf(module.exports);
}`
      : src;

    const result = transform(resolvedSrc, {
      filename,
      presets: [
        ["@babel/preset-env", { modules: "auto" }],
        "@babel/preset-typescript",
        "@babel/preset-react",
      ],
    });

    return result ? result.code : src;
  },
};

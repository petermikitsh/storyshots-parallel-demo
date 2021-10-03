const fs = require("fs");

const getContent = (index) => {
  return `import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Page } from "./Page";
import * as HeaderStories from "./Header.stories";

export default {
  title: "Example/Page${index}",
  component: Page,
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = (args) => <Page {...args} />;

export const LoggedIn${index} = Template.bind({});
LoggedIn${index}.args = {
  // More on composing args: https://storybook.js.org/docs/react/writing-stories/args#args-composition
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut${index} = Template.bind({});
LoggedOut${index}.args = {
  ...HeaderStories.LoggedOut.args,
};`;
};

for (let i = 1; i <= 500; i++) {
  fs.writeFile(`stories/Page${i}.stories.tsx`, getContent(i), (err) => {
    if (err) {
      console.log(err);
    }
  });
}

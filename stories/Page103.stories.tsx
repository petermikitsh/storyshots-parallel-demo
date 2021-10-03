import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Page } from "./Page";
import * as HeaderStories from "./Header.stories";

export default {
  title: "Example/Page103",
  component: Page,
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = (args) => <Page {...args} />;

export const LoggedIn103 = Template.bind({});
LoggedIn103.args = {
  // More on composing args: https://storybook.js.org/docs/react/writing-stories/args#args-composition
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut103 = Template.bind({});
LoggedOut103.args = {
  ...HeaderStories.LoggedOut.args,
};
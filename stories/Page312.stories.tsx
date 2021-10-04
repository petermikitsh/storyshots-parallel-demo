import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Page } from "./Page";
import * as HeaderStories from "./Header.stories";

export default {
  title: "Example/Page312",
  component: Page,
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = (args) => <Page {...args} />;

export const LoggedIn312 = Template.bind({});
LoggedIn312.args = {
  // More on composing args: https://storybook.js.org/docs/react/writing-stories/args#args-composition
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut312 = Template.bind({});
LoggedOut312.args = {
  ...HeaderStories.LoggedOut.args,
};
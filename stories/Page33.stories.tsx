import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Page } from "./Page";
import * as HeaderStories from "./Header.stories";

export default {
  title: "Example/Page33",
  component: Page,
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = (args) => <Page {...args} />;

export const LoggedIn33 = Template.bind({});
LoggedIn33.args = {
  // More on composing args: https://storybook.js.org/docs/react/writing-stories/args#args-composition
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut33 = Template.bind({});
LoggedOut33.args = {
  ...HeaderStories.LoggedOut.args,
};
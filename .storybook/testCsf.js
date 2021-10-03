import React from "react";
import renderer from "react-test-renderer";
import "./preview";

import { defaultDecorateStory } from "@storybook/client-api";

function matches(storyKey, arrayOrRegex) {
  if (Array.isArray(arrayOrRegex)) {
    return arrayOrRegex.includes(storyKey);
  }

  return storyKey.match(arrayOrRegex);
}

export function smokeTestStory(Component, args) {
  const storyElement = <Component {...args} />;
  const result = renderer.create(storyElement, {
    createNodeMock(element) {
      if (element.type === "iframe") {
        return {
          addEventListener: jest.fn(),
          contentWindow: {
            postMessage: jest.fn(),
          },
        };
      }
      if (element.type === "code") {
        return { noHighlight: true };
      }
      // react-test-renderer doesn't support refs, which means you can't do stuff like this.refs.foo.focus()
      // Return fake elements to handle that:
      let klass = element.props && element.props.className;
      if (klass && klass.match(/white-lightbox-auth/)) {
        return { focus: () => null };
      }
      return null;
    },
  });
  expect(result.toJSON()).toMatchSnapshot();
}

export function testCsf({ default: defaultExport, ...otherExports }) {
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
      it(exported.story?.name || exported.storyName || exportName, () => {
        const Component = defaultDecorateStory(exported, [
          // ...globalDecorators,
          ...componentDecorators,
        ]);
        smokeTestStory(Component, {
          // ...globalArgs,
          ...componentArgs,
          ...exported.args,
        });
      });
    });
}

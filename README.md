# storyshots-parallel-demo

Run storyshots in parallel (as opposed to sequentially).

Requires `yarn`, and `nvm` is recommended.

```sh
nvm use # or use Node v14.15.4
yarn install
yarn test
```

### Results

1008 snapshots in 4 minutes, ~4.20 snapshots per second (2019 MBP).

```
Snapshot Summary
 › 1008 snapshots written from 503 test suites.

Test Suites: 503 passed, 503 total
Tests:       1008 passed, 1008 total
Snapshots:   1008 written, 1008 total
Time:        239.641 s, estimated 251 s
```

[Prior Art](https://github.com/jdelStrother/storybook/compare/b2eebbb5801bdb833916fdd6efedcee2a11cf253...5259806c4f4e6c172687b7532dcd891ccd58874d)

https://github.com/storybookjs/storybook/issues/7863#issuecomment-770231597

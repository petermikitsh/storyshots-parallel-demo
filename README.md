# storyshots-parallel-demo

Companion repo: https://github.com/petermikitsh/storyshots-sequential-demo

Run storyshots in parallel (as opposed to sequentially).

Requires `yarn`, and `nvm` is recommended.

```sh
nvm use # or use Node v14.15.4
yarn install
yarn test
```

### Results (Generating baseline from scratch)

1008 snapshots in 4 minutes, ~4.20 snapshots per second (2019 MBP).

```
Snapshot Summary
 › 1008 snapshots written from 503 test suites.

Test Suites: 503 passed, 503 total
Tests:       1008 passed, 1008 total
Snapshots:   1008 written, 1008 total
Time:        239.641 s, estimated 251 s
```

### [Lite Mode Results](https://github.com/petermikitsh/storyshots-parallel-demo/commit/6c264ff07ab2b83f309464c330803a9ef9136f8e)

Lite Mode tosses out the raw CSF code, so you can't use it in test execution. This approach involves passing the needed metadata to the `testCsf` function, which is obtained by parsing done in `transformer.js` (the real heavy lifting is in `@storybook/csf-tools`).

An insignificant change in performance was observed.

#### Generating baseline from scratch

```
Snapshot Summary
 › 1008 snapshots written from 503 test suites.

Test Suites: 503 passed, 503 total
Tests:       1008 passed, 1008 total
Snapshots:   1008 written, 1008 total
Time:        232.319 s
```

#### Verifying against an existing baseline

```
Test Suites: 503 passed, 503 total
Tests:       1008 passed, 1008 total
Snapshots:   1008 passed, 1008 total
Time:        258.38 s
```

[Prior Art](https://github.com/jdelStrother/storybook/compare/b2eebbb5801bdb833916fdd6efedcee2a11cf253...5259806c4f4e6c172687b7532dcd891ccd58874d)

https://github.com/storybookjs/storybook/issues/7863#issuecomment-770231597

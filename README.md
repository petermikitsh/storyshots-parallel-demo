# storyshots-parallel-demo

Companion repo: https://github.com/petermikitsh/storyshots-sequential-demo

Run storyshots in parallel (as opposed to sequentially).

Requires `yarn`, and `nvm` is recommended.

```sh
nvm use # or use Node v14.15.4
yarn install
yarn test
```

### Strategy A: Results (Generating baseline from scratch)

> To repeat Strategy A, check out commit: https://github.com/petermikitsh/storyshots-parallel-demo/commit/ed54dc3a2f3b5dd45ac9f74e09255573622473e6

1008 snapshots in 4 minutes, ~4.20 snapshots per second (2019 MBP).

```
Snapshot Summary
 › 1008 snapshots written from 503 test suites.

Test Suites: 503 passed, 503 total
Tests:       1008 passed, 1008 total
Snapshots:   1008 written, 1008 total
Time:        239.641 s, estimated 251 s
```

### Strategy B: Results (No Docker / cloud services only)

🎉 I COULD NOT HEAR MY COMPUTER FANS WITH THIS STRATEGY (the emphasis was necessary) 🎉

> To repeat Strategy B:
>
> 1. At the repo root, create a `.env` file with a `BROWSERLESS_TOKEN` key. Get one at https://www.browserless.io/. Note that "Free accounts are limited to 10 concurrent sessions."
> 2. Checkout this commit: https://github.com/petermikitsh/storyshots-parallel-demo/commit/acd0c5a7a356138ffb2f266d65937e6dfdde07eb

Instead of spinning up Chrome and a static file server in locally running docker containers, use cloud services for both.

- Use browserless.io for Chrome/Puppeteer
- Use GitHub CDN for hosting built Storybook project

#### B: Generating baseline from scratch

Slightly more time than Strategy A.

Cost: This used 2,245 seconds (US $0.336) in Browserless computing power.

```
Snapshot Summary
 › 1008 snapshots written from 503 test suites.

Test Suites: 503 passed, 503 total
Tests:       1008 passed, 1008 total
Snapshots:   1008 written, 1008 total
Time:        279.229 s
```

#### B: Verifying against an existing baseline

Time is slightly higher than strategy A, but I had left a `console.log` statement in test code, which might explain the 15% performance decrease.

Costs: This used 2,211 seconds (US $0.33) in Browserless computing power.

```
Test Suites: 503 passed, 503 total
Tests:       1008 passed, 1008 total
Snapshots:   1008 passed, 1008 total
Time:        275.455 s
```

### Strategy C: Results

> To repeat Strategy C, checkout this commit: https://github.com/petermikitsh/storyshots-parallel-demo/commit/6c264ff07ab2b83f309464c330803a9ef9136f8e

Strategy C returns to the "run everything locally in docker containers" model.

Lite Mode tosses out the raw CSF code, so you can't use it in test execution. This approach involves passing the needed metadata to the `testCsf` function, which is obtained by parsing done in `transformer.js` (the real heavy lifting is in `@storybook/csf-tools`).

An insignificant change in performance was observed.

#### C: Generating baseline from scratch

```
Snapshot Summary
 › 1008 snapshots written from 503 test suites.

Test Suites: 503 passed, 503 total
Tests:       1008 passed, 1008 total
Snapshots:   1008 written, 1008 total
Time:        232.319 s
```

#### C: Verifying against an existing baseline

```
Test Suites: 503 passed, 503 total
Tests:       1008 passed, 1008 total
Snapshots:   1008 passed, 1008 total
Time:        258.38 s
```

[Prior Art](https://github.com/jdelStrother/storybook/compare/b2eebbb5801bdb833916fdd6efedcee2a11cf253...5259806c4f4e6c172687b7532dcd891ccd58874d)

https://github.com/storybookjs/storybook/issues/7863#issuecomment-770231597

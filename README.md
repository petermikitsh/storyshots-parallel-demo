# storyshots-parallel-demo

Companion repo: https://github.com/petermikitsh/storyshots-sequential-demo

Run storyshots in parallel (as opposed to sequentially).

Requires `yarn`, and `nvm` is recommended.

```sh
nvm use # or use Node v14.15.4
yarn install
yarn test
```

## High Level Summary

- I wrote **1,008 images** to my local filesystem in **85 seconds**.
- The bottleneck for quickly generating many screenshots is access to high-concurrency limits of Chrome browsers.
- Storyshots puppeteer, as currently implemented, isn't well equipped to parallelize stories. However, with jest transforms, it's possible to run each CSF-formatted story as it's own task, and parallelize those tasks.

As shown below, **Strategy B1** had the highest performance (paid cloud provider).

| Strategy | Description               | Time        | Max Parallel Tasks | Cloud Costs | Notes                                                           |
| -------- | ------------------------- | ----------- | ------------------ | ----------- | --------------------------------------------------------------- |
| A        | Local docker              | 239s        | 8                  | None        | Occasional socket hang up errors                                |
| B        | Free cloud services       | 279s        | 8                  | None        | Limited to max 10 concurrent sessions                           |
| B1 ⚡️   | Paid cloud services       | **85s** ⚡️ | 32                 | $0.33       | Max parallel tasks could safely increase for add'l time savings |
| C        | Local docker, no CSF Code | 232s        | 8                  | None        | Marginal performance increase                                   |

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

My fans were not noisy with this strategy!

> To repeat Strategy B:
>
> 1. At the repo root, create a `.env` file with a `BROWSERLESS_TOKEN` key. Get one at https://www.browserless.io/. Note that "Free accounts are limited to 10 concurrent sessions."
> 2. Checkout this commit: https://github.com/petermikitsh/storyshots-parallel-demo/commit/acd0c5a7a356138ffb2f266d65937e6dfdde07eb

Instead of spinning up Chrome and a static file server in locally running docker containers, use cloud services for both.

- Use browserless.io for Chrome/Puppeteer
- Use GitHub CDN for hosting [built Storybook project](https://petermikitsh.github.io/storyshots-parallel-demo/)

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

### ⚡️⚡️ Strategy B1: Results (No Local Docker / PAID cloud services) ⚡️⚡️

This option ALSO did not make my computer fans spin up.

> To repeat Strategy B1:
>
> 1. At the repo root, create a `.env` file with a `BROWSERLESS_TOKEN` key. Get one at https://www.browserless.io/. You MUST create a paid account to avoid low concurrency limits!
> 2. Checkout this commit: https://github.com/petermikitsh/storyshots-parallel-demo/commit/8a35302b0c8f3df4e5cfaf9c5c622cb7a118d7b1

This is (nearly) identical code-wise to B, but this time a paid Browserless plan is used. Paid plans are not restricted to the low concurrency limit of 10. Because we're offshoring the heavy lifting, we are running (in parallel) **double** the number of cores as tests (Tests are done on a 2019 MBP: 16 cores \* 2 = max 32 parallel tests).

#### B1: Generating baseline from scratch

Cost: This used 2,426 seconds (US $0.364) in Browserless computing power.

```
Snapshot Summary
 › 1008 snapshots written from 503 test suites.

Test Suites: 503 passed, 503 total
Tests:       1008 passed, 1008 total
Snapshots:   1008 written, 1008 total
Time:        85.873 s
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

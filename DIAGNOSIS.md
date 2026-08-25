# CI Failure Diagnosis

Baseline captured from GitHub Actions run [32814988374](https://github.com/laser069/ci-fix-drill/actions/runs/32814988374) (PR #1, `pull_request` trigger) and local `npx jest` output. Note: the workflow's `on.push.branches: ['*']` never actually fires for a branch name containing a slash (`fix/ci-pipeline-recovery`) — GitHub Actions glob `*` doesn't match across `/`, only `**` does. So plain `git push` on this branch triggers nothing; a `pull_request` event was needed to get any run at all. Worth noting even though it's not one of the three required failures below.

## Failure 1: `test` job — missing checkout, package.json not found

Step: `Run tests` (job `test`)

Log:
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/home/runner/work/ci-fix-drill/ci-fix-drill/package.json'
##[error]Process completed with exit code 254.
```

Cause: the `test` job has no `actions/checkout` step at all, so the runner's workspace is empty — no repo, no package.json, no node_modules. `npm test` fails before Jest even loads. Workflow file has this literally commented as `BUG 3` already.

## Failure 2: `test` job runs disconnected from `install` job

The `test` job has no `needs: install`, so it doesn't wait for (or reuse) the `install` job's output. Each job in a workflow gets a fresh, isolated runner — even if `install` had succeeded, `test` starts from scratch with nothing installed. Combined with Failure 1 (no checkout either), the `test` job is effectively running in a blank VM. Flagged in the workflow as `BUG 2`.

## Failure 3: `install` job uses `npm install` instead of `npm ci`, lockfile out of sync

Step: `Install dependencies` (job `install`) — passes today only because `npm install` tolerates a stale lockfile by silently rewriting it. Confirmed locally:

```
$ npm ci --dry-run
npm error code EUSAGE
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
npm error Missing: lodash@4.18.1 from lock file
```

Cause: `package-lock.json` doesn't match `package.json` (missing `lodash@4.18.1`). `npm install` masks this by installing whatever it wants and quietly updating the lock, which means CI isn't actually reproducible — a different install could pull a different dependency tree on different runs. `npm ci` is what's supposed to catch this and fails loudly instead, which it's currently not being given the chance to do.

## Failure 4: wrong assertion in `calculateDiscount.test.js`

Local run:
```
FAIL src/payments/calculateDiscount.test.js
  ● applies 10 percent discount correctly
    expect(received).toBe(expected)
    Expected: 100
    Received: 90
      at Object.toBe (src/payments/calculateDiscount.test.js:8:38)
```

Cause: `calculateDiscount(100, 10)` correctly returns 90 (100 minus 10%). The test asserts `.toBe(100)`, which is the un-discounted price — the test's expected value is wrong, not the function. Function is correct and should not change.

## Failure 5: wrong matcher in `formatCurrency.test.js`

Local run:
```
FAIL src/utils/formatCurrency.test.js
  ● formats currency correctly
    expect(received).toBe(expected)
    If it should pass with deep equality, replace "toBe" with "toStrictEqual"
    Expected: {"amount": 10.01, "currency": "USD"}
    Received: serializes to the same string
      at Object.toBe (src/utils/formatCurrency.test.js:5:41)
```

Cause: `toBe` uses `Object.is` (reference equality), which always fails for two different object instances even when their contents match. `formatCurrency` returns a new object each call, so this test can never pass with `toBe` no matter what the values are. The expected values themselves (`{amount: 10.01, currency: 'USD'}`) are correct — verified `(10.005).toFixed(2)` actually returns `"10.01"` in Node's float representation. Needs `toEqual` for structural comparison, not a function or expected-value change.

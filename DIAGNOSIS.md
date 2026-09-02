# CI Pipeline Failure Diagnosis

## Failure 1: Unreliable Dependency Install
**Step Name:** `Install dependencies` (in `install` job)
**Error/Log Line:** Not explicitly a crash, but `npm install` creates inconsistent or non-reproducible node_modules in CI compared to locally when `package-lock.json` is out of sync or dependencies differ.
**Explanation:** The workflow uses `npm install`, which can update the lockfile or install different minor versions. The proper way to install reproducible dependencies in CI is by using `npm ci`, which strictly follows the `package-lock.json`. 

## Failure 2: Incorrect Workflow Sequencing
**Step Name:** `Run tests` (in `test` job)
**Error/Log Line:** `npm ERR! enoent ENOENT: no such file or directory, open '/home/runner/work/ci-fix-drill/ci-fix-drill/package.json'`
**Explanation:** The `test` job lacks a `needs: install` directive and a `actions/checkout` step. Thus, it runs concurrently with `install` on a fresh, empty runner machine where the repository code (and `package.json`) does not exist, causing `npm test` to fail immediately.

## Failure 3: Unit Test Assertion Error
**Step Name:** `Run tests` (in `test` job, from Jest output)
**Error/Log Line:** 
`expect(formatCurrency(10.005, 'USD')).toBe({ amount: 10.01, currency: 'USD' });`
`Matcher error: received value must not be bound to a matcher.` (or `Object.is equality` failure)
**Explanation:** The `toBe` matcher checks for referential identity (Object.is) which fails when comparing two distinct object instances that contain the same data. The test must use `toEqual` to check deep object equality. Additionally, `calculateDiscount.test.js` expects 100 when a 10% discount is applied to 100, which should yield 90.

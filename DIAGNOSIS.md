# CI Pipeline Diagnosis

## Failure 1 — Test Job Cannot Find package.json

**Step:** Run tests

**Error:**
`npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/home/runner/work/ci-fix-drill/ci-fix-drill/package.json'`

**Cause:**
The `test` job runs on a separate fresh GitHub Actions runner but does not check out the repository code. Therefore, package.json is not available when `npm test` runs.

**Failure type:** Type 3 — Workflow configuration failure.

## Failure 2 — Non-Reproducible Dependency Installation

**Step:** Install dependencies

**Evidence:**
`Run npm install`

**Cause:**
The workflow uses `npm install` instead of `npm ci`. npm install can resolve dependency version ranges differently over time, making CI installations less reproducible. The workflow should use the committed package-lock.json through `npm ci`.

**Failure type:** Type 2 — Dependency configuration failure.

## Failure 3 — Test Assertion Failures

**Step:** Run tests

**Cause:**
The test job currently fails before the test suite can execute because the repository is not checked out. After fixing the workflow configuration, the test suite must be run to identify and document the specific assertion failures.

**Failure type:** Type 1 — Test logic failure.
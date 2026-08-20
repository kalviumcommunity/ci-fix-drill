# CI Pipeline Diagnosis

## Failure 1 — Test Job Cannot Find package.json

**Step:** Run tests

**Error:**
`npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/home/runner/work/ci-fix-drill/ci-fix-drill/package.json'`

**Cause:**
The `test` job runs on a separate fresh GitHub Actions runner but does not check out the repository code. Therefore, package.json is not available when `npm test` runs.

**Failure type:** Type 3 — Workflow configuration failure.

## Failure 2 — Dependency Lockfile Out of Sync

**Step:** Install dependencies

**Error:**
`npm error code EUSAGE`

`npm error Missing: lodash@4.18.1 from lock file`

**Cause:**
The workflow was changed to use `npm ci`, which requires package.json and package-lock.json to be synchronized. The package.json requires lodash@4.18.1, but that version was missing from the lockfile. Therefore npm ci stopped instead of installing an inconsistent dependency tree.

**Failure type:** Type 2 — Dependency configuration failure.

## Failure 3 — Test Assertion Failures

**Step:** Run tests

**Cause:**
The test job currently fails before the test suite can execute because the repository is not checked out. After fixing the workflow configuration, the test suite must be run to identify and document the specific assertion failures.

**Failure type:** Type 1 — Test logic failure.
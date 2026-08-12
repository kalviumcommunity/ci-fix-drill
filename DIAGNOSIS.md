# CI Pipeline Failure Diagnosis

### 1. Workflow Sequencing Error (Job Dependency)
* **Step name:** `Run tests`
* **Log error message:** `'jest' is not recognized as an internal or external command, operable program or batch file.`
* **Explanation:** The `test` job in `.github/workflows/ci.yml` is missing `needs: install`. This causes the `test` job to run in parallel with the `install` job. Furthermore, the `test` job is missing the `actions/checkout` and `actions/setup-node` steps, meaning it runs on a completely fresh runner without the repository's code or dependencies (no `package.json` or `node_modules`). Without dependencies installed in the same environment, the `jest` executable is not found.

### 2. Dependency Configuration Error
* **Step name:** `Install dependencies`
* **Log error message:** ``npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.``
* **Explanation:** The `package-lock.json` file is out of sync with `package.json` (specifically, it is missing `lodash`). The CI workflow also incorrectly uses `npm install` instead of `npm ci`, which can cause non-reproducible builds in CI. In a correct CI setup using `npm ci`, this mismatch correctly causes the pipeline to fail because the lockfile must perfectly match the dependencies.

### 3. Unit Test Assertion Errors
* **Step name:** `Run tests`
* **Log error message:** `expect(received).toBe(expected) // Object.is equality` (for `formatCurrency.test.js`) and `Expected: 100, Received: 90` (for `calculateDiscount.test.js`)
* **Explanation:** The unit tests have flawed assertions. In `formatCurrency.test.js`, the test incorrectly uses `.toBe()` to compare objects, which checks for reference equality in memory. It must use `.toEqual()` to check for structural equality. In `calculateDiscount.test.js`, a 10% discount on 100 is applied, but the test incorrectly asserts the final price is 100 instead of 90.

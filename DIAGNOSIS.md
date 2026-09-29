# CI Failure Diagnosis

The fork's Actions page showed no workflow runs after the initial branch ref was pushed, so the messages below are exact local reproductions of the current failures. The baseline Actions run will be added once it is available.

## Discount assertion

- **Step name:** Run tests (Jest)
- **Exact error from the test log:** `Expected: 100` and `Received: 90`
- **Cause:** `calculateDiscount(100, 10)` correctly returns 90. The assertion expected the original price instead of the price after a 10% discount.

## Currency object matcher

- **Step name:** Run tests (Jest)
- **Exact error from the test log:** `If it should pass with deep equality, replace "toBe" with "toStrictEqual"` and `Received: serializes to the same string`
- **Cause:** `formatCurrency` returns a new object with the expected values. `toBe` checks whether the actual and expected objects are the same reference, not whether their properties match; the assertion needs a deep-equality matcher.

## Dependency lockfile mismatch

- **Step name:** Install dependencies (`npm ci` reproducibility check)
- **Exact error from the install log:** `npm error Missing: lodash@4.18.1 from lock file`
- **Cause:** `package.json` declares lodash, but the committed lockfile did not contain its package entry or root dependency metadata. `npm ci` therefore rejected the lockfile as out of sync.
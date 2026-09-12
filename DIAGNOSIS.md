# CI Failure Diagnosis

## 1. Test runner unavailable

- **Step:** Local dependency/test execution (`npm test`)
- **Log error:** `'jest' is not recognized as an internal or external command, operable program or batch file.`
- **Cause:** Dependencies had not been installed, and the workflow's test job did not check out the repository or install dependencies on its fresh runner.

## 2. Dependency installation is not reproducible

- **Step:** `Install dependencies`
- **Log error:** `npm ci` exits with usage output instead of installing because the lockfile does not match `package.json`.
- **Cause:** `package.json` declares the production dependency `lodash`, but the lockfile root package entry did not include it. The lockfile must be regenerated and CI must use `npm ci` so the declared dependency tree is enforced.

## 3. Discount assertion failure

- **Step:** `npm test`, `src/payments/calculateDiscount.test.js` (`applies 10 percent discount correctly`)
- **Log error:** `Expected: 100` / `Received: 90`
- **Cause:** `calculateDiscount(100, 10)` correctly returns the price after a 10 percent discount, which is `90`. The test expected the original price, so the assertion was wrong.

## 4. Currency object matcher failure

- **Step:** `npm test`, `src/utils/formatCurrency.test.js` (`formats currency correctly`)
- **Log error:** `Received: serializes to the same string`
- **Cause:** `toBe` compares object identity, not object contents. The returned object has the expected values, so the test must use `toEqual`.
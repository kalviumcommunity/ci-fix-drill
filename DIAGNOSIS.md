# CI Pipeline Failure Diagnosis

Branch: `fix/ci-pipeline-recovery`  
Author: Mahil Mithran  
Date: 2026-07-21

---

## Failure 1 — Wrong Test Assertion (Type 1: Assertion Error)

**Step:** `Run tests` (job: `test`)

**Exact error from log:**
```
● applies 10 percent discount correctly

  expect(received).toBe(expected)

  Expected: 100
  Received: 90

      8 |   expect(calculateDiscount(100, 10)).toBe(100);
        |                                      ^
```

**Root cause:**  
The function `calculateDiscount(100, 10)` correctly computes `100 - (100 * 10 / 100) = 90`. The test assertion expected `100`, which is the original price with *no* discount applied — a copy-paste error by the developer who wrote the test. The function logic is correct; the expected value in the assertion is wrong.

**Fix applied:**  
Changed `toBe(100)` → `toBe(90)` in `src/payments/calculateDiscount.test.js` line 8. The function was not touched.

---

## Failure 2 — Wrong Jest Matcher for Object Comparison (Type 1: Assertion Error)

**Step:** `Run tests` (job: `test`)

**Exact error from log:**
```
● formats currency correctly

  expect(received).toBe(expected)

  If it should pass with deep equality, replace "toBe" with "toEqual"

      5 |   expect(formatCurrency(10.005, 'USD')).toBe({ amount: 10.01, currency: 'USD' });
        |                                         ^
```

**Root cause:**  
`toBe` uses JavaScript's strict reference equality (`===`). Two object literals are never `===` to each other even if their contents are identical, because they are different allocations in memory. The function `formatCurrency` returns a plain object, so the correct matcher is `toEqual`, which performs a deep structural comparison.

**Fix applied:**  
Changed `.toBe(...)` → `.toEqual(...)` in `src/utils/formatCurrency.test.js` line 5. The function was not touched.

---

## Failure 3 — Workflow Sequencing and Configuration Errors (Type 2 + Type 3)

**Step:** `Run tests` (job: `test`) — fails immediately before any test runs

**Exact error from log:**
```
Run npm test
'jest' is not recognized as an internal or external command,
operable program or batch file.
Error: Process completed with exit code 1.
```

**Root cause (three compounded problems in `.github/workflows/ci.yml`):**

| # | Bug | Location | Explanation |
|---|-----|----------|-------------|
| A | `npm install` instead of `npm ci` | `install` job, line 18 | `npm install` can silently update `package-lock.json`, making builds non-reproducible. `npm ci` enforces a strict, clean install from the lockfile. This is a **Type 2 (dependency)** failure. |
| B | Missing `needs: install` on the `test` job | `test` job, line 22 | Without `needs`, GitHub Actions runs both jobs in parallel on separate fresh VMs simultaneously. The test job starts and immediately runs `npm test` before the install job has even begun. This is a **Type 3 (config)** failure. |
| C | No `checkout`, `setup-node`, or `npm ci` in the `test` job | `test` job, lines 24-26 | Every GitHub Actions job runs on a **brand-new virtual machine**. Files and `node_modules` from the `install` job are **not shared**. The test job's VM has no source code and no `node_modules`, so `jest` is not found. This is a **Type 3 (config)** failure. |

**Fix applied:**  
- Replaced `npm install` with `npm ci` in the `install` job.  
- Added `needs: install` to the `test` job.  
- Added `actions/checkout@v4`, `actions/setup-node@v4`, and `npm ci` steps to the `test` job so it has all required context on its own VM.

---

## Summary Table

| # | File | Type | Broken | Fixed |
|---|------|------|--------|-------|
| 1 | `src/payments/calculateDiscount.test.js` | Type 1 — Assertion | `toBe(100)` on a 10% discounted result | `toBe(90)` |
| 2 | `src/utils/formatCurrency.test.js` | Type 1 — Assertion | `toBe(obj)` reference equality on an object | `toEqual(obj)` deep equality |
| 3 | `.github/workflows/ci.yml` | Type 2 + 3 — Dependency + Config | `npm install`, missing `needs`, no checkout/install in test job | `npm ci`, `needs: install`, full setup in test job |

# CI Pipeline Failure Diagnosis

This document details the specific failures found in the CI pipeline based on code inspection and workflow analysis.

---

## Failure 1: Test Assertion Error - calculateDiscount.test.js

**Step Name:** Run tests (in `test` job)

**Expected Error Message:**
```
expect(received).toBe(expected) // Object.is equality

Expected: 100
Received: 90

  11 |   test('applies 10 percent discount correctly', () => {
> 12 |     expect(calculateDiscount(100, 10)).toBe(100);
     |                                        ^
  13 |   });
```

**Root Cause:**
The test assertion at line 12 of `src/payments/calculateDiscount.test.js` expects the wrong value. When applying a 10% discount to $100, the result should be $90, not $100. The function implementation is correct (it subtracts the discount percentage from the price), but the test assertion expects the original price instead of the discounted price.

---

## Failure 2: Test Assertion Error - formatCurrency.test.js

**Step Name:** Run tests (in `test` job)

**Expected Error Message:**
```
expect(received).toBe(expected) // Object.is equality

If it should pass with deep equality, replace "toBe" with "toEqual"

Expected: {"amount": 10.01, "currency": "USD"}
Received: {"amount": 10.01, "currency": "USD"}

   8 |   test('formats currency correctly', () => {
>  9 |     expect(formatCurrency(10.005, 'USD')).toBe({ amount: 10.01, currency: 'USD' });
     |                                           ^
  10 |   });
```

**Root Cause:**
The test at line 9 of `src/utils/formatCurrency.test.js` uses `.toBe()` matcher to compare objects. The `.toBe()` matcher uses `Object.is` equality which checks for reference equality, not deep equality. Since the function returns a new object, it will never match the expected object by reference even if the contents are identical. The correct matcher should be `.toEqual()` for deep object comparison.

---

## Failure 3: Missing Checkout and Dependencies in Test Job

**Step Name:** Run tests (in `test` job)

**Expected Error Message:**
```
Error: Cannot find module 'jest'
Require stack:
- ...
```
or
```
sh: 1: jest: not found
```

**Root Cause:**
The `test` job in `.github/workflows/ci.yml` is missing two critical steps:
1. No `actions/checkout@v4` step - the repository code is not checked out on the runner
2. No dependency installation step (npm ci) - node_modules is not populated
3. Missing `needs: install` declaration - the test job runs in parallel with install job on a separate fresh VM instance

Even if dependencies were installed in the `install` job, GitHub Actions runs each job in a completely isolated environment. The `test` job needs its own checkout and dependency installation steps.

---

## Failure 4: Non-Reproducible Dependency Installation

**Step Name:** Install dependencies (in `install` job)

**Issue:**
The workflow uses `npm install` instead of `npm ci` at line 15 of `.github/workflows/ci.yml`. While this may not cause an immediate failure, `npm install` can:
- Modify package-lock.json during installation
- Install different versions than specified in the lockfile
- Lead to non-deterministic builds
- Cause inconsistencies between local and CI environments

**Recommendation:**
Use `npm ci` which:
- Removes node_modules before installing (clean install)
- Installs exact versions from package-lock.json
- Fails if package.json and package-lock.json are out of sync
- Is faster in CI environments

---

## Summary

**Critical Failures:**
1. Test assertion expects wrong value (100 instead of 90)
2. Test uses wrong matcher (.toBe() instead of .toEqual() for objects)
3. Test job missing checkout and setup steps

**Configuration Issues:**
1. Should use npm ci instead of npm install for reproducibility
2. Test job should have explicit needs: [install] dependency (though not strictly required if test job sets up its own environment)

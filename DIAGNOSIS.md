# CI Failure Diagnosis

## Failure 1

### Step Name

Run tests

### Exact Error

"npm ERR! enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/home/runner/work/ci-fix-drill/ci-fix-drill/package.json'"

### Cause

The test job runs on a fresh GitHub Actions runner but does not include an actions/checkout step. Since the repository files are never downloaded, npm cannot find package.json and the test step fails.

---

## Failure 2

### Step Name

Workflow Configuration

### Exact Error

The test job starts independently instead of waiting for the install job.

### Cause

The workflow is missing a `needs: install` dependency. As a result, the test job runs in parallel instead of after dependency installation.

---

## Failure 3

### Step Name

Install Dependencies

### Exact Error

The workflow uses `npm install` instead of `npm ci`.

### Cause

`npm install` can produce inconsistent dependency trees between environments. CI pipelines should use `npm ci` with a committed lockfile to ensure reproducible installations.

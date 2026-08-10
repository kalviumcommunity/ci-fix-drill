What Is Broken?

The pipeline contains three different categories of failures.

Type 1 — Assertion Failure

A unit test is failing because an assertion does not correctly match the value returned by the application.

You need to determine whether:

the application code is incorrect, or
the test assertion is incorrect.

Expected fix: Correct the test assertion if the application behavior is already correct.

Run the affected test locally:

npx jest <test-file>

Add a short comment above the changed assertion explaining why it was corrected.

Type 2 — Dependency Configuration

The dependency installation is not configured for a reproducible CI environment.

Inspect:

package.json
package-lock.json
.github/workflows/ci.yml

Check whether the workflow uses:

npm install

or:

npm ci

The CI pipeline should use:

npm ci

Also verify that package-lock.json is committed and synchronized with package.json.

If the lockfile is out of sync, regenerate it locally:

npm install

Then commit the updated:

package-lock.json
Type 3 — Workflow Configuration

The GitHub Actions workflow contains a configuration or sequencing problem.

Inspect:

.github/workflows/ci.yml

Look for problems such as:

incorrect YAML indentation
jobs running in the wrong order
missing needs:
missing actions/checkout
incorrect Node.js version
missing dependency installation
incorrect test command
incorrect job configuration

Fix the workflow at its root cause.

Add a comment inside the workflow explaining the change.

Validate the YAML before pushing.

Required Changes

Your final solution should contain the following changes.

1. Fix the Unit Test

Identify the failing assertion from the CI log.

Correct the assertion rather than modifying application code unnecessarily.

Verify locally:

npx jest

The test suite must pass.

2. Fix Dependency Installation

The CI workflow must use a reproducible installation:

- run: npm ci

Ensure:

package.json
package-lock.json

are synchronized.

Do not remove the lockfile.

3. Fix GitHub Actions Workflow

Correct the problem in:

.github/workflows/ci.yml

The workflow should correctly perform the required sequence:

Checkout
   ↓
Setup Node.js
   ↓
Install dependencies
   ↓
Lint
   ↓
Test
   ↓
Build

If multiple jobs exist, ensure job dependencies are correctly configured with needs: where required.

Before Creating the Pull Request

Run the application checks locally where possible:

npm ci
npm test
npm run lint
npm run build

If a script does not exist, use the scripts actually defined in package.json.

Then commit your changes:

git add .
git commit -m "fix: recover broken CI pipeline"
git push origin fix/ci-pipeline-recovery
Pull Request Requirements

Create a Pull Request:

fix/ci-pipeline-recovery → main

The PR must contain:

Code fixes
Corrected unit test assertion
Reproducible dependency installation
Corrected GitHub Actions workflow
Evidence

The GitHub Actions workflow must be green.

The PR should clearly explain:

What failed
What caused each failure
What was changed
Why each change fixes the root cause
Final Expected State

The repository should finish in this state:

CI Pipeline
│
├── Install      
├── Lint         
├── Test         
└── Build         

The Pull Request should show:

All checks passed

Do not consider the task complete if the PR is created while CI is still failing.

Key Engineering Principle

Do not fix the symptom.

Use this debugging loop:

RED CI
  ↓
READ LOG
  ↓
IDENTIFY FAILURE
  ↓
FIND ROOT CAUSE
  ↓
MAKE MINIMUM FIX
  ↓
RUN LOCALLY
  ↓
PUSH
  ↓
VERIFY GREEN CI

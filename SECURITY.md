# Security Policy

## Why this matters here

Dependency Archaeologist reads and parses source code, `package.json` files, and lockfiles from arbitrary projects, including ones you didn't write. The GitHub Action additionally runs in your CI pipeline with a GitHub token that can read your repository and post comments on your pull requests.

That combination means a vulnerability here isn't hypothetical: a malicious input file (a crafted `package.json`, an oddly formed lockfile, or a source file designed to exploit the parser) could potentially affect a machine or CI run that never intended to trust it. We take reports in this area seriously and will prioritize them accordingly.

## Supported versions

Only the latest published minor version of each package receives security fixes.

| Package | Supported |
|---|---|
| `dep-archaeologist` (CLI) | Latest minor |
| `@dep-archaeologist/core` | Latest minor |
| GitHub Action | Latest major (`v1`) |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.** A public issue discloses the problem to potential attackers before a fix exists.

Instead, report privately using one of these methods:

1. **GitHub Security Advisories (preferred):** Go to the repository's **Security** tab → **Advisories** → **Report a vulnerability**. This opens a private channel directly with the maintainers and lets us collaborate on a fix before anything is public.
Please include as much of the following as you can:

- A description of the vulnerability and its potential impact (for example: arbitrary code execution while parsing a crafted file, a path traversal writing outside the project directory, a way to leak the GitHub Action's token or CI environment variables, or a denial-of-service via a malformed input causing excessive memory or CPU use).
- Steps to reproduce it, ideally a minimal example project or crafted file that triggers the issue.
- The affected package and version.
- Whether you're aware of it being exploited in the wild.

## What to expect

- **Acknowledgment within 3 business days.**
- We'll work with you to understand the issue, and may ask follow-up questions or request a proof of concept.
- Once a fix is ready, we'll coordinate a release and a public advisory. We credit reporters by name (or pseudonym) in the advisory unless you ask us not to.
- If the report turns out to be out of scope or not a vulnerability, we'll explain why, and you're welcome to open a public issue at that point.

We don't currently run a paid bug bounty program, but we're glad to credit researchers publicly for responsible disclosure.

## Scope

**In scope:**
- Arbitrary code execution triggered by scanning a project (via a crafted `package.json`, lockfile, source file, or tsconfig)
- Path traversal or file writes outside the intended project or cache directory
- Exposure of the GitHub Action's token, environment variables, or CI secrets
- Prototype pollution or injection vulnerabilities in the config loader
- Supply-chain issues in this project's own dependencies that are exploitable through normal use

**Out of scope:**
- Vulnerabilities in a project *being scanned* (that's between you and that project's maintainers, not us)
- Issues that require an already-compromised machine or an already-malicious `package.json` author with other means of causing harm equivalent to what a normal `npm install` of their package would already allow
- Missing security best-practice suggestions with no demonstrated exploit (open a normal issue for these instead)

## Our own supply-chain practices

Since this project audits other people's dependencies, we hold our own to the same standard: dependencies are kept to a minimum, `pnpm`'s strict peer dependency resolution is enabled, install scripts from third-party packages require explicit approval before they run, and releases are published via automated CI rather than from a maintainer's local machine.
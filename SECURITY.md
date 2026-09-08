# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it
privately rather than opening a public issue.

- Preferred: open a [private security advisory](../../security/advisories/new)
  on GitHub for this repository.
- Include a description of the issue, steps to reproduce, and the potential
  impact.

Please do not disclose the issue publicly until it has been triaged and a fix
has been released.

## Supported Versions

This project is deployed continuously from the `main` branch. Only the latest
state of `main` is supported; there are no maintained release branches.

## Automated Security Tooling

This repository runs the following checks on every push and pull request to
`main`, and on a weekly schedule:

- **CodeQL** static analysis (`.github/workflows/codeql.yml`) for JavaScript/TypeScript.
- **Trivy** filesystem, dependency, and misconfiguration scanning (`.github/workflows/trivy.yml`).
- **Gitleaks** secret scanning (`.github/workflows/security.yml`).
- **Dependency review** on pull requests, blocking new high-severity vulnerabilities.
- **npm audit** against production dependencies in both `Backend` and `Frontend`.
- **Dependabot** version updates for npm packages and GitHub Actions (`.github/dependabot.yml`).

Findings from CodeQL and Trivy are published to the repository's Security tab.

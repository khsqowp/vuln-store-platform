# OWASP Top 10 Context

Last updated: 2026-05-05

Use OWASP Top 10 as an additional taxonomy for the shopping mall vulnerability diagnosis project. The current 50 diagnosis scenarios should continue to use `VULN-001` through `VULN-050` as their primary identifiers, while OWASP categories provide broader grouping.

## OWASP Top 10 Categories

1. A01 Broken Access Control
2. A02 Cryptographic Failures
3. A03 Injection
4. A04 Insecure Design
5. A05 Security Misconfiguration
6. A06 Vulnerable and Outdated Components
7. A07 Identification and Authentication Failures
8. A08 Software and Data Integrity Failures
9. A09 Security Logging and Monitoring Failures
10. A10 Server-Side Request Forgery

## Initial Mapping

- A01 Broken Access Control: IDOR, admin bypass, vertical privilege escalation, CSRF impact paths
- A02 Cryptographic Failures: weak JWT signing key, hardcoded secrets, weak password hashing
- A03 Injection: SQL injection, stored XSS, reflected XSS, DOM XSS
- A04 Insecure Design: payment amount tampering, cart price tampering, mileage tampering, coupon race conditions
- A05 Security Misconfiguration: weak CORS, verbose errors, exposed headers, directory listing, cache-control gaps
- A06 Vulnerable and Outdated Components: dependency and platform checks to be added during later implementation
- A07 Identification and Authentication Failures: weak password policy, account enumeration, brute force, session fixation, password reset token issues
- A08 Software and Data Integrity Failures: unsafe upload handling, integrity checks around product/admin content to be added
- A09 Security Logging and Monitoring Failures: sensitive log exposure and missing audit coverage
- A10 Server-Side Request Forgery: external image URL preview and banner fetch flows

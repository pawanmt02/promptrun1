# Security Policy & Data Sanitization Guidelines

## Overview
**PAISA.OS** adheres to strict security and data sanitization standards to prevent client-side injection attacks, cross-site scripting (XSS), numeric overflow vulnerabilities, and unauthorized data corruption.

## 1. Input Sanitization & Data Validation
* **XSS Prevention**: All user-provided strings (custom expense titles, notes, user names) are stripped of HTML tags, script tags, javascript URI schemes, and angle brackets using strict input sanitization (`src/utils/security.ts`).
* **Numeric Sanitization**: All financial values (amounts, goals, custom allocations) are validated against:
  - Range boundaries: `0 < amount <= 10,000`
  - Finite integer/decimal checking (`Number.isFinite`, no `NaN`, no `Infinity`)
  - Precision clamping: 2 decimal places maximum.
* **Category & Enum Guarding**: All category selections are checked against predefined union types (`Category`, `Necessity`).

## 2. Client-Side Storage Security
* State stored in `localStorage` is serialized with JSON validation and schema integrity checks.
* Corrupted or tampered storage entries fail gracefully by falling back to safe initial state defaults.

## 3. Reporting a Vulnerability
If you discover a security vulnerability in PAISA.OS, please report it privately via email to the maintainer at `manoharst406@gmail.com`.

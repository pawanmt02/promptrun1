import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeAmount, isValidCategory } from '../src/utils/security';

describe('Security & Data Sanitization Tests', () => {
  it('strips dangerous HTML and script tags from input strings', () => {
    const malicious = '<script>alert("hacked")</script>Maggi & Chai';
    const sanitized = sanitizeString(malicious);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
    expect(sanitized).toContain('Maggi');
  });

  it('neutralizes angle brackets and special injection characters', () => {
    const payload = '<img src=x onerror=alert(1)>';
    const clean = sanitizeString(payload);
    expect(clean).not.toContain('<img');
  });

  it('properly validates and clamps monetary amounts', () => {
    // Normal amount
    expect(sanitizeAmount(250)).toBe(250);
    expect(sanitizeAmount('500.50')).toBe(500.5);

    // Negative amounts must clamp to 0
    expect(sanitizeAmount(-100)).toBe(0);

    // Amounts exceeding budget ceiling clamp to maxLimit
    expect(sanitizeAmount(999999, 10000)).toBe(10000);

    // Invalid NaN / non-numeric values clamp to 0
    expect(sanitizeAmount('invalid')).toBe(0);
  });

  it('verifies category against allowed whitelist', () => {
    const allowed = ['Food & Chai', 'Rent & Stay', 'Emergency'];
    expect(isValidCategory('Food & Chai', allowed)).toBe(true);
    expect(isValidCategory('Crypto Scam', allowed)).toBe(false);
  });
});

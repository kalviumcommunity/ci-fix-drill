const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // toBe uses Object.is (reference equality) — always fails for two distinct
  // object instances even with identical contents. The expected value was right,
  // just the wrong matcher. Switched to toEqual for structural comparison.
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});

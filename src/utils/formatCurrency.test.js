const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // Fixed: Changed from .toBe() to .toEqual() because .toBe() uses Object.is equality (reference equality)
  // which fails for objects even with identical content. .toEqual() performs deep equality comparison.
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});

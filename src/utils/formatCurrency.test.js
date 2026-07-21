const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // FIX: toBe uses reference equality (===) and always fails for objects, even if they look identical.
  // formatCurrency returns a plain object, so we must use toEqual for deep structural comparison.
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});

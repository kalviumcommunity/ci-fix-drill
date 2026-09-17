const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // Fixed: Objects should be compared using toEqual instead of toBe.
  expect(formatCurrency(10.005, 'USD')).toEqual({
    amount: 10.01,
    currency: 'USD'
  });
});
const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // Object values need toEqual because toBe compares object identity.
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});

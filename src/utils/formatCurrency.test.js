const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // FIXED: Changed toBe to toEqual because toBe check object reference, while toEqual does deep value evaluation
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});

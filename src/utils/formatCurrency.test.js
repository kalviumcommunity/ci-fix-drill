const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // WRONG — toBe fails on objects, should use toEqual
  // toBe compares object references; use toEqual to compare object contents
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});

const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // toBe compares object references, so toEqual is needed to compare object values.
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});
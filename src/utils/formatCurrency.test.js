const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // toBe() checks for object reference equality which will fail here. toEqual() correctly verifies structural equality for objects.
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});

const { calculateDiscount } = require('./calculateDiscount');

test('applies no discount when percent is 0', () => {
  expect(calculateDiscount(100, 0)).toBe(100);
});

test('applies 10 percent discount correctly', () => {
  // Fixed: 10% discount on 100 should return 90, not 100.
  expect(calculateDiscount(100, 10)).toBe(90);
});
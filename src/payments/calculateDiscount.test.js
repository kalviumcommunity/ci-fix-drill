const { calculateDiscount } = require('./calculateDiscount');

test('applies no discount when percent is 0', () => {
  // 10% discount on 100 should return 90, not 100
  expect(calculateDiscount(100, 10)).toBe(90);
});
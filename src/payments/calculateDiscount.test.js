const { calculateDiscount } = require('./calculateDiscount');

test('applies no discount when percent is 0', () => {
  expect(calculateDiscount(100, 0)).toBe(100); // This passes
});

test('applies 10 percent discount correctly', () => {
  // Fixed: The assertion was expecting 100, but a 10% discount on $100 should result in $90.
  // The calculateDiscount function correctly computes: price - (price * percent / 100) = 100 - 10 = 90
  expect(calculateDiscount(100, 10)).toBe(90);
});

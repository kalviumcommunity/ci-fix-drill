const { calculateDiscount } = require('./calculateDiscount');

test('applies no discount when percent is 0', () => {
  expect(calculateDiscount(100, 0)).toBe(100); // This passes
});

test('applies 10 percent discount correctly', () => {
  // The assertion incorrectly expected 100 after a 10% discount on 100. The correct mathematically applied discount makes it 90.
  expect(calculateDiscount(100, 10)).toBe(90);
});

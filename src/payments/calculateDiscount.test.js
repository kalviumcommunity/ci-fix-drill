const { calculateDiscount } = require('./calculateDiscount');

test('applies no discount when percent is 0', () => {
  expect(calculateDiscount(100, 0)).toBe(100); // This passes
});

test('applies 10 percent discount correctly', () => {
  // Function is correct (100 - 10% = 90); the assertion had the wrong
  // expected value (100, the un-discounted price). Fixed the test, not the function.
  expect(calculateDiscount(100, 10)).toBe(90);
});

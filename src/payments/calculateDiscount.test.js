const { calculateDiscount } = require('./calculateDiscount');

test('applies no discount when percent is 0', () => {
  expect(calculateDiscount(100, 0)).toBe(100); // This passes
});

test('applies 10 percent discount correctly', () => {
  // FIX: The function correctly computes 100 - (100 * 10 / 100) = 90.
  // The original assertion expected 100, which is the un-discounted price — that is wrong.
  // We fix the test expectation, not the function, because the function logic is correct.
  expect(calculateDiscount(100, 10)).toBe(90);
});

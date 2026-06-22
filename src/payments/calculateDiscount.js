function calculateDiscount(amount, percent) {
  return amount - (amount * percent) / 100;
}

module.exports = { calculateDiscount };
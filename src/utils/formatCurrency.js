function formatCurrency(amount, currency) {
  return {
    amount: Math.round(amount * 100) / 100,
    currency
  };
}

module.exports = { formatCurrency };
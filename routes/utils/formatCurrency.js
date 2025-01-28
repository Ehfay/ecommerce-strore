// utils/formatCurrency.js
function formatCurrency(amount, currency = 'NGN') {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
    }).format(amount);
  }
  
  export default formatCurrency;
  
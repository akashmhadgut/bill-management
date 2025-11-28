export function formatINR(value) {
  if (value == null || value === '') return '₹0'
  const amount = Number(value) || 0
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
}

export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return '₹0.00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 10000000) {
    return `${sign}₹${(absNum / 10000000).toFixed(2)} Cr`;
  } else if (absNum >= 100000) {
    return `${sign}₹${(absNum / 100000).toFixed(2)} L`;
  } else {
    return `${sign}₹${absNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return num.toLocaleString('en-IN');
}

export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return String(dateStr);
  }
}

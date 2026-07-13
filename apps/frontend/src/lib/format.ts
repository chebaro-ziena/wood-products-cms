export function formatCzech(value: number, decimals = 2): string {
  const rounded = Number(value.toFixed(decimals));
  return rounded.toLocaleString('cs-CZ', { maximumFractionDigits: decimals, useGrouping: false });
}

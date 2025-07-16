export const formatNumber = (
  amount: number,
  options?: Intl.NumberFormatOptions
) => {
  return new Intl.NumberFormat("es-AR", options).format(amount);
};

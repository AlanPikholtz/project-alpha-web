export const formatNumber = (
  amount: number,
  options?: Intl.NumberFormatOptions
) => {
  return new Intl.NumberFormat("es-AR", options).format(amount);
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

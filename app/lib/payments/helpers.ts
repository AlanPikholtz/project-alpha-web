import { PaymentMethod } from "./types";

export const paymentMethodToString = (method: PaymentMethod): string => {
  switch (method) {
    case "card":
      return "tarjeta";
    case "cash":
      return "efectivo";
    case "transfer":
      return "transferencia";
    default:
      return "desconocido";
  }
};

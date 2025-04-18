import { isValid, parse } from "date-fns";
import { TransactionType } from "./types";

export const stringToISODate = (date: string) => {
  const parsedDate = parse(date, "d/M/yyyy HH:mm:ss", new Date());
  // Lets add a simple validation
  return isValid(parsedDate) ? parsedDate.toISOString() : undefined;
};

export const stringToTransactionType = (type: string): TransactionType => {
  switch (type.toLowerCase()) {
    case "depósito":
      return "deposit";
    case "retiro":
      return "withdrawal";
    case "conversión":
      return "exchange";
    default:
      return "deposit";
  }
};

export const transactionTypeToString = (type: TransactionType): string => {
  switch (type) {
    case "deposit":
      return "depósito";
    case "withdrawal":
      return "retiro";
    case "exchange":
      return "conversión";
    default:
      return "depósito";
  }
};

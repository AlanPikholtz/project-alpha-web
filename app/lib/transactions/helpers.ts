import { isValid, parse } from "date-fns";
import { Transaction, TransactionParseResult, TransactionType } from "./types";

const VALID_TYPES = ["Depósito", "", ""];
export const mapStringToTransactions = (
  transactions: string
): TransactionParseResult => {
  const rows = transactions
    .split("\n")
    .map((row) => row.split("\t").map((cell) => cell.trim()));

  const allValid: Partial<Transaction>[] = [];
  const invalid: { row: string[]; reason: string; index: number }[] = [];

  rows.forEach((row, index) => {
    const [date, type, rawAmount] = row;

    // if (row.length !== 4) {
    //   invalid.push({ row, reason: "Debe tener 4 columnas", index });
    //   return;
    // }

    if (!date || !isValid(parse(date, "d/M/yyyy HH:mm:ss", new Date()))) {
      invalid.push({ row, reason: "Fecha inválida", index });
      return;
    }

    if (!VALID_TYPES.includes(type)) {
      invalid.push({ row, reason: "Tipo inválido", index });
      return;
    }

    const normalizedAmount = rawAmount.replace(",", ".");
    if (isNaN(parseFloat(normalizedAmount))) {
      invalid.push({ row, reason: "Monto inválido", index });
      return;
    }

    // if (!currency) {
    //   invalid.push({ row, reason: "Moneda faltante", index });
    //   return;
    // }

    allValid.push({
      date: stringToISODate(date),
      type: stringToTransactionType(type),
      amount: parseFloat(normalizedAmount),
      currency: "ARS",
    });
  });

  // Now lets move duplicated ones to a separated list
  const seen = new Set<string>();
  const valid: Partial<Transaction>[] = [];
  const duplicates: Partial<Transaction>[] = [];

  for (const tx of allValid) {
    const key = JSON.stringify(tx);
    if (seen.has(key)) {
      duplicates.push(tx);
    } else {
      seen.add(key);
      valid.push(tx);
    }
  }

  return { valid, invalid, duplicates };
};

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
    case "payment":
      return "Pago";
    default:
      return "depósito";
  }
};

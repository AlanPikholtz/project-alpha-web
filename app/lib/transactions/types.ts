export type TransactionType = "deposit" | "withdrawal" | "exchange" | "payment";
export interface Transaction {
  id: number;
  clientId: number;
  date: string;
  type: TransactionType;
  amount: number;
  clientAmount: number;
  clientFullName: string;
  currency: string;
  createdAt: string;
  accountId: number;
}

export type TransactionStatus = "assigned" | "unassigned";
export type SortBy = "assignedAt" | "createdAt" | "date";

export type TransactionParseResult = {
  valid: Partial<Transaction>[];
  invalid: { row: string[]; reason: string; index: number }[];
  duplicates: Partial<Transaction>[]; // Valid transaccions that are duplicated
};

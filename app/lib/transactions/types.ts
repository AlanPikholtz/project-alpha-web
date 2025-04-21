export type TransactionType = "deposit" | "withdrawal" | "exchange";
export interface Transaction {
  id: number;
  clientId: number;
  date: string;
  type: TransactionType;
  amount: number;
  clientAmount: number;
  currency: string;
  createdAt: string;
}

export type TransactionStatus = "assigned" | "unassigned";
export type SortBy = "assignedAt" | "createdAt" | "date";

export type TransactionParseResult = {
  valid: Partial<Transaction>[];
  invalid: { row: string[]; reason: string; index: number }[];
};

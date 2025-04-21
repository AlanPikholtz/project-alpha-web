export type TransactionType = "deposit" | "withdrawal" | "exchange";
export interface Transaction {
  id: number;
  clientId: number;
  date: string;
  type: TransactionType;
  amount: number;
  currency: string;
  createdAt: string;
}

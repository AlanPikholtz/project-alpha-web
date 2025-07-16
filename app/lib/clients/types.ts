import { PaymentMethod } from "../payments/types";
import { TransactionType } from "../transactions/types";

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  code: string;
  balance: string;
  commission: string;
  notes: string;
  accountId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Operation {
  date: string;
  type: TransactionType;
  amount: string;
  currency: string;
  clientAmount: string;
  assignedAt: string;
  method: PaymentMethod; // Just for payment type
}

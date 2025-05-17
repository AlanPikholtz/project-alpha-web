export type PaymentMethod = "card" | "cash" | "transfer";

export interface Payment {
  id: number;
  paymentRequestDate: string;
  amount: string;
  currency: string;
  method: PaymentMethod;
  clientId: number;
  createdAt: string;
}

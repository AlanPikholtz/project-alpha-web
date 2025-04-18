import api from "../api/api";
import { PagedDataResponse } from "../api/types";
import { Transaction } from "./types";

export const transactionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // All transactions
    getTransactions: builder.query<
      PagedDataResponse<Transaction[]>,
      {
        status?: "assigned" | "unassigned";
        amount?: number;
        from?: string;
        to?: string;
        sort?: "assignedAt" | "createdAt" | "date";
        order?: "asc" | "desc";
        limit?: number;
        page?: number;
      }
    >({
      query: ({ status, amount, from, to, sort, order, limit = 0, page }) => {
        const searchParams = new URLSearchParams();
        if (status) searchParams.append("status", status.toString());
        if (amount) searchParams.append("amount", amount.toString());
        if (from) searchParams.append("from", from.toString());
        if (to) searchParams.append("to", to.toString());
        if (sort) searchParams.append("sort", sort.toString());
        if (order) searchParams.append("order", order.toString());
        if (limit) searchParams.append("limit", limit.toString());
        if (page) searchParams.append("page", page.toString());
        return {
          url: `/transactions?${searchParams.toString()}`,
          method: "GET",
        };
      },
    }),
    createTransaction: builder.mutation<{ id: string }, Partial<Transaction>>({
      query: (params) => ({
        url: `/transactions`,
        method: "POST",
        body: params,
      }),
    }),
    // Client transaction
    getClientTransactions: builder.query<Transaction[], { id: string }>({
      query: ({ id }) => ({
        url: `/transactions/client/${id}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false, // It's better to keep this false unless overriding
});

export const {
  useGetTransactionsQuery,
  useGetClientTransactionsQuery,
  useCreateTransactionMutation,
} = transactionsApi;

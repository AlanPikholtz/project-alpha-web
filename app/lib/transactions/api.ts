import api from "../api/api";
import { Transaction } from "./types";

export const transactionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], { id: string }>({
      query: ({ id }) => ({
        url: `/transactions/client/${id}`,
        method: "GET",
      }),
    }),
    createTransaction: builder.mutation<{ id: string }, Partial<Transaction>>({
      query: (params) => ({
        url: `/transactions`,
        method: "POST",
        body: params,
      }),
    }),
  }),
  overrideExisting: false, // It's better to keep this false unless overriding
});

export const { useGetTransactionsQuery, useCreateTransactionMutation } =
  transactionsApi;

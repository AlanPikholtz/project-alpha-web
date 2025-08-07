import api from "../api/api";
import { PagedDataResponse } from "../api/types";
import { SortBy, Transaction } from "./types";

export const transactionsApi = api
  .enhanceEndpoints({ addTagTypes: ["Transactions"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      // All transactions
      getTransactions: builder.query<
        PagedDataResponse<Transaction[]>,
        {
          accountId?: number | null;
          clientId?: number;
          status?: "assigned" | "unassigned";
          amount?: number;
          from?: string;
          to?: string;
          sort?: SortBy;
          order?: "asc" | "desc";
          limit?: number;
          page?: number;
        }
      >({
        query: ({
          accountId,
          clientId,
          status,
          amount,
          from,
          to,
          sort,
          order,
          limit = 0,
          page,
        }) => {
          const searchParams = new URLSearchParams();
          if (accountId) searchParams.append("accountId", accountId.toString());
          if (clientId) searchParams.append("clientId", clientId.toString());
          if (status) searchParams.append("status", status.toString());
          if (amount !== undefined)
            searchParams.append("amount", amount.toString());
          if (from) searchParams.append("from", from.toString());
          if (to) searchParams.append("to", to.toString());
          if (sort) searchParams.append("sort", sort.toString());
          if (order) searchParams.append("order", order.toString());
          if (limit !== undefined)
            searchParams.append("limit", limit.toString());
          if (page) searchParams.append("page", page.toString());
          return {
            url: `/transactions?${searchParams.toString()}`,
            method: "GET",
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.data.map(({ id }) => ({
                  type: "Transactions" as const,
                  id,
                })),
                "Transactions",
              ]
            : ["Transactions"],
      }),
      createTransaction: builder.mutation<{ id: string }, Partial<Transaction>>(
        {
          query: (params) => ({
            url: `/transactions`,
            method: "POST",
            body: params,
          }),
          invalidatesTags: ["Transactions"],
        }
      ),
      createBulkTransaction: builder.mutation<
        { id: string },
        { accountId: number; transactions: Partial<Transaction>[] }
      >({
        query: ({ accountId, transactions }) => ({
          url: `/transactions/account/${accountId}/bulk`,
          method: "POST",
          body: transactions,
        }),
        invalidatesTags: ["Transactions"],
      }),
      bulkUpdateTransaction: builder.mutation<
        string,
        { clientId: number; transactionIds: number[] }
      >({
        query: ({ clientId, transactionIds }) => ({
          url: `/transactions/client/${clientId}`,
          method: "PUT",
          body: { transactionIds },
        }),
        invalidatesTags: ["Transactions", "Clients"],
      }),
      unassignClientTransaction: builder.mutation<
        string,
        { transactionId: number }
      >({
        query: ({ transactionId }) => ({
          url: `/transactions/${transactionId}/unassign`,
          method: "PUT",
        }),
        invalidatesTags: ["Transactions", "Clients"],
      }),
      bulkDeleteTransaction: builder.mutation<
        string,
        { transactionIds: number[] }
      >({
        query: ({ transactionIds }) => ({
          url: `/transactions/bulk`,
          method: "DELETE",
          body: { transactionIds },
        }),
        invalidatesTags: ["Transactions", "Clients"],
      }),
    }),
    overrideExisting: false, // It's better to keep this false unless overriding
  });

export const {
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
  // Create
  useCreateTransactionMutation,
  useCreateBulkTransactionMutation,
  // Update
  useBulkUpdateTransactionMutation,
  // Unassign
  useUnassignClientTransactionMutation,
  // Delete
  useBulkDeleteTransactionMutation,
} = transactionsApi;

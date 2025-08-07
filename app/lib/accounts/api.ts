import api from "../api/api";
import { PagedDataResponse, PagedQueryParams } from "../api/types";
import { Account } from "./types";

export const accountsApi = api
  .enhanceEndpoints({ addTagTypes: ["Accounts"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAccounts: builder.query<
        PagedDataResponse<Account[]>,
        PagedQueryParams
      >({
        query: ({ limit = 0, page }) => {
          const searchParams = new URLSearchParams();
          if (limit !== undefined)
            searchParams.append("limit", limit.toString());
          if (page) searchParams.append("page", page.toString());
          return {
            url: `/accounts?${searchParams.toString()}`,
            method: "GET",
          };
        },
        providesTags: ["Accounts"],
      }),
      getAccountById: builder.query<Account, { id: number }>({
        query: ({ id }) => {
          return {
            url: `/accounts/${id}`,
            method: "GET",
          };
        },
        providesTags: ["Accounts"],
      }),
      createAccount: builder.mutation<{ id: number }, Partial<Account>>({
        query: ({ name }) => {
          return {
            url: "/accounts",
            method: "POST",
            body: {
              name,
            },
          };
        },
        invalidatesTags: ["Accounts"],
      }),
      updateAccount: builder.mutation<
        { id: number },
        { id: number; name: string }
      >({
        query: ({ id, name }) => {
          return {
            url: `/accounts/${id}`,
            method: "PUT",
            body: {
              name,
            },
          };
        },
        invalidatesTags: ["Accounts"],
      }),
      deleteAccount: builder.mutation<string, { id: number }>({
        query: ({ id }) => {
          return {
            url: `/accounts/${id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["Accounts"],
      }),
    }),
  });

export const {
  // Accounts
  useGetAccountsQuery,
  useLazyGetAccountsQuery,
  // Account
  useGetAccountByIdQuery,
  // New Account
  useCreateAccountMutation,
  // Update account
  useUpdateAccountMutation,
  // Delete account
  useDeleteAccountMutation,
} = accountsApi;

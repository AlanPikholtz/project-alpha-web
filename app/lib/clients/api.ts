import api from "../api/api";
import { PagedDataResponse, PagedQueryParams } from "../api/types";
import { SortBy } from "../transactions/types";
import { Client, Operation } from "./types";

export const clientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<
      PagedDataResponse<Client[]>,
      { accountId?: number | null } & PagedQueryParams
    >({
      query: ({ accountId, limit = 0, page }) => {
        const searchParams = new URLSearchParams();
        if (accountId) searchParams.append("accountId", accountId.toString());
        if (limit !== undefined) searchParams.append("limit", limit.toString());
        if (page) searchParams.append("page", page.toString());
        return {
          url: `/clients?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Clients"],
    }),
    getClientById: builder.query<Client, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/clients/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Clients"],
    }),
    createClient: builder.mutation<{ id: number }, Partial<Client>>({
      query: ({
        firstName,
        lastName,
        code,
        balance,
        commission,
        notes,
        accountId,
      }) => {
        return {
          url: "/clients",
          method: "POST",
          body: {
            accountId, // Account where the user is associated to
            firstName,
            lastName,
            code,
            balance,
            commission,
            notes,
          },
        };
      },
      invalidatesTags: ["Clients"],
    }),
    updateClient: builder.mutation<string, Partial<Client>>({
      query: ({ id, firstName, lastName, commission, notes, accountId }) => {
        return {
          url: `/clients/${id}`,
          method: "PUT",
          body: {
            accountId, // Account where the user is associated to
            firstName,
            lastName,
            commission,
            notes,
          },
        };
      },
      invalidatesTags: ["Clients"],
    }),
    updateClientBalance: builder.mutation<
      string,
      { id: number; balance: number }
    >({
      query: ({ id, balance }) => {
        return {
          url: `/clients/${id}/balance`,
          method: "PUT",
          body: {
            balance,
          },
        };
      },
      invalidatesTags: ["Clients"],
    }),
    getClientOperations: builder.query<
      PagedDataResponse<Operation[]>,
      {
        clientId: number;
        type?: "transactions" | "payments" | "all";
        from?: string;
        to?: string;
        sort?: SortBy;
      } & PagedQueryParams
    >({
      query: ({ clientId, type, from, to, limit, page, sort }) => {
        const searchParams = new URLSearchParams();
        if (type) searchParams.append("type", type.toString());
        if (from) searchParams.append("from", from.toString());
        if (to) searchParams.append("to", to.toString());
        if (limit !== undefined) searchParams.append("limit", limit.toString());
        if (page) searchParams.append("page", page.toString());
        if (sort) searchParams.append("sort", sort.toString());
        return {
          url: `/clients/${clientId}/operations?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Clients"],
    }),
    deleteClient: builder.mutation<string, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/clients/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Clients"],
    }),
  }),
  overrideExisting: false, // It's better to keep this false unless overriding
});

export const {
  // Clients
  useGetClientsQuery,
  useLazyGetClientsQuery,
  // Client
  useGetClientByIdQuery,
  useLazyGetClientByIdQuery,
  // New clients
  useCreateClientMutation,
  // Update
  useUpdateClientMutation,
  // Balance
  useUpdateClientBalanceMutation,
  // Operations
  useGetClientOperationsQuery,
  useLazyGetClientOperationsQuery,
  // Delete client
  useDeleteClientMutation,
} = clientsApi;

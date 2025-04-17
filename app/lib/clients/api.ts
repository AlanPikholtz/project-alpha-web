import api from "../api/api";
import { PagedDataResponse, PagedQueryParams } from "../api/types";
import { Client } from "./types";

export const clientsApi = api
  .enhanceEndpoints({ addTagTypes: ["Clients"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getClients: builder.query<PagedDataResponse<Client[]>, PagedQueryParams>({
        query: ({ limit = 0, page }) => {
          const searchParams = new URLSearchParams();
          if (limit) searchParams.append("limit", limit.toString());
          if (page) searchParams.append("page", page.toString());
          return {
            url: "/clients",
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
    }),
    overrideExisting: false, // It's better to keep this false unless overriding
  });

export const { useGetClientsQuery, useCreateClientMutation } = clientsApi;

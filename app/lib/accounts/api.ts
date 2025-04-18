import api from "../api/api";
import { PagedDataResponse, PagedQueryParams } from "../api/types";
import { Account } from "./types";

export const accountsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<PagedDataResponse<Account[]>, PagedQueryParams>({
      query: ({ limit = 0, page }) => {
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());
        if (page) searchParams.append("page", page.toString());
        return {
          url: `/accounts?${searchParams.toString()}`,
          method: "get",
        };
      },
    }),
  }),
});

export const { useGetAccountsQuery } = accountsApi;

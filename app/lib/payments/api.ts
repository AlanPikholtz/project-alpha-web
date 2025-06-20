import api from "../api/api";
import { PagedDataResponse, PagedQueryParams } from "../api/types";
import { Payment } from "./types";

export const paymentsApi = api
  .enhanceEndpoints({ addTagTypes: ["Payments"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getPayments: builder.query<
        PagedDataResponse<Payment[]>,
        PagedQueryParams
      >({
        query: ({ limit = 0, page }) => {
          const searchParams = new URLSearchParams();
          if (limit) searchParams.append("limit", limit.toString());
          if (page) searchParams.append("page", page.toString());
          return {
            url: `/payments?${searchParams.toString()}`,
            method: "GET",
          };
        },
      }),
      createPayment: builder.mutation<{ id: number }, Partial<Payment>>({
        query: (payment) => {
          return {
            url: `/payments`,
            method: "POST",
            body: payment,
          };
        },
        invalidatesTags: ["Payments", "Clients"],
      }),
    }),
    overrideExisting: false, // It's better to keep this false unless overriding
  });

export const { useGetPaymentsQuery, useCreatePaymentMutation } = paymentsApi;

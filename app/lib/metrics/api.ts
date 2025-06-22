import api from "../api/api";
import { Metrics } from "./types";

export const metricsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMetrics: builder.query<Metrics, { date: string }>({
      query: ({ date }) => {
        return {
          url: `/metrics?date=${date}`,
          method: "GET",
        };
      },
    }),
  }),
  overrideExisting: false, // It's better to keep this false unless overriding
});

export const { useLazyGetMetricsQuery } = metricsApi;

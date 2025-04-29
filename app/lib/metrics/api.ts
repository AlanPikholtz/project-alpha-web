import api from "../api/api";
import { Metrics } from "./types";

export const metricsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMetrics: builder.query<Metrics, void>({
      query: () => {
        return {
          url: "/metrics",
          method: "GET",
        };
      },
    }),
  }),
  overrideExisting: false, // It's better to keep this false unless overriding
});

export const { useGetMetricsQuery } = metricsApi;

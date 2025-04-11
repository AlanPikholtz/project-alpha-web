import api from "../api/api";
import { Client } from "./types";

export const clientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Client[], void>({
      query: () => ({
        url: "/clients",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false, // It's better to keep this false unless overriding
});

export const { useGetClientsQuery } = clientsApi;

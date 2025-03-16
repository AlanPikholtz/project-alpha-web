/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

// Define a custom baseQuery to handle async logic for authorization
const baseQuery = fetchBaseQuery({
  baseUrl: "https://project-alpha-development.up.railway.app/", // Cambiá esto por la URL real de tu API
  prepareHeaders: (headers, { getState }) => {
    const session = (getState() as RootState).auth.session;

    console.log({ session });

    if (session) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }
    return headers;
  },
});

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: () => ({}),
});

export default api;

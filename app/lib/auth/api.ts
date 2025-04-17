import api from "../api/api";
import { Session } from "./types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    authenticate: builder.mutation<
      Session,
      { username: string; password: string }
    >({
      query: ({ username, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          username,
          password,
        },
      }),
    }),
  }),
  overrideExisting: false, // It's better to keep this false unless overriding
});

export const { useAuthenticateMutation } = authApi;

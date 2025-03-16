import api from "../api/api";
import { Session } from "./types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    authenticate: builder.mutation<
      Session,
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
  }),
  overrideExisting: false, // It's better to keep this false unless overriding
});

export const { useAuthenticateMutation } = authApi;

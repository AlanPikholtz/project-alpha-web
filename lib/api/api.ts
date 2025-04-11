import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { Mutex } from "async-mutex";
import { Session } from "../auth/types";
import { clearSessionData, saveSessionData } from "../auth/authSlice";

// create a new mutex so we can prevent multiple requests to the refresh token api
const mutex = new Mutex();

// Define a custom baseQuery to handle async logic for authorization
const baseQuery = fetchBaseQuery({
  baseUrl: "https://project-alpha-development.up.railway.app/", // Cambiá esto por la URL real de tu API
  prepareHeaders: (headers, { getState }) => {
    const session = (getState() as RootState).auth.session;
    if (session) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      // console.debug('Refreshing the access token');
      const release = await mutex.acquire();
      try {
        // Get the current refresh token
        const refreshToken = (api.getState() as RootState).auth.session
          ?.refreshToken;
        // Setup the query params
        const refreshQuery: FetchArgs = {
          url: "/auth/refresh",
          method: "post",
          body: {
            refreshToken,
          },
        };
        // Try and refresh the token
        const refreshResult = await baseQuery(refreshQuery, api, {
          ...extraOptions,
          noAuth: true,
        });

        if (refreshResult.data) {
          // Update the store with the new session data - note the AWAIT so it will be completed before we
          // try the query again
          const session = refreshResult.data as Session;
          await api.dispatch(saveSessionData(session));
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          if (refreshResult.error?.status === 401) {
            // If we get a 401 while trying to refresh the token, clear the session data
            api.dispatch(clearSessionData());
          }
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export default api;

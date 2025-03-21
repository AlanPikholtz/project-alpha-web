import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Session } from "./types";

interface AuthState {
  session: Session | null;
}

const initialState: AuthState = {
  session: null,
};

// Saves the session data to storage and updates the store
export const saveSessionData = createAsyncThunk<Session, Session>(
  "session/saveSessionData",
  async (session) => {
    // Save cookie for middleware
    document.cookie = `token=${session.accessToken}; path=/; Secure; SameSite=Strict`;
    return session;
  }
);

// Remove the session data from storage and reset the store
export const clearSessionData = createAsyncThunk<void, void>(
  "session/clearSessionData",
  async () => {
    // Clear cookie
    document.cookie = "token=; path=/;";
    // Navigate to sign-in page
    window.location.href = "/login";
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Saving
    builder.addCase(saveSessionData.fulfilled, (state, action) => {
      state.session = action.payload;
    });

    // Clearing
    builder.addCase(clearSessionData.fulfilled, (state) => {
      state.session = null;
    });
  },
});

export default authSlice;

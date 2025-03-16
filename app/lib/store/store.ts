import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import api from "../api/api";
import authReducer from "./../auth/authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth slice
};

// Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});

// Wrap Reducer with Persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// const authMiddleware: Middleware = (store) => (next) => (action) => {
//   const state = store.getState();
//   const token = state.auth?.token;

//   if (!token) {
//     console.warn("Blocked action: User not authenticated");

//     // Prevent infinite loops by only clearing once
//     if (action.type !== "auth/clearSession") {
//       store.dispatch(clearSession());
//     }

//     return; // Stop further execution
//   }

//   return next(action);
// };

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
  // .concat(authMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

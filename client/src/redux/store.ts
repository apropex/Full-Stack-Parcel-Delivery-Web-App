import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { base_api } from "./base_api";

export const store = configureStore({
  reducer: {
    [base_api.reducerPath]: base_api.reducer,
  },

  middleware: (middle) => middle().concat(base_api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

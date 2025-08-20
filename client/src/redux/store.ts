import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {},

  middleware: (middle) => middle().concat(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

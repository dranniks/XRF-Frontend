import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "./authSlice";
import { claimsListReducer } from "./claimsListSlice";
import { draftClaimReducer } from "./draftClaimSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    draftClaim: draftClaimReducer,
    claimsList: claimsListReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

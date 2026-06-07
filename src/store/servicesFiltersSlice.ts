import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { logoutThunk, setGuestState } from "./authSlice";

interface ServicesFiltersState {
  queryInput: string;
  appliedQuery: string;
}

const initialState: ServicesFiltersState = {
  queryInput: "",
  appliedQuery: ""
};

export const servicesFiltersSlice = createSlice({
  name: "servicesFilters",
  initialState,
  reducers: {
    setServicesQueryInput: (state, action: PayloadAction<string>) => {
      state.queryInput = action.payload;
    },
    applyServicesFilters: (state) => {
      state.appliedQuery = state.queryInput;
    },
    clearServicesFilters: (state) => {
      state.queryInput = "";
      state.appliedQuery = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutThunk.fulfilled, (state) => {
        state.queryInput = "";
        state.appliedQuery = "";
      })
      .addCase(setGuestState, (state) => {
        state.queryInput = "";
        state.appliedQuery = "";
      });
  }
});

export const { setServicesQueryInput, applyServicesFilters, clearServicesFilters } = servicesFiltersSlice.actions;
export const servicesFiltersReducer = servicesFiltersSlice.reducer;

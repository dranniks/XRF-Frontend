import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { listClaimsGenerated, moderateClaimGenerated, type ClaimsFiltersPayload } from "../api/claimsGeneratedApi";
import { getApiErrorMessage } from "../api/axiosClient";
import { toClaimListItem } from "../types/api";
import type { ClaimListItem } from "../types/domain";
import { logoutThunk, setGuestState } from "./authSlice";
import type { RootState } from "./index";

interface ClaimsListState {
  items: ClaimListItem[];
  statusFilter: string;
  formedFrom: string;
  formedTo: string;
  creatorLoginFilter: string;
  loading: boolean;
  mutating: boolean;
  error: string | null;
}

const initialState: ClaimsListState = {
  items: [],
  statusFilter: "",
  formedFrom: "",
  formedTo: "",
  creatorLoginFilter: "",
  loading: false,
  mutating: false,
  error: null
};

const getToken = (state: RootState): string | null => state.auth.token;

export const fetchClaimsListThunk = createAsyncThunk<
  ClaimListItem[],
  void,
  { state: RootState; rejectValue: string }
>("claimsList/fetchClaimsList", async (_, { getState, rejectWithValue }) => {
  const token = getToken(getState());
  if (!token) {
    return rejectWithValue("Сначала выполните вход.");
  }

  const { statusFilter, formedFrom, formedTo } = getState().claimsList;
  const filters: ClaimsFiltersPayload = {
    status: statusFilter,
    formed_from: formedFrom,
    formed_to: formedTo
  };

  try {
    const response = await listClaimsGenerated(token, filters);
    return response.data.map(toClaimListItem);
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, "Не удалось загрузить список заявок."));
  }
});

export const moderateClaimThunk = createAsyncThunk<
  void,
  { claimID: number; action: "complete" | "reject" },
  { state: RootState; rejectValue: string }
>("claimsList/moderateClaim", async ({ claimID, action }, { getState, dispatch, rejectWithValue }) => {
  const token = getToken(getState());
  if (!token) {
    return rejectWithValue("Сначала выполните вход.");
  }

  try {
    await moderateClaimGenerated(token, claimID, { action });
    await dispatch(fetchClaimsListThunk());
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, "Не удалось изменить статус заявки."));
  }
});

export const claimsListSlice = createSlice({
  name: "claimsList",
  initialState,
  reducers: {
    setClaimsFilters: (
      state,
      action: PayloadAction<{
        status?: string;
        formedFrom?: string;
        formedTo?: string;
        creatorLoginFilter?: string;
      }>
    ) => {
      if (action.payload.status !== undefined) {
        state.statusFilter = action.payload.status;
      }
      if (action.payload.formedFrom !== undefined) {
        state.formedFrom = action.payload.formedFrom;
      }
      if (action.payload.formedTo !== undefined) {
        state.formedTo = action.payload.formedTo;
      }
      if (action.payload.creatorLoginFilter !== undefined) {
        state.creatorLoginFilter = action.payload.creatorLoginFilter;
      }
    },
    clearClaimsFilters: (state) => {
      state.statusFilter = "";
      state.formedFrom = "";
      state.formedTo = "";
      state.creatorLoginFilter = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClaimsListThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaimsListThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchClaimsListThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка загрузки заявок.";
      })
      .addCase(moderateClaimThunk.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(moderateClaimThunk.fulfilled, (state) => {
        state.mutating = false;
      })
      .addCase(moderateClaimThunk.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload ?? "Ошибка изменения статуса.";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.items = [];
        state.loading = false;
        state.mutating = false;
        state.error = null;
        state.statusFilter = "";
        state.formedFrom = "";
        state.formedTo = "";
        state.creatorLoginFilter = "";
      })
      .addCase(setGuestState, (state) => {
        state.items = [];
        state.loading = false;
        state.mutating = false;
        state.error = null;
        state.statusFilter = "";
        state.formedFrom = "";
        state.formedTo = "";
        state.creatorLoginFilter = "";
      });
  }
});

export const { clearClaimsFilters, setClaimsFilters } = claimsListSlice.actions;
export const claimsListReducer = claimsListSlice.reducer;

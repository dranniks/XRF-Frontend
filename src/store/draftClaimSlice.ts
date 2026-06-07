import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addServiceToDraftGenerated,
  deleteDraftClaimGenerated,
  deleteDraftMatchGenerated,
  formDraftClaimGenerated,
  getClaimDetailsGenerated,
  updateDraftClaimGenerated,
  updateDraftMatchGenerated
} from "../api/claimsGeneratedApi";
import { getApiErrorMessage } from "../api/axiosClient";
import { getDraftClaimIconAxios } from "../api/servicesAxios";
import { toClaimDetails } from "../types/api";
import type { ClaimDetails } from "../types/domain";
import { logoutThunk, setGuestState } from "./authSlice";
import type { RootState } from "./index";

interface DraftClaimState {
  draftClaimId: number | null;
  draftClaimCode: string | null;
  cartServiceCount: number;
  currentClaim: ClaimDetails | null;
  loading: boolean;
  mutating: boolean;
  error: string | null;
  infoMessage: string | null;
}

const initialState: DraftClaimState = {
  draftClaimId: null,
  draftClaimCode: null,
  cartServiceCount: 0,
  currentClaim: null,
  loading: false,
  mutating: false,
  error: null,
  infoMessage: null
};

const resolveToken = (state: RootState): string | null => state.auth.token;

export const fetchCartIconThunk = createAsyncThunk<
  { claimId: number | null; claimCode: string | null; serviceCount: number; note?: string },
  void,
  { state: RootState }
>("draftClaim/fetchCartIcon", async (_, { getState }) => {
  const token = resolveToken(getState());
  const response = await getDraftClaimIconAxios(token);
  return {
    claimId: response.data.claimId,
    claimCode: response.data.claimCode,
    serviceCount: response.data.serviceCount,
    note: response.note
  };
});

export const addServiceToDraftThunk = createAsyncThunk<
  { claimId: number; claimCode: string },
  number,
  { state: RootState; rejectValue: string }
>("draftClaim/addServiceToDraft", async (serviceID, { getState, dispatch, rejectWithValue }) => {
  const token = resolveToken(getState());
  if (!token) {
    return rejectWithValue("Сначала выполните вход.");
  }

  try {
    const response = await addServiceToDraftGenerated(token, serviceID);
    await dispatch(fetchCartIconThunk());
    await dispatch(fetchClaimByIdThunk(response.data.claim_id));
    return {
      claimId: response.data.claim_id,
      claimCode: response.data.claim_code
    };
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, "Не удалось добавить услугу в черновик."));
  }
});

export const fetchClaimByIdThunk = createAsyncThunk<
  ClaimDetails,
  number,
  { state: RootState; rejectValue: string }
>("draftClaim/fetchClaimById", async (claimID, { getState, rejectWithValue }) => {
  const token = resolveToken(getState());
  if (!token) {
    return rejectWithValue("Сначала выполните вход.");
  }

  try {
    const response = await getClaimDetailsGenerated(token, claimID);
    return toClaimDetails(response.data);
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, "Не удалось получить заявку."));
  }
});

export const updateDraftMatchThunk = createAsyncThunk<
  void,
  { serviceId: number; matchComment: string },
  { state: RootState; rejectValue: string }
>("draftClaim/updateDraftMatch", async ({ serviceId, matchComment }, { getState, dispatch, rejectWithValue }) => {
  const token = resolveToken(getState());
  const draftID = getState().draftClaim.draftClaimId;

  if (!token) {
    return rejectWithValue("Сначала выполните вход.");
  }
  if (!draftID) {
    return rejectWithValue("Черновик не найден.");
  }

  try {
    await updateDraftMatchGenerated(token, serviceId, {
      match_comment: matchComment
    });
    await dispatch(fetchClaimByIdThunk(draftID));
    await dispatch(fetchCartIconThunk());
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, "Не удалось обновить позицию заявки."));
  }
});

export const deleteDraftMatchThunk = createAsyncThunk<
  void,
  number,
  { state: RootState; rejectValue: string }
>("draftClaim/deleteDraftMatch", async (serviceID, { getState, dispatch, rejectWithValue }) => {
  const token = resolveToken(getState());
  const draftID = getState().draftClaim.draftClaimId;

  if (!token) {
    return rejectWithValue("Сначала выполните вход.");
  }
  if (!draftID) {
    return rejectWithValue("Черновик не найден.");
  }

  try {
    await deleteDraftMatchGenerated(token, serviceID);
    await dispatch(fetchClaimByIdThunk(draftID));
    await dispatch(fetchCartIconThunk());
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, "Не удалось удалить услугу из черновика."));
  }
});

export const updateDraftClaimFieldsThunk = createAsyncThunk<
  void,
  {
    claimID: number;
    operatorComment: string;
    cuMeasured: number | null;
    znMeasured: number | null;
    snMeasured: number | null;
    pbMeasured: number | null;
  },
  { state: RootState; rejectValue: string }
>(
  "draftClaim/updateDraftClaimFields",
  async ({ claimID, operatorComment, cuMeasured, znMeasured, snMeasured, pbMeasured }, { getState, dispatch, rejectWithValue }) => {
    const token = resolveToken(getState());
    if (!token) {
      return rejectWithValue("Сначала выполните вход.");
    }

    try {
      await updateDraftClaimGenerated(token, claimID, {
        operator_comment: operatorComment,
        cu_measured: cuMeasured,
        zn_measured: znMeasured,
        sn_measured: snMeasured,
        pb_measured: pbMeasured
      });
      await dispatch(fetchClaimByIdThunk(claimID));
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Не удалось сохранить поля заявки."));
    }
  }
);

export const formDraftClaimThunk = createAsyncThunk<void, number, { state: RootState; rejectValue: string }>(
  "draftClaim/formDraftClaim",
  async (claimID, { getState, dispatch, rejectWithValue }) => {
    const token = resolveToken(getState());
    if (!token) {
      return rejectWithValue("Сначала выполните вход.");
    }

    try {
      await formDraftClaimGenerated(token, claimID);
      await dispatch(fetchClaimByIdThunk(claimID));
      await dispatch(fetchCartIconThunk());
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Не удалось сформировать заявку."));
    }
  }
);

export const deleteDraftClaimThunk = createAsyncThunk<void, number, { state: RootState; rejectValue: string }>(
  "draftClaim/deleteDraftClaim",
  async (claimID, { getState, dispatch, rejectWithValue }) => {
    const token = resolveToken(getState());
    if (!token) {
      return rejectWithValue("Сначала выполните вход.");
    }

    try {
      await deleteDraftClaimGenerated(token, claimID);
      await dispatch(fetchCartIconThunk());
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Не удалось удалить черновик."));
    }
  }
);

export const draftClaimSlice = createSlice({
  name: "draftClaim",
  initialState,
  reducers: {
    clearDraftInfoMessage: (state) => {
      state.infoMessage = null;
    },
    resetDraftState: (state) => {
      state.draftClaimId = null;
      state.draftClaimCode = null;
      state.cartServiceCount = 0;
      state.currentClaim = null;
      state.loading = false;
      state.mutating = false;
      state.error = null;
      state.infoMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartIconThunk.fulfilled, (state, action) => {
        state.draftClaimId = action.payload.claimId;
        state.draftClaimCode = action.payload.claimCode;
        state.cartServiceCount = action.payload.serviceCount;
        state.infoMessage = action.payload.note ?? null;
      })
      .addCase(fetchClaimByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaimByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClaim = action.payload;
        state.draftClaimId = action.payload.id;
        state.draftClaimCode = action.payload.claimCode;
      })
      .addCase(fetchClaimByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Не удалось загрузить заявку.";
      })
      .addCase(addServiceToDraftThunk.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(addServiceToDraftThunk.fulfilled, (state, action) => {
        state.mutating = false;
        state.draftClaimId = action.payload.claimId;
        state.draftClaimCode = action.payload.claimCode;
      })
      .addCase(addServiceToDraftThunk.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload ?? "Ошибка добавления услуги.";
      })
      .addCase(updateDraftMatchThunk.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(updateDraftMatchThunk.fulfilled, (state) => {
        state.mutating = false;
      })
      .addCase(updateDraftMatchThunk.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload ?? "Ошибка изменения позиции.";
      })
      .addCase(deleteDraftMatchThunk.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(deleteDraftMatchThunk.fulfilled, (state) => {
        state.mutating = false;
      })
      .addCase(deleteDraftMatchThunk.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload ?? "Ошибка удаления позиции.";
      })
      .addCase(updateDraftClaimFieldsThunk.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(updateDraftClaimFieldsThunk.fulfilled, (state) => {
        state.mutating = false;
      })
      .addCase(updateDraftClaimFieldsThunk.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload ?? "Ошибка сохранения заявки.";
      })
      .addCase(formDraftClaimThunk.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(formDraftClaimThunk.fulfilled, (state) => {
        state.mutating = false;
      })
      .addCase(formDraftClaimThunk.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload ?? "Ошибка формирования заявки.";
      })
      .addCase(deleteDraftClaimThunk.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(deleteDraftClaimThunk.fulfilled, (state) => {
        state.mutating = false;
        state.draftClaimId = null;
        state.draftClaimCode = null;
        state.cartServiceCount = 0;
        state.currentClaim = null;
      })
      .addCase(deleteDraftClaimThunk.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload ?? "Ошибка удаления черновика.";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.draftClaimId = null;
        state.draftClaimCode = null;
        state.cartServiceCount = 0;
        state.currentClaim = null;
        state.loading = false;
        state.mutating = false;
        state.error = null;
        state.infoMessage = null;
      })
      .addCase(setGuestState, (state) => {
        state.draftClaimId = null;
        state.draftClaimCode = null;
        state.cartServiceCount = 0;
        state.currentClaim = null;
        state.loading = false;
        state.mutating = false;
        state.error = null;
        state.infoMessage = null;
      });
  }
});

export const { clearDraftInfoMessage, resetDraftState } = draftClaimSlice.actions;
export const draftClaimReducer = draftClaimSlice.reducer;

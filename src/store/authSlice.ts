import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { logoutUserAxios } from "../api/authAxios";
import { getApiErrorMessage } from "../api/axiosClient";
import type { AuthUser, UserRole } from "../types/domain";
import { clearJwtToken, saveJwtToken } from "./authStorage";
import type { RootState } from "./index";

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null
};

interface LoginSuccessPayload {
  token: string;
  user: {
    id: number;
    login: string;
    fullName: string;
    role: UserRole;
  };
}

export const logoutThunk = createAsyncThunk<void, void, { state: RootState; rejectValue: string }>(
  "auth/logoutThunk",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      clearJwtToken();
      return;
    }

    try {
      await logoutUserAxios(token);
      clearJwtToken();
    } catch (error) {
      clearJwtToken();
      return rejectWithValue(getApiErrorMessage(error, "Не удалось выполнить выход из системы."));
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequestStarted: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginRequestFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    loginRequestSucceeded: (state, action: PayloadAction<LoginSuccessPayload>) => {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = {
        id: action.payload.user.id,
        login: action.payload.user.login,
        fullName: action.payload.user.fullName,
        role: action.payload.user.role
      };
      saveJwtToken(action.payload.token);
    },
    setGuestState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload ?? "Ошибка выхода.";
      });
  }
});

export const { loginRequestStarted, loginRequestFailed, loginRequestSucceeded, setGuestState } = authSlice.actions;
export const authReducer = authSlice.reducer;

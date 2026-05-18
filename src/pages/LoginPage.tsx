import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { authUserAxios } from "../api/authAxios";
import { getApiErrorMessage } from "../api/axiosClient";
import { loginRequestFailed, loginRequestStarted, loginRequestSucceeded } from "../store/authSlice";
import { fetchCartIconThunk } from "../store/draftClaimSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { UserRole } from "../types/domain";

const normalizeRole = (role: string): UserRole => {
  if (role.toLowerCase().trim() === "moderator") {
    return "moderator";
  }
  return "creator";
};

export const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  if (authState.isAuthenticated) {
    return <Navigate to="/services" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    dispatch(loginRequestStarted());

    try {
      const data = await authUserAxios({
        login: login.trim(),
        password
      });

      dispatch(
        loginRequestSucceeded({
          token: data.token,
          user: {
            id: data.user_id,
            login: data.login,
            fullName: data.full_name,
            role: normalizeRole(data.role)
          }
        })
      );
      await dispatch(fetchCartIconThunk());

      navigate("/services", { replace: true });
    } catch (error) {
      dispatch(loginRequestFailed(getApiErrorMessage(error, "Ошибка авторизации.")));
    }
  };

  return (
    <section className="card auth-card">
      <h1 className="page-title">Авторизация</h1>
      <p className="page-subtitle">Выполните вход для работы с заявками и редактированием черновика.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Логин</span>
          <input value={login} onChange={(event) => setLogin(event.target.value)} required />
        </label>

        <label className="field">
          <span>Пароль</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        {authState.error && <p className="notice warn">{authState.error}</p>}

        <button className="chip chip-button" type="submit" disabled={authState.isLoading}>
          {authState.isLoading ? "Вход..." : "Войти"}
        </button>
      </form>
    </section>
  );
};

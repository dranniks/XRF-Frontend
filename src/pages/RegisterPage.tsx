import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { registerUserAxios } from "../api/authAxios";
import { getApiErrorMessage } from "../api/axiosClient";
import { useAppSelector } from "../store/hooks";

export const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [login, setLogin] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (isAuthenticated) {
    return <Navigate to="/services" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUserAxios({
        login: login.trim(),
        full_name: fullName.trim(),
        password
      });
      navigate("/auth/login", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Ошибка регистрации пользователя."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card">
      <h1 className="page-title">Регистрация</h1>
      <p className="page-subtitle">Создайте нового пользователя для входа в систему заявок.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Логин</span>
          <input value={login} onChange={(event) => setLogin(event.target.value)} required />
        </label>

        <label className="field">
          <span>ФИО</span>
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        </label>

        <label className="field">
          <span>Пароль</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        {error && <p className="notice warn">{error}</p>}

        <div className="auth-actions">
          <button className="chip chip-button" type="submit" disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
          <Link className="chip chip-button" to="/auth/login">
            Вернуться к входу
          </Link>
        </div>
      </form>
    </section>
  );
};

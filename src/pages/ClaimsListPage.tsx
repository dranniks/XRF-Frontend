import { useEffect, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";

import { fetchClaimsListThunk, moderateClaimThunk, setClaimsFilters } from "../store/claimsListSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const POLLING_INTERVAL_MS = 5000;

export const ClaimsListPage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const authState = useAppSelector((state) => state.auth);
  const claimsState = useAppSelector((state) => state.claimsList);
  const isModerator = authState.user?.role === "moderator";

  useEffect(() => {
    if (!authState.isAuthenticated) {
      return;
    }
    void dispatch(fetchClaimsListThunk());
  }, [authState.isAuthenticated, dispatch]);

  useEffect(() => {
    if (!authState.isAuthenticated || !isModerator) {
      return;
    }

    let cancelled = false;
    let timerID: number | null = null;

    const poll = async (): Promise<void> => {
      if (cancelled) {
        return;
      }
      await dispatch(fetchClaimsListThunk());
      if (!cancelled) {
        timerID = window.setTimeout(() => {
          void poll();
        }, POLLING_INTERVAL_MS);
      }
    };

    timerID = window.setTimeout(() => {
      void poll();
    }, POLLING_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (timerID !== null) {
        window.clearTimeout(timerID);
      }
    };
  }, [authState.isAuthenticated, dispatch, isModerator]);

  const filteredItems = useMemo(() => {
    const creatorFilter = claimsState.creatorLoginFilter.trim().toLowerCase();
    if (creatorFilter.length === 0) {
      return claimsState.items;
    }
    return claimsState.items.filter((item) => (item.creatorLogin ?? "").toLowerCase().includes(creatorFilter));
  }, [claimsState.creatorLoginFilter, claimsState.items]);

  if (!authState.isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const applyTodayRange = (): void => {
    const today = new Date().toISOString().slice(0, 10);
    dispatch(
      setClaimsFilters({
        formedFrom: today,
        formedTo: today
      })
    );
  };

  return (
    <section className="card">
      <h1 className="page-title">{isModerator ? "Реестр заявок" : "Список моих заявок"}</h1>
      <p className="page-subtitle">{isModerator ? "Доступно управление статусами заявок." : "Показаны только заявки текущего пользователя."}</p>

      <div className="search-grid">
        <label className="field">
          <span>Статус (backend)</span>
          <input
            value={claimsState.statusFilter}
            onChange={(event) => dispatch(setClaimsFilters({ status: event.target.value }))}
            placeholder="сформирован/завершен/отклонен"
          />
        </label>
        <label className="field">
          <span>Дата формирования от (backend)</span>
          <input
            type="date"
            value={claimsState.formedFrom}
            onChange={(event) => dispatch(setClaimsFilters({ formedFrom: event.target.value }))}
          />
        </label>
        <label className="field">
          <span>Дата формирования до (backend)</span>
          <input
            type="date"
            value={claimsState.formedTo}
            onChange={(event) => dispatch(setClaimsFilters({ formedTo: event.target.value }))}
          />
        </label>
        <label className="field">
          <span>Создатель (frontend фильтр)</span>
          <input
            value={claimsState.creatorLoginFilter}
            onChange={(event) => dispatch(setClaimsFilters({ creatorLoginFilter: event.target.value }))}
            placeholder="логин создателя"
          />
        </label>
      </div>

      <div className="action-row">
        <button className="chip chip-button" type="button" onClick={() => void dispatch(fetchClaimsListThunk())}>
          Применить фильтры
        </button>
        <button
          className="chip chip-button"
          type="button"
          onClick={() => {
            applyTodayRange();
            void dispatch(fetchClaimsListThunk());
          }}
        >
          Диапазон: сегодня
        </button>
      </div>

      {claimsState.error && <p className="notice warn">{claimsState.error}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Код</th>
              <th>Статус</th>
              <th>Создана</th>
              <th>Создатель</th>
              <th>Описание</th>
              <th>Результат</th>
              <th>Результатов в m-m</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9}>Нет данных по текущему фильтру.</td>
              </tr>
            ) : (
              filteredItems.map((claim) => (
                <tr key={claim.id}>
                  <td>{claim.id}</td>
                  <td>{claim.claimCode}</td>
                  <td>{claim.status}</td>
                  <td>{new Date(claim.createdAt).toLocaleString("ru-RU")}</td>
                  <td>{claim.creatorLogin ?? "-"}</td>
                  <td>{claim.artifactDescription ?? "-"}</td>
                  <td>{claim.result ?? "-"}</td>
                  <td>{claim.resultItemsCount}</td>
                  <td>
                    <div className="action-row">
                      <Link className="chip chip-button" to={`/xrf-claims/${claim.id}`}>
                        Открыть
                      </Link>
                      {isModerator && (
                        <>
                          <button
                            className="chip chip-button"
                            type="button"
                            onClick={() => void dispatch(moderateClaimThunk({ claimID: claim.id, action: "complete" }))}
                            disabled={claimsState.mutating || claim.status !== "сформирован"}
                          >
                            Завершить
                          </button>
                          <button
                            className="chip chip-button"
                            type="button"
                            onClick={() => void dispatch(moderateClaimThunk({ claimID: claim.id, action: "reject" }))}
                            disabled={claimsState.mutating || claim.status !== "сформирован"}
                          >
                            Отклонить
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

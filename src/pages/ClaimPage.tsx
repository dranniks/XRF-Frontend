import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { ServiceImage } from "../components/services/ServiceImage";
import {
  deleteDraftClaimThunk,
  deleteDraftMatchThunk,
  fetchClaimByIdThunk,
  formDraftClaimThunk,
  updateDraftMatchThunk,
  updateDraftClaimFieldsThunk
} from "../store/draftClaimSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const formatNumberInput = (value: number | null): string => (value === null ? "" : String(value));

const parseNullableNumber = (value: string): number | null => {
  const normalized = value.trim().replace(",", ".");
  if (normalized.length === 0) {
    return null;
  }
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
};

export const ClaimPage = (): JSX.Element => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const claimID = Number(id);
  const authState = useAppSelector((state) => state.auth);
  const draftState = useAppSelector((state) => state.draftClaim);
  const claim = draftState.currentClaim;

  const [operatorComment, setOperatorComment] = useState<string>("");
  const [cuMeasured, setCuMeasured] = useState<string>("");
  const [znMeasured, setZnMeasured] = useState<string>("");
  const [snMeasured, setSnMeasured] = useState<string>("");
  const [pbMeasured, setPbMeasured] = useState<string>("");
  const [matchCommentsByService, setMatchCommentsByService] = useState<Record<number, string>>({});
  const [pageError, setPageError] = useState<string>("");

  const isDraft = claim?.status === "черновик";
  const disabledByRequest = draftState.loading || draftState.mutating || authState.isLoading;

  useEffect(() => {
    if (!authState.isAuthenticated || !Number.isFinite(claimID) || claimID <= 0) {
      return;
    }
    void dispatch(fetchClaimByIdThunk(claimID));
  }, [authState.isAuthenticated, claimID, dispatch]);

  useEffect(() => {
    if (!claim) {
      return;
    }
    setOperatorComment(claim.operatorComment ?? "");
    setCuMeasured(formatNumberInput(claim.cuMeasured));
    setZnMeasured(formatNumberInput(claim.znMeasured));
    setSnMeasured(formatNumberInput(claim.snMeasured));
    setPbMeasured(formatNumberInput(claim.pbMeasured));

    const nextComments: Record<number, string> = {};
    for (const service of claim.services) {
      nextComments[service.serviceId] = service.matchComment ?? "";
    }
    setMatchCommentsByService(nextComments);
  }, [claim]);

  if (!authState.isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!Number.isFinite(claimID) || claimID <= 0) {
    return (
      <section className="card">
        <h1 className="page-title">Некорректный адрес заявки</h1>
      </section>
    );
  }

  const handleSaveClaimFields = async (): Promise<void> => {
    const payload = {
      claimID,
      operatorComment: operatorComment.trim(),
      cuMeasured: parseNullableNumber(cuMeasured),
      znMeasured: parseNullableNumber(znMeasured),
      snMeasured: parseNullableNumber(snMeasured),
      pbMeasured: parseNullableNumber(pbMeasured)
    };

    setPageError("");
    try {
      await dispatch(updateDraftClaimFieldsThunk(payload)).unwrap();
    } catch (error) {
      setPageError(typeof error === "string" ? error : "Не удалось сохранить данные заявки.");
    }
  };

  const handleDeleteRow = async (serviceID: number): Promise<void> => {
    setPageError("");
    try {
      await dispatch(deleteDraftMatchThunk(serviceID)).unwrap();
    } catch (error) {
      setPageError(typeof error === "string" ? error : "Не удалось удалить услугу из заявки.");
    }
  };

  const handleSaveRowComment = async (serviceID: number): Promise<void> => {
    setPageError("");
    try {
      await dispatch(
        updateDraftMatchThunk({
          serviceId: serviceID,
          matchComment: (matchCommentsByService[serviceID] ?? "").trim()
        })
      ).unwrap();
    } catch (error) {
      setPageError(typeof error === "string" ? error : "Не удалось сохранить комментарий позиции.");
    }
  };

  const handleDeleteClaim = async (): Promise<void> => {
    setPageError("");
    try {
      await dispatch(deleteDraftClaimThunk(claimID)).unwrap();
      navigate("/services", { replace: true });
    } catch (error) {
      setPageError(typeof error === "string" ? error : "Не удалось удалить черновик.");
    }
  };

  const handleFormClaim = async (): Promise<void> => {
    setPageError("");
    try {
      await dispatch(formDraftClaimThunk(claimID)).unwrap();
      await dispatch(fetchClaimByIdThunk(claimID)).unwrap();
    } catch (error) {
      setPageError(typeof error === "string" ? error : "Не удалось сформировать заявку.");
    }
  };

  return (
    <section className="card claim-page">
      <header className="claim-head">
        <h1 className="page-title">Заявка XRF #{claimID}</h1>
        <p className="small">
          Статус: <strong>{claim?.status ?? "загрузка"}</strong> | Услуг в заявке: <strong>{claim ? claim.services.length : 0}</strong>
        </p>
      </header>

      {(pageError || draftState.error) && <p className="notice warn">{pageError || draftState.error}</p>}

      {!claim ? (
        <article className="card">Загрузка заявки...</article>
      ) : (
        <>
          <section className="claim-form">
            <label className="field">
              <span>Комментарий оператора</span>
              <textarea
                rows={3}
                value={operatorComment}
                onChange={(event) => setOperatorComment(event.target.value)}
                disabled={!isDraft || disabledByRequest}
              />
            </label>

            <div className="freq-grid">
              <label>
                <span>Cu</span>
                <input value={cuMeasured} onChange={(event) => setCuMeasured(event.target.value)} disabled={!isDraft || disabledByRequest} />
              </label>
              <label>
                <span>Zn</span>
                <input value={znMeasured} onChange={(event) => setZnMeasured(event.target.value)} disabled={!isDraft || disabledByRequest} />
              </label>
              <label>
                <span>Sn</span>
                <input value={snMeasured} onChange={(event) => setSnMeasured(event.target.value)} disabled={!isDraft || disabledByRequest} />
              </label>
              <label>
                <span>Pb</span>
                <input value={pbMeasured} onChange={(event) => setPbMeasured(event.target.value)} disabled={!isDraft || disabledByRequest} />
              </label>
            </div>

            <div className="action-row">
              <button className="chip chip-button" type="button" onClick={handleSaveClaimFields} disabled={!isDraft || disabledByRequest}>
                Сохранить данные
              </button>
              <button className="chip chip-button" type="button" onClick={handleFormClaim} disabled={!isDraft || disabledByRequest}>
                Сформировать заявку
              </button>
              <button className="chip chip-button" type="button" onClick={handleDeleteClaim} disabled={!isDraft || disabledByRequest}>
                Удалить черновик
              </button>
            </div>
          </section>

          <section className="claim-items-section">
            <h2 className="page-title">Позиции заявки</h2>

            <div className="claim-items-head">
              <span>Услуга</span>
              <span>Комментарий</span>
              <span>Результат</span>
              <span>Действия</span>
            </div>

            {claim.services.map((service) => (
              <article className="claim-item-line" key={service.serviceId}>
                <div className="claim-item-service">
                  <ServiceImage imageUrl={service.serviceImageUrl ?? ""} alt={service.serviceName} className="claim-item-thumb" />
                  <div>
                    <p className="claim-item-title">{service.serviceName}</p>
                  </div>
                </div>

                <div className="claim-item-comment-wrap">
                  <input
                    className="claim-item-comment-input"
                    type="text"
                    value={matchCommentsByService[service.serviceId] ?? ""}
                    onChange={(event) =>
                      setMatchCommentsByService((prev) => ({
                        ...prev,
                        [service.serviceId]: event.target.value
                      }))
                    }
                    disabled={!isDraft || disabledByRequest}
                  />
                </div>

                <div className="claim-item-result">{service.resultValue ?? "-"}</div>

                <div className="claim-item-actions">
                  {isDraft ? (
                    <>
                      <button
                        className="chip chip-button"
                        type="button"
                        onClick={() => void handleSaveRowComment(service.serviceId)}
                        disabled={disabledByRequest}
                      >
                        Сохранить позицию
                      </button>
                      <button
                        className="chip chip-button"
                        type="button"
                        onClick={() => void handleDeleteRow(service.serviceId)}
                        disabled={disabledByRequest}
                      >
                        Удалить из заявки
                      </button>
                    </>
                  ) : (
                    <span className="small">—</span>
                  )}
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </section>
  );
};

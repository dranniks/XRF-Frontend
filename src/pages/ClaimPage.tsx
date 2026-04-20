import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { ServiceImage } from "../components/services/ServiceImage";
import type { Claim, ClaimInputValues, Service } from "../types/domain";

interface ClaimPageProps {
  claim: Claim;
  services: Service[];
  onSubmitClaim: (payload: ClaimInputValues) => void;
  onDeleteClaim: () => void;
}

export const ClaimPage = ({ claim, services, onSubmitClaim, onDeleteClaim }: ClaimPageProps): JSX.Element => {
  const { claimCode = "" } = useParams();
  const [formState, setFormState] = useState<ClaimInputValues>(claim.input);

  useEffect(() => {
    setFormState(claim.input);
  }, [claim.input]);

  const servicesBySlug = useMemo(() => new Map(services.map((service) => [service.slug, service])), [services]);
  const canDelete = claim.status === "черновик";

  if (claimCode !== claim.claimCode) {
    return (
      <section className="card">
        <p className="notice warn">Запрошенная заявка недоступна. Выполнен редирект на список услуг.</p>
        <p className="small">
          <Link to="/services">Открыть список услуг</Link>
        </p>
      </section>
    );
  }

  const handleFieldChange =
    (field: keyof ClaimInputValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setFormState((prev) => ({
        ...prev,
        [field]: event.target.value
      }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmitClaim(formState);
  };

  return (
    <>
      <h1 className="page-title">Ваша заявка</h1>

      <section className="card claim-head">
        <div className="id-text">
          ID заявки: <strong>{claim.claimCode}</strong>
        </div>

        <Form className="claim-form" onSubmit={handleSubmit}>
          <div className="freq-block">
            <h3>
              Интенсивности I<sub>i</sub>
            </h3>
            <div className="freq-grid">
              <label>
                Cu 8.04 keV
                <input type="text" value={formState.iCu} onChange={handleFieldChange("iCu")} placeholder="0.80" />
              </label>
              <label>
                Zn 8.64 keV
                <input type="text" value={formState.iZn} onChange={handleFieldChange("iZn")} placeholder="0.61" />
              </label>
              <label>
                Sn 3.44 keV
                <input type="text" value={formState.iSn} onChange={handleFieldChange("iSn")} placeholder="0.07" />
              </label>
              <label>
                Pb 10.55 keV
                <input type="text" value={formState.iPb} onChange={handleFieldChange("iPb")} placeholder="0.04" />
              </label>
            </div>
          </div>

          <div className="field">
            <label htmlFor="mm">Комментарий к расчету</label>
            <textarea
              id="mm"
              name="mm"
              rows={2}
              value={formState.mm}
              onChange={handleFieldChange("mm")}
              placeholder="Комментарий оператора отсутствует"
            />
          </div>

          <div className="action-row">
            {canDelete && (
              <Button variant="link" className="chip chip-button" type="submit">
                Сформировать заявку
              </Button>
            )}
            {canDelete && (
              <Button variant="link" className="chip chip-button" type="button" onClick={onDeleteClaim}>
                Удалить заявку
              </Button>
            )}
          </div>
        </Form>
      </section>

      <section>
        <div className="rows-header card claim-rows-header">
          <div>Изобр.</div>
          <div>Услуга</div>
          <div>Количество</div>
          <div>Результат расчета состава</div>
        </div>

        {claim.rows.length > 0 ? (
          claim.rows.map((row) => {
            const service = servicesBySlug.get(row.serviceSlug);

            if (!service) {
              return null;
            }

            return (
              <article className="claim-row claim-row-compact" key={`${claim.claimCode}-${row.serviceSlug}`}>
                <ServiceImage imageUrl={service.imageUrl} alt={service.name} className="claim-thumb" />
                <div>
                  <div>{service.name}</div>
                  <div className="small">{service.slug}</div>
                </div>
                <div className="mm-box">Количество: {row.quantity}</div>
                <div className="mm-box">
                  {claim.status === "сформирован" || claim.status === "завершен" || claim.status === "отклонен"
                    ? row.compositionResult
                    : "Будет рассчитано после формирования заявки"}
                </div>
              </article>
            );
          })
        ) : (
          <article className="card">В заявке пока нет услуг.</article>
        )}
      </section>
    </>
  );
};

import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppBreadcrumbs } from "./components/layout/AppBreadcrumbs";
import { SiteHeader } from "./components/layout/SiteHeader";
import { createInitialDraftClaim, createPendingRow } from "./mock/claims";
import { mockServices } from "./mock/services";
import { ClaimPage } from "./pages/ClaimPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { ServicesPage } from "./pages/ServicesPage";
import type { ClaimInputValues, ClaimRow, Service } from "./types/domain";

const parseNumber = (value: string): number => {
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatDateTime = (date: Date): string =>
  date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

const buildCalculatedRow = (row: ClaimRow, service: Service, input: ClaimInputValues): ClaimRow => {
  const iCu = parseNumber(input.iCu);
  const iZn = parseNumber(input.iZn);
  const iSn = parseNumber(input.iSn);
  const iPb = parseNumber(input.iPb);

  const kCu = parseNumber(service.cuReference) || 1;
  const kZn = parseNumber(service.znReference) || 1;
  const kSn = parseNumber(service.snReference) || 1;
  const kPb = parseNumber(service.pbReference) || 1;

  const cuWeight = iCu / kCu;
  const znWeight = iZn / kZn;
  const snWeight = iSn / kSn;
  const pbWeight = iPb / kPb;
  const total = cuWeight + znWeight + snWeight + pbWeight || 1;

  const cuPercent = (cuWeight / total) * 100;
  const znPercent = (znWeight / total) * 100;
  const snPercent = (snWeight / total) * 100;
  const pbPercent = (pbWeight / total) * 100;

  const weightedScore =
    (Math.abs(iCu - kCu) + Math.abs(iZn - kZn) + Math.abs(iSn - kSn) + Math.abs(iPb - kPb)) / 4;
  const matchScore = (1 / (1 + weightedScore)).toFixed(3);

  return {
    ...row,
    compositionResult: `Cu ${cuPercent.toFixed(2)}% | Zn ${znPercent.toFixed(2)}% | Sn ${snPercent.toFixed(2)}% | Pb ${pbPercent.toFixed(2)}%`,
    matchScore
  };
};

function App(): JSX.Element {
  const [draftClaim, setDraftClaim] = useState(createInitialDraftClaim);

  const servicesBySlug = useMemo(() => new Map(mockServices.map((service) => [service.slug, service])), []);

  const handleAddService = (serviceSlug: string): void => {
    setDraftClaim((current) => {
      const rowIndex = current.rows.findIndex((row) => row.serviceSlug === serviceSlug);
      const rows = [...current.rows];

      if (rowIndex >= 0) {
        rows[rowIndex] = {
          ...rows[rowIndex],
          quantity: rows[rowIndex].quantity + 1
        };
      } else {
        rows.push(createPendingRow(serviceSlug));
      }

      return {
        ...current,
        status: current.status === "удален" ? "черновик" : current.status,
        formedAt: current.status === "удален" ? "-" : current.formedAt,
        completionFormulaResult: current.status === "удален" ? "" : current.completionFormulaResult,
        rows
      };
    });
  };

  const handleSubmitClaim = (input: ClaimInputValues): void => {
    setDraftClaim((current) => {
      const calculatedRows = current.rows.map((row) => {
        const service = servicesBySlug.get(row.serviceSlug);

        if (!service) {
          return row;
        }

        return buildCalculatedRow(row, service, input);
      });

      const bestRow = calculatedRows.reduce<ClaimRow | null>((acc, row) => {
        if (!acc) {
          return row;
        }

        return parseNumber(row.matchScore) > parseNumber(acc.matchScore) ? row : acc;
      }, null);

      const bestService = bestRow ? servicesBySlug.get(bestRow.serviceSlug) : null;

      return {
        ...current,
        input,
        status: "сформирован",
        formedAt: formatDateTime(new Date()),
        rows: calculatedRows,
        completionFormulaResult: bestService
          ? `Наиболее вероятный эталонный сплав: ${bestService.name}`
          : "Недостаточно данных для сопоставления."
      };
    });
  };

  const handleDeleteClaim = (): void => {
    setDraftClaim((current) => ({
      ...current,
      status: "удален",
      completionFormulaResult: "Заявка логически удалена: статус изменен на \"удален\"."
    }));
  };

  return (
    <>
      <SiteHeader />

      <main className="page">
        <AppBreadcrumbs services={mockServices} />

        <Routes>
          <Route path="/" element={<Navigate to="/services" replace />} />
          <Route
            path="/services"
            element={<ServicesPage services={mockServices} draftClaim={draftClaim} onAddService={handleAddService} />}
          />
          <Route path="/services/:id" element={<ServiceDetailPage services={mockServices} />} />
          <Route
            path="/artifact_claims/:claimCode"
            element={
              <ClaimPage
                claim={draftClaim}
                services={mockServices}
                onSubmitClaim={handleSubmitClaim}
                onDeleteClaim={handleDeleteClaim}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

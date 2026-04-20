import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ServiceCard } from "../components/services/ServiceCard";
import { ServicesFilters, type ServiceFilterState } from "../components/services/ServicesFilters";
import type { Claim, Service } from "../types/domain";
import { pluralizeServices } from "../utils/format";

interface ServicesPageProps {
  services: Service[];
  draftClaim: Claim;
  onAddService: (serviceSlug: string) => void;
}

const initialFilters: ServiceFilterState = {
  query: ""
};

export const ServicesPage = ({ services, draftClaim, onAddService }: ServicesPageProps): JSX.Element => {
  const [filters, setFilters] = useState<ServiceFilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<ServiceFilterState>(initialFilters);

  const filteredServices = useMemo(() => {
    const query = appliedFilters.query.trim().toLowerCase();

    return services.filter((service) => {
      if (query.length === 0) {
        return true;
      }

      return `${service.name} ${service.era} ${service.culture}`.toLowerCase().includes(query);
    });
  }, [appliedFilters, services]);

  const claimServicesCount = draftClaim.rows.reduce((sum, row) => sum + row.quantity, 0);

  return (
    <>
      <section className="list-actions">
        <ServicesFilters value={filters} onChange={setFilters} onSubmit={() => setAppliedFilters(filters)} />

        <Link
          className={`cart-link ${claimServicesCount === 0 ? "cart-link-disabled" : ""}`}
          to={`/artifact_claims/${draftClaim.claimCode}`}
          title="Текущая заявка"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3c-1.2 0-2.2.8-2.5 2H8.4c-.8 0-1.4.6-1.4 1.4V7h10V6.4c0-.8-.6-1.4-1.4-1.4h-1.1C14.2 3.8 13.2 3 12 3zm-2.8 4v2.2c0 1.9-1.2 3.6-3.1 4.3l1 5c.1.9.8 1.5 1.7 1.5h6.4c.9 0 1.6-.6 1.7-1.5l1-5c-1.9-.7-3.1-2.4-3.1-4.3V7h-5.6zm2.8 2.3c.5 0 .9.4.9.9v3.6c0 .5-.4.9-.9.9s-.9-.4-.9-.9v-3.6c0-.5.4-.9.9-.9z" />
          </svg>
          <span>Текущая корзина</span>
          <strong>
            {claimServicesCount} {pluralizeServices(claimServicesCount)}
          </strong>
        </Link>
      </section>

      <section className="services-grid">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard key={service.slug} service={service} onAddService={onAddService} />
          ))
        ) : (
          <article className="card">По вашему запросу ничего не найдено.</article>
        )}
      </section>
    </>
  );
};

import { Link, useLocation } from "react-router-dom";

import type { Service } from "../../types/domain";

interface BreadcrumbItem {
  label: string;
  to: string;
}

interface AppBreadcrumbsProps {
  services: Service[];
}

const baseItem: BreadcrumbItem = {
  label: "Список услуг",
  to: "/services"
};

const createBreadcrumbs = (pathname: string, services: Service[]): BreadcrumbItem[] => {
  if (pathname === "/" || pathname === "/services") {
    return [baseItem];
  }

  if (pathname.startsWith("/services/")) {
    const slug = pathname.replace("/services/", "");
    const service = services.find((item) => item.slug === slug);

    return [
      baseItem,
      {
        label: service?.name ?? slug,
        to: pathname
      }
    ];
  }

  if (pathname.startsWith("/artifact_claims/")) {
    const claimCode = pathname.replace("/artifact_claims/", "");

    return [
      baseItem,
      {
        label: `Заявка ${claimCode}`,
        to: pathname
      }
    ];
  }

  return [
    baseItem,
    {
      label: "Страница не найдена",
      to: pathname
    }
  ];
};

export const AppBreadcrumbs = ({ services }: AppBreadcrumbsProps): JSX.Element => {
  const location = useLocation();
  const crumbs = createBreadcrumbs(location.pathname, services);

  return (
    <nav className="breadcrumbs" aria-label="Путь до текущей страницы">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <span className="breadcrumbs-item" key={crumb.to}>
            {isLast ? <span>{crumb.label}</span> : <Link to={crumb.to}>{crumb.label}</Link>}
            {!isLast && <span className="breadcrumbs-separator">/</span>}
          </span>
        );
      })}
    </nav>
  );
};

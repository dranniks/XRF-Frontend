import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

import type { Service } from "../../types/domain";
import { ServiceImage } from "./ServiceImage";

interface ServiceCardProps {
  service: Service;
  onAddService: (serviceSlug: string) => void;
}

export const ServiceCard = ({ service, onAddService }: ServiceCardProps): JSX.Element => (
  <Card className="service-card">
    <Link to={`/services/${service.slug}`}>
      <ServiceImage imageUrl={service.imageUrl} alt={service.name} className="service-thumb" />
      <Card.Body className="service-body">
        <h2 className="service-name">{service.name}</h2>
        {service.era !== "" && service.era !== "Не указано" && <p className="service-row">Эпоха: {service.era}</p>}
        {service.culture !== "" && service.culture !== "Не указано" && (
          <p className="service-row">Культура: {service.culture}</p>
        )}

        <p className="service-row service-coeff-line">
          Cu K: <strong>{service.cuReference}</strong> Zn K: <strong>{service.znReference}</strong> Sn L: <strong>{service.snReference}</strong> Pb L: <strong>{service.pbReference}</strong>
        </p>
      </Card.Body>
    </Link>

    <Card.Body className="service-body service-action-wrap">
      <Button variant="link" className="chip chip-button" type="button" onClick={() => onAddService(service.slug)}>
        Добавить услугу в заявку
      </Button>
    </Card.Body>
  </Card>
);

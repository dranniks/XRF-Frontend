import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getReferenceAlloyByIDAxios } from "../api/servicesAxios";
import { ServiceImage } from "../components/services/ServiceImage";
import type { Service } from "../types/domain";

export const ServiceDetailPage = (): JSX.Element => {
  const { id = "" } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadService = async (): Promise<void> => {
      setLoading(true);
      const parsedID = Number(id);
      const response = await getReferenceAlloyByIDAxios(parsedID);
      if (!isMounted) {
        return;
      }

      setService(response.data);
      setLoading(false);
    };

    void loadService();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <section className="card">Загрузка карточки услуги...</section>;
  }

  if (!service) {
    return (
      <section className="card">
        <h1 className="page-title">Услуга не найдена</h1>
        <p className="page-subtitle">Вернитесь к списку услуг и выберите существующую карточку.</p>
        <p className="small">
          <Link to="/services">Открыть список услуг</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="detail-page">
      <section className="vibes-portrait vibes-portrait-xl">
        {service.videoUrl ? (
          <video autoPlay muted loop playsInline>
            <source src={service.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <ServiceImage imageUrl={service.imageUrl} alt={service.name} className="service-thumb" />
        )}

        <div className="vibes-overlay vibes-overlay-detail">
          <div>
            <h2>{service.name}</h2>
            <p className="service-row">{service.description}</p>
          </div>

          <div className="overlay-table-wrap">
            <Table className="table table-overlay" bordered>
              <thead>
                <tr>
                  <th>Линия</th>
                  <th>Калибровочный коэффициент</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cu Kα (8.04 keV)</td>
                  <td>{service.cuReference}</td>
                </tr>
                <tr>
                  <td>Zn Kα (8.64 keV)</td>
                  <td>{service.znReference}</td>
                </tr>
                <tr>
                  <td>Sn Lα (3.44 keV)</td>
                  <td>{service.snReference}</td>
                </tr>
                <tr>
                  <td>Pb Lα (10.55 keV)</td>
                  <td>{service.pbReference}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </section>
    </section>
  );
};

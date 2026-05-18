import { mockServices, servicesByID } from "../mock/services";
import type { ApiEnvelope, BackendCartIcon, BackendService } from "../types/api";
import type { CartIcon, Service } from "../types/domain";
import { toService } from "../types/api";
import { axiosClient, getApiErrorMessage } from "./axiosClient";

export interface ServiceFiltersRequest {
  query: string;
}

export interface ApiDataResponse<T> {
  data: T;
  source: "backend" | "mock";
  note?: string;
}

const applyClientFilters = (services: Service[], filters: ServiceFiltersRequest): Service[] => {
  const query = filters.query.trim().toLowerCase();
  if (query.length === 0) {
    return services;
  }
  return services.filter((service) => service.name.toLowerCase().includes(query));
};

export const getReferenceAlloyServicesAxios = async (filters: ServiceFiltersRequest): Promise<ApiDataResponse<Service[]>> => {
  try {
    const params = filters.query.trim().length > 0 ? { q: filters.query.trim() } : {};
    const response = await axiosClient.get<ApiEnvelope<BackendService[]>>("/services", { params });
    const mapped = response.data.data.map(toService);
    return {
      data: applyClientFilters(mapped, filters),
      source: "backend"
    };
  } catch (error) {
    return {
      data: applyClientFilters(mockServices, filters),
      source: "mock",
      note: `Бэкенд недоступен: ${getApiErrorMessage(error, "использованы mock-данные.")}`
    };
  }
};

export const getReferenceAlloyByIDAxios = async (serviceID: number): Promise<ApiDataResponse<Service | null>> => {
  if (!Number.isFinite(serviceID) || serviceID <= 0) {
    return {
      data: null,
      source: "mock",
      note: "Некорректный ID услуги."
    };
  }

  try {
    const response = await axiosClient.get<ApiEnvelope<BackendService>>(`/services/${serviceID}`);
    return {
      data: toService(response.data.data),
      source: "backend"
    };
  } catch {
    return {
      data: servicesByID.get(serviceID) ?? null,
      source: "mock",
      note: "Карточка услуги показана из mock-данных."
    };
  }
};

export const getDraftClaimIconAxios = async (token: string | null): Promise<ApiDataResponse<CartIcon>> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await axiosClient.get<ApiEnvelope<BackendCartIcon>>("/claims/cart-icon", { headers });

    return {
      data: {
        claimId: response.data.data.claim_id ?? null,
        claimCode: response.data.data.claim_code ?? null,
        serviceCount: response.data.data.service_count ?? 0
      },
      source: "backend"
    };
  } catch {
    return {
      data: {
        claimId: null,
        claimCode: null,
        serviceCount: 0
      },
      source: "mock",
      note: "Иконка корзины показана в mock-режиме."
    };
  }
};

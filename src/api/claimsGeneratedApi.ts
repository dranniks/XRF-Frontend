import { ContentType } from "./generated/Api";
import { setGeneratedApiToken, xrfGeneratedApi } from "./generatedClient";
import type { ApiEnvelope, BackendClaimDetails, BackendClaimListItem } from "../types/api";

export interface ClaimsFiltersPayload {
  status: string;
  formed_from: string;
  formed_to: string;
}

interface AddServiceDraftData {
  claim_id: number;
  claim_code: string;
  service_id: number;
  match_comment: string | null;
}

interface UpdateDraftMatchPayload {
  match_comment?: string | null;
}

interface UpdateDraftClaimPayload {
  operator_comment?: string | null;
  cu_measured?: number | null;
  zn_measured?: number | null;
  sn_measured?: number | null;
  pb_measured?: number | null;
}

interface ModeratePayload {
  action: "complete" | "reject";
}

type RawRequestParams = Parameters<typeof xrfGeneratedApi.api.claimsList>[0] & {
  body?: unknown;
  type?: ContentType;
  format?: "json";
  query?: Record<string, string>;
};

const withToken = (token: string): void => {
  setGeneratedApiToken(token);
};

export const listClaimsGenerated = async (
  token: string,
  filters: ClaimsFiltersPayload
): Promise<ApiEnvelope<BackendClaimListItem[]>> => {
  withToken(token);
  const query: Record<string, string> = {};
  if (filters.status.trim().length > 0) {
    query.status = filters.status.trim();
  }
  if (filters.formed_from.trim().length > 0) {
    query.formed_from = filters.formed_from.trim();
  }
  if (filters.formed_to.trim().length > 0) {
    query.formed_to = filters.formed_to.trim();
  }

  const response = await (xrfGeneratedApi.api.claimsList as unknown as (params: RawRequestParams) => Promise<{ data: ApiEnvelope<BackendClaimListItem[]> }>)({
    secure: true,
    format: "json",
    query
  });
  return response.data;
};

export const getClaimDetailsGenerated = async (token: string, claimID: number): Promise<ApiEnvelope<BackendClaimDetails>> => {
  withToken(token);
  const response = await (xrfGeneratedApi.api.claimsDetail as unknown as (
    id: string,
    params: RawRequestParams
  ) => Promise<{ data: ApiEnvelope<BackendClaimDetails> }>)(String(claimID), {
    secure: true,
    format: "json"
  });
  return response.data;
};

export const addServiceToDraftGenerated = async (
  token: string,
  serviceID: number
): Promise<ApiEnvelope<AddServiceDraftData>> => {
  withToken(token);
  const response = await (xrfGeneratedApi.api.claimItemsCreate as unknown as (
    data: { service_id: number },
    params: RawRequestParams
  ) => Promise<{ data: ApiEnvelope<AddServiceDraftData> }>)({
    service_id: serviceID
  }, {
    secure: true,
    format: "json"
  });
  return response.data;
};

export const updateDraftMatchGenerated = async (
  token: string,
  serviceID: number,
  payload: UpdateDraftMatchPayload
): Promise<ApiEnvelope<{ claim_id: number; service_id: number; match_comment: string | null }>> => {
  withToken(token);
  const response = await (xrfGeneratedApi.api.claimItemsUpdate as unknown as (
    id: number,
    data: UpdateDraftMatchPayload,
    params: RawRequestParams
  ) => Promise<{ data: ApiEnvelope<{ claim_id: number; service_id: number; match_comment: string | null }> }>)(serviceID, payload, {
    secure: true,
    format: "json"
  });
  return response.data;
};

export const deleteDraftMatchGenerated = async (token: string, serviceID: number): Promise<void> => {
  withToken(token);
  await xrfGeneratedApi.api.claimItemsDelete(serviceID, {
    secure: true,
    format: "json"
  });
};

export const updateDraftClaimGenerated = async (
  token: string,
  claimID: number,
  payload: UpdateDraftClaimPayload
): Promise<void> => {
  withToken(token);
  await (xrfGeneratedApi.api.claimsUpdate as unknown as (id: string, params: RawRequestParams) => Promise<unknown>)(String(claimID), {
    secure: true,
    type: ContentType.Json,
    format: "json",
    body: payload
  });
};

export const formDraftClaimGenerated = async (
  token: string,
  claimID: number
): Promise<ApiEnvelope<{
  id: number;
  claim_code: string;
  status: string;
  formed_at: string;
  completion_formula_result: number;
  total_cost: number;
}>> => {
  withToken(token);
  const response = await (xrfGeneratedApi.api.claimsFormUpdate as unknown as (
    id: string,
    params: RawRequestParams
  ) => Promise<{
    data: ApiEnvelope<{
      id: number;
      claim_code: string;
      status: string;
      formed_at: string;
      completion_formula_result: number;
      total_cost: number;
    }>;
  }>)(String(claimID), {
    secure: true,
    format: "json"
  });
  return response.data;
};

export const deleteDraftClaimGenerated = async (token: string, claimID: number): Promise<void> => {
  withToken(token);
  await xrfGeneratedApi.api.claimsDelete(String(claimID), {
    secure: true,
    format: "json"
  });
};

export const moderateClaimGenerated = async (
  token: string,
  claimID: number,
  payload: ModeratePayload
): Promise<ApiEnvelope<{ id: number; claim_code: string; status: string; completed_at: string | null }>> => {
  withToken(token);
  const response = await (xrfGeneratedApi.api.claimsModerateUpdate as unknown as (
    id: string,
    params: RawRequestParams
  ) => Promise<{ data: ApiEnvelope<{ id: number; claim_code: string; status: string; completed_at: string | null }> }>)(String(claimID), {
    secure: true,
    type: ContentType.Json,
    format: "json",
    body: payload
  });
  return response.data;
};



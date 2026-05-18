import type { ClaimDetails, ClaimListItem, ClaimServiceItem, Service } from "./domain";

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

export interface BackendService {
  id: number;
  slug: string;
  name: string;
  description: string;
  clip_description_en?: string;
  image_url: string | null;
  video_url: string | null;
  era: string;
  culture: string;
  unit_price: number;
  cu_reference: number | string;
  zn_reference: number | string;
  sn_reference: number | string;
  pb_reference: number | string;
  created_at: string;
}

export interface BackendCartIcon {
  claim_id: number | null;
  claim_code: string | null;
  service_count: number;
}

export interface BackendClaimItem {
  service_id: number;
  service_slug: string;
  service_name: string;
  service_image_url: string | null;
  service_video_url: string | null;
  match_comment: string | null;
  result_value: number | null;
}

export interface BackendClaimDetails {
  id: number;
  claim_code: string;
  status: string;
  created_at: string;
  formed_at: string | null;
  completed_at: string | null;
  creator_login: string;
  moderator_login: string | null;
  operator_comment: string | null;
  cu_measured: number | null;
  zn_measured: number | null;
  sn_measured: number | null;
  pb_measured: number | null;
  best_match_label: string | null;
  completion_formula_result: number | null;
  total_cost: number | null;
  result_items_count: number;
  services: BackendClaimItem[];
}

export interface BackendClaimListItem {
  id: number;
  claim_code: string;
  status: string;
  created_at: string;
  artifact_description: string | null;
  cu_measured: number | null;
  zn_measured: number | null;
  sn_measured: number | null;
  pb_measured: number | null;
  result: number | null;
  result_items_count: number;
  creator_login?: string;
}

export interface AuthResponseData {
  user_id: number;
  login: string;
  full_name: string;
  role: string;
  token_type: string;
  token: string;
  expires_at: string;
  token_ttl: number;
  token_expires_at: string;
  auth_method: string;
}

export const asString = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) {
    return "";
  }
  return typeof value === "number" ? value.toString() : value;
};

const clipDescriptionsBySlug: Record<string, string> = {
  "alloy-bronze-cyprus":
    "Dark brown bronze ingot with oxidized rough texture and warm copper highlights under light.",
  "bronze-cyprus":
    "Dark brown bronze ingot with oxidized rough texture and warm copper highlights under light.",
  "alloy-brass-rome":
    "Warm yellow brass ingot with bright golden edges and medium metallic reflectance on surface.",
  "brass-rome":
    "Warm yellow brass ingot with bright golden edges and medium metallic reflectance on surface.",
  "alloy-iron-north":
    "Dark gray iron ingot with matte grainy texture, cold tone, and weak silver highlights.",
  "iron-north":
    "Dark gray iron ingot with matte grainy texture, cold tone, and weak silver highlights.",
  "alloy-silver-byzantium":
    "Pale silver ingot with smooth texture, strong reflectance, and bright white specular highlights.",
  "silver-byzantium":
    "Pale silver ingot with smooth texture, strong reflectance, and bright white specular highlights."
};

const buildFallbackClipDescription = (service: BackendService): string => {
  const normalizedSlug = service.slug.trim().toLowerCase();
  const bySlug = clipDescriptionsBySlug[normalizedSlug];

  if (bySlug) {
    return bySlug;
  }

  if (normalizedSlug.includes("silver")) {
    return "Ancient silver alloy artifact with bright gray metal surface for XRF similarity search.";
  }
  if (normalizedSlug.includes("brass")) {
    return "Ancient brass alloy artifact with yellow metallic surface for archaeological XRF matching.";
  }
  if (normalizedSlug.includes("bronze")) {
    return "Ancient bronze alloy artifact with brown metallic surface for archaeological XRF matching.";
  }
  if (normalizedSlug.includes("iron")) {
    return "Ancient iron alloy artifact with dark matte metal texture for archaeological XRF matching.";
  }

  return "Archaeological metal reference alloy sample for XRF spectral comparison and CLIP similarity search.";
};

const ensureClipLength = (text: string): string => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length >= 50 && normalized.length <= 100) {
    return normalized;
  }

  if (normalized.length < 50) {
    return `${normalized} Prepared for archaeological alloy search in CLIP.`;
  }

  return normalized.slice(0, 100).trimEnd();
};

export const toService = (raw: BackendService): Service => {
  const clipText =
    typeof raw.clip_description_en === "string" && raw.clip_description_en.trim().length > 0
      ? raw.clip_description_en
      : buildFallbackClipDescription(raw);

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    clipDescriptionEn: ensureClipLength(clipText),
    imageUrl: raw.image_url ?? "",
    videoUrl: raw.video_url ?? undefined,
    era: raw.era,
    culture: raw.culture,
    price: raw.unit_price,
    availableDate: raw.created_at ?? "",
    cuReference: asString(raw.cu_reference),
    znReference: asString(raw.zn_reference),
    snReference: asString(raw.sn_reference),
    pbReference: asString(raw.pb_reference)
  };
};

export const toClaimServiceItem = (item: BackendClaimItem): ClaimServiceItem => ({
  serviceId: item.service_id,
  serviceSlug: item.service_slug,
  serviceName: item.service_name,
  serviceImageUrl: item.service_image_url,
  serviceVideoUrl: item.service_video_url,
  matchComment: item.match_comment,
  resultValue: item.result_value
});

export const toClaimDetails = (claim: BackendClaimDetails): ClaimDetails => ({
  id: claim.id,
  claimCode: claim.claim_code,
  status: claim.status,
  createdAt: claim.created_at,
  formedAt: claim.formed_at,
  completedAt: claim.completed_at,
  creatorLogin: claim.creator_login,
  moderatorLogin: claim.moderator_login,
  operatorComment: claim.operator_comment,
  cuMeasured: claim.cu_measured,
  znMeasured: claim.zn_measured,
  snMeasured: claim.sn_measured,
  pbMeasured: claim.pb_measured,
  bestMatchLabel: claim.best_match_label,
  completionFormulaResult: claim.completion_formula_result,
  totalCost: claim.total_cost,
  resultItemsCount: claim.result_items_count,
  services: claim.services.map(toClaimServiceItem)
});

export const toClaimListItem = (claim: BackendClaimListItem): ClaimListItem => ({
  id: claim.id,
  claimCode: claim.claim_code,
  status: claim.status,
  createdAt: claim.created_at,
  artifactDescription: claim.artifact_description,
  cuMeasured: claim.cu_measured,
  znMeasured: claim.zn_measured,
  snMeasured: claim.sn_measured,
  pbMeasured: claim.pb_measured,
  result: claim.result,
  resultItemsCount: claim.result_items_count,
  creatorLogin: claim.creator_login
});

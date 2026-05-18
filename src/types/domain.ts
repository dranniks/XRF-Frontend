export interface Service {
  id: number;
  slug: string;
  name: string;
  description: string;
  clipDescriptionEn: string;
  imageUrl: string;
  videoUrl?: string;
  era: string;
  culture: string;
  price: number;
  availableDate: string;
  cuReference: string;
  znReference: string;
  snReference: string;
  pbReference: string;
}

export interface CartIcon {
  claimId: number | null;
  claimCode: string | null;
  serviceCount: number;
}

export type ApiStatus = "checking" | "online" | "offline";

export type UserRole = "creator" | "moderator";

export interface AuthUser {
  id: number;
  login: string;
  fullName: string;
  role: UserRole;
}

export interface ClaimListItem {
  id: number;
  claimCode: string;
  status: string;
  createdAt: string;
  artifactDescription: string | null;
  cuMeasured: number | null;
  znMeasured: number | null;
  snMeasured: number | null;
  pbMeasured: number | null;
  result: number | null;
  resultItemsCount: number;
  creatorLogin?: string;
}

export interface ClaimServiceItem {
  serviceId: number;
  serviceSlug: string;
  serviceName: string;
  serviceImageUrl: string | null;
  serviceVideoUrl: string | null;
  matchComment: string | null;
  resultValue: number | null;
}

export interface ClaimDetails {
  id: number;
  claimCode: string;
  status: string;
  createdAt: string;
  formedAt: string | null;
  completedAt: string | null;
  creatorLogin: string;
  moderatorLogin: string | null;
  operatorComment: string | null;
  cuMeasured: number | null;
  znMeasured: number | null;
  snMeasured: number | null;
  pbMeasured: number | null;
  bestMatchLabel: string | null;
  completionFormulaResult: number | null;
  totalCost: number | null;
  resultItemsCount: number;
  services: ClaimServiceItem[];
}

export interface DraftClaimUpdate {
  operator_comment?: string | null;
  cu_measured?: number | null;
  zn_measured?: number | null;
  sn_measured?: number | null;
  pb_measured?: number | null;
}

export interface DraftMatchUpdate {
  match_comment?: string | null;
}

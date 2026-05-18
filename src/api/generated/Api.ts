/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AddServiceToDraftRequest {
  service_id: number;
}

export interface AuthRequest {
  login: string;
  password: string;
}

export interface AuthResponseData {
  /** @example "jwt" */
  auth_method?: string;
  /** @format date-time */
  expires_at?: string;
  full_name?: string;
  login?: string;
  role?: string;
  token?: string;
  /** @format date-time */
  token_expires_at?: string;
  token_ttl?: number;
  /** @example "Bearer" */
  token_type?: string;
  user_id?: number;
}

export interface ErrorResponse {
  message?: string;
}

export interface RegisterRequest {
  full_name: string;
  login: string;
  password: string;
}

export interface UpdateClaimItemRequest {
  match_comment?: string | null;
}

export namespace Api {
  /**
   * No description
   * @tags ClaimItems
   * @name ClaimItemsCreate
   * @summary Add service to draft claim
   * @request POST:/api/claim-items
   * @secure
   * @response `201` `void` Created
   * @response `401` `void` Unauthorized
   */
  export namespace ClaimItemsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AddServiceToDraftRequest;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags ClaimItems
   * @name ClaimItemsDelete
   * @summary Delete service from draft
   * @request DELETE:/api/claim-items/{service_id}
   * @secure
   * @response `200` `void` OK
   * @response `401` `void` Unauthorized
   */
  export namespace ClaimItemsDelete {
    export type RequestParams = {
      serviceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags ClaimItems
   * @name ClaimItemsUpdate
   * @summary Update m-m row comment in draft
   * @request PUT:/api/claim-items/{service_id}
   * @secure
   * @response `200` `void` OK
   * @response `401` `void` Unauthorized
   */
  export namespace ClaimItemsUpdate {
    export type RequestParams = {
      serviceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateClaimItemRequest;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Guest -> 401. Creator sees only own claims. Moderator sees all claims.
   * @tags Claims
   * @name ClaimsList
   * @summary List claims
   * @request GET:/api/claims
   * @secure
   * @response `200` `void` OK
   * @response `401` `void` Unauthorized
   */
  export namespace ClaimsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Public endpoint. Returns 200 for guest and creator draft service count for authorized user.
   * @tags Claims
   * @name ClaimsCartIconList
   * @summary Get cart icon
   * @request GET:/api/claims/cart-icon
   * @response `200` `void` OK
   */
  export namespace ClaimsCartIconList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Creator only for own draft.
   * @tags Claims
   * @name ClaimsDelete
   * @summary Delete draft claim
   * @request DELETE:/api/claims/{id}
   * @secure
   * @response `200` `void` OK
   */
  export namespace ClaimsDelete {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Creator can read only own claim.
   * @tags Claims
   * @name ClaimsDetail
   * @summary Get claim by id
   * @request GET:/api/claims/{id}
   * @secure
   * @response `200` `void` OK
   */
  export namespace ClaimsDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Creator only for own draft.
   * @tags Claims
   * @name ClaimsUpdate
   * @summary Update draft claim fields
   * @request PUT:/api/claims/{id}
   * @secure
   * @response `200` `void` OK
   */
  export namespace ClaimsUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Creator only for own draft.
   * @tags Claims
   * @name ClaimsFormUpdate
   * @summary Form draft claim
   * @request PUT:/api/claims/{id}/form
   * @secure
   * @response `200` `void` OK
   */
  export namespace ClaimsFormUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Moderator only.
   * @tags Claims
   * @name ClaimsModerateUpdate
   * @summary Complete or reject claim
   * @request PUT:/api/claims/{id}/moderate
   * @secure
   * @response `200` `void` OK
   * @response `401` `void` Unauthorized
   * @response `403` `void` Forbidden
   */
  export namespace ClaimsModerateUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Public read endpoint. Supports filter: q.
   * @tags Services
   * @name ServicesList
   * @summary List services
   * @request GET:/api/services
   * @response `200` `void` OK
   */
  export namespace ServicesList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Search filter */
      q?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Requires JWT.
   * @tags Services
   * @name ServicesCreate
   * @summary Create service
   * @request POST:/api/services
   * @secure
   * @response `201` `void` Created
   * @response `401` `void` Unauthorized
   */
  export namespace ServicesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      /** Short English CLIP text (50-100 chars) */
      clip_description_en?: string;
      cu_reference?: number;
      culture?: string;
      description?: string;
      era?: string;
      /** @format binary */
      image?: File;
      name?: string;
      pb_reference?: number;
      sn_reference?: number;
      unit_price?: number;
      /** @format binary */
      video?: File;
      zn_reference?: number;
    };
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Services
   * @name ServicesDetail
   * @summary Get service by id
   * @request GET:/api/services/{id}
   * @response `200` `void` OK
   */
  export namespace ServicesDetail {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
 * @description Returns JWT for Authorization: Bearer <token>.
 * @tags Auth
 * @name UsersAuthCreate
 * @summary Authenticate and get JWT token
 * @request POST:/api/users/auth
 * @response `200` `{
    data?: AuthResponseData,

}` Authenticated
 * @response `400` `void` Validation error
*/
  export namespace UsersAuthCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AuthRequest;
    export type RequestHeaders = {};
    export type ResponseBody = {
      data?: AuthResponseData;
    };
  }

  /**
   * @description Adds current JWT to Redis blacklist until token expiration.
   * @tags Auth
   * @name UsersLogoutCreate
   * @summary Logout
   * @request POST:/api/users/logout
   * @secure
   * @response `200` `void` OK
   * @response `401` `void` Unauthorized
   */
  export namespace UsersLogoutCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Users
   * @name UsersRegisterCreate
   * @summary Register user
   * @request POST:/api/users/register
   * @response `201` `void` Created
   * @response `400` `void` Validation error
   */
  export namespace UsersRegisterCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegisterRequest;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8080",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title XRF Lab4 API
 * @version 1.0.0
 * @baseUrl http://localhost:8080
 *
 * REST API with JWT authorization and role permissions (creator/moderator).
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags ClaimItems
     * @name ClaimItemsCreate
     * @summary Add service to draft claim
     * @request POST:/api/claim-items
     * @secure
     * @response `201` `void` Created
     * @response `401` `void` Unauthorized
     */
    claimItemsCreate: (
      data: AddServiceToDraftRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/claim-items`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ClaimItems
     * @name ClaimItemsDelete
     * @summary Delete service from draft
     * @request DELETE:/api/claim-items/{service_id}
     * @secure
     * @response `200` `void` OK
     * @response `401` `void` Unauthorized
     */
    claimItemsDelete: (serviceId: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/claim-items/${serviceId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ClaimItems
     * @name ClaimItemsUpdate
     * @summary Update m-m row comment in draft
     * @request PUT:/api/claim-items/{service_id}
     * @secure
     * @response `200` `void` OK
     * @response `401` `void` Unauthorized
     */
    claimItemsUpdate: (
      serviceId: number,
      data: UpdateClaimItemRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/claim-items/${serviceId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Guest -> 401. Creator sees only own claims. Moderator sees all claims.
     *
     * @tags Claims
     * @name ClaimsList
     * @summary List claims
     * @request GET:/api/claims
     * @secure
     * @response `200` `void` OK
     * @response `401` `void` Unauthorized
     */
    claimsList: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/claims`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Public endpoint. Returns 200 for guest and creator draft service count for authorized user.
     *
     * @tags Claims
     * @name ClaimsCartIconList
     * @summary Get cart icon
     * @request GET:/api/claims/cart-icon
     * @response `200` `void` OK
     */
    claimsCartIconList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/claims/cart-icon`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Creator only for own draft.
     *
     * @tags Claims
     * @name ClaimsDelete
     * @summary Delete draft claim
     * @request DELETE:/api/claims/{id}
     * @secure
     * @response `200` `void` OK
     */
    claimsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/claims/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Creator can read only own claim.
     *
     * @tags Claims
     * @name ClaimsDetail
     * @summary Get claim by id
     * @request GET:/api/claims/{id}
     * @secure
     * @response `200` `void` OK
     */
    claimsDetail: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/claims/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Creator only for own draft.
     *
     * @tags Claims
     * @name ClaimsUpdate
     * @summary Update draft claim fields
     * @request PUT:/api/claims/{id}
     * @secure
     * @response `200` `void` OK
     */
    claimsUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/claims/${id}`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Creator only for own draft.
     *
     * @tags Claims
     * @name ClaimsFormUpdate
     * @summary Form draft claim
     * @request PUT:/api/claims/{id}/form
     * @secure
     * @response `200` `void` OK
     */
    claimsFormUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/claims/${id}/form`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Moderator only.
     *
     * @tags Claims
     * @name ClaimsModerateUpdate
     * @summary Complete or reject claim
     * @request PUT:/api/claims/{id}/moderate
     * @secure
     * @response `200` `void` OK
     * @response `401` `void` Unauthorized
     * @response `403` `void` Forbidden
     */
    claimsModerateUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/claims/${id}/moderate`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Public read endpoint. Supports filter: q.
     *
     * @tags Services
     * @name ServicesList
     * @summary List services
     * @request GET:/api/services
     * @response `200` `void` OK
     */
    servicesList: (
      query?: {
        /** Search filter */
        q?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/services`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Requires JWT.
     *
     * @tags Services
     * @name ServicesCreate
     * @summary Create service
     * @request POST:/api/services
     * @secure
     * @response `201` `void` Created
     * @response `401` `void` Unauthorized
     */
    servicesCreate: (
      data: {
        /** Short English CLIP text (50-100 chars) */
        clip_description_en?: string;
        cu_reference?: number;
        culture?: string;
        description?: string;
        era?: string;
        /** @format binary */
        image?: File;
        name?: string;
        pb_reference?: number;
        sn_reference?: number;
        unit_price?: number;
        /** @format binary */
        video?: File;
        zn_reference?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/services`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Services
     * @name ServicesDetail
     * @summary Get service by id
     * @request GET:/api/services/{id}
     * @response `200` `void` OK
     */
    servicesDetail: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/services/${id}`,
        method: "GET",
        ...params,
      }),

    /**
 * @description Returns JWT for Authorization: Bearer <token>.
 *
 * @tags Auth
 * @name UsersAuthCreate
 * @summary Authenticate and get JWT token
 * @request POST:/api/users/auth
 * @response `200` `{
    data?: AuthResponseData,

}` Authenticated
 * @response `400` `void` Validation error
 */
    usersAuthCreate: (data: AuthRequest, params: RequestParams = {}) =>
      this.request<
        {
          data?: AuthResponseData;
        },
        void
      >({
        path: `/api/users/auth`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Adds current JWT to Redis blacklist until token expiration.
     *
     * @tags Auth
     * @name UsersLogoutCreate
     * @summary Logout
     * @request POST:/api/users/logout
     * @secure
     * @response `200` `void` OK
     * @response `401` `void` Unauthorized
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/users/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersRegisterCreate
     * @summary Register user
     * @request POST:/api/users/register
     * @response `201` `void` Created
     * @response `400` `void` Validation error
     */
    usersRegisterCreate: (data: RegisterRequest, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}

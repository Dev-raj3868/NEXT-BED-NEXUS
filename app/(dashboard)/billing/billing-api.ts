import axios from "axios";

export const CLINIC_ID = "clinic001";

type BillingApiSuccess = 1 | 0 | -1;

export interface BillingApiResponse<T = any> {
  apiSuccess: BillingApiSuccess;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

export const billingPost = async <T = any>(
  endpoint: string,
  body: Record<string, any> = {}
): Promise<BillingApiResponse<T>> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/billing/${endpoint}`,
    {
      ...body,
      clinic_id: CLINIC_ID,
    },
    {
      withCredentials: true,
      validateStatus: (status) => [200, 400, 500].includes(status),
    }
  );

  const data = response.data || {};

  return {
    ...data,
    apiSuccess: data.apiSuccess ?? data.resSuccess,
  };
};

export const cleanPayload = <T extends Record<string, any>>(payload: T): T => {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as T;
};

export const getBillingMessage = (response: BillingApiResponse, fallback: string) => {
  if (response.message) return response.message;
  const firstError = response.errors && Object.values(response.errors)[0];
  return firstError || fallback;
};

export const toISODate = (date?: Date) => {
  return date ? date.toISOString().slice(0, 10) : undefined;
};

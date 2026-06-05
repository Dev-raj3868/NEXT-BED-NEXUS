import axios from "axios";

export type BedManagementAdminProfile = {
  clinic_id: string;
  name: string;
  email: string;
  number: string;
  [key: string]: unknown;
};

export type BedManagementAuthSession = {
  token: string;
  admin: BedManagementAdminProfile;
};

export type BedManagementLoginInput = {
  email: string;
  password: string;
};

export type BedManagementSignupInput = {
  clinic_id: string;
  name: string;
  email: string;
  number: string;
  password: string;
};

const STORAGE_KEYS = {
  token: "bed-management-admin-token",
  admin: "bed-management-admin-profile",
} as const;

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export const bedManagementAuthClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Configure Axios to automatically clear cookies on 401 or redirect
bedManagementAuthClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export async function logoutBedManagementAdmin() {
  try {
    await bedManagementAuthClient.post("/bedManagementAuth/logout");
  } catch (error) {
    // Ignore errors on logout
  }
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export function getBedManagementAuthErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; error?: string; detail?: string; details?: unknown }
      | undefined;

    if (typeof responseData?.message === "string" && responseData.message.trim()) {
      return responseData.message;
    }

    if (typeof responseData?.error === "string" && responseData.error.trim()) {
      return responseData.error;
    }

    if (typeof responseData?.detail === "string" && responseData.detail.trim()) {
      return responseData.detail;
    }

    if (Array.isArray(responseData?.details) && responseData.details.length > 0) {
      return responseData.details.map((detail) => String(detail)).join(" ");
    }

    return error.response?.status === 401
      ? "Invalid email or password."
      : error.response?.status === 409
        ? "An admin already exists for this hospital or email."
        : error.message || "Unable to complete the request. Please try again.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to complete the request. Please try again.";
}

export async function loginBedManagementAdmin(input: BedManagementLoginInput) {
  const response = await bedManagementAuthClient.post("/bedManagementAuth/login", input);
  return response.data;
}

export async function signupBedManagementAdmin(input: BedManagementSignupInput) {
  const response = await bedManagementAuthClient.post("/bedManagementAuth/signup", input);
  return response.data;
}

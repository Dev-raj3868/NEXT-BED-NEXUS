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

export function setBedManagementAuthToken(token: string | null) {
  if (token) {
    bedManagementAuthClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete bedManagementAuthClient.defaults.headers.common.Authorization;
}

function safeParseJson(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function normalizeAdminProfile(source: Record<string, unknown>): BedManagementAdminProfile {
  const clinicId = String(source.clinic_id ?? source.clinicId ?? "");
  const name = String(source.name ?? "");
  const email = String(source.email ?? "");
  const number = String(source.number ?? source.phone ?? source.mobile ?? "");

  return {
    ...source,
    clinic_id: clinicId,
    name,
    email,
    number,
  };
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function pickSessionSource(payload: unknown): Record<string, unknown> {
  const root = toRecord(payload);
  const nested = toRecord(root.data);

  return toRecord(
    root.admin ?? root.user ?? root.profile ?? nested.admin ?? nested.user ?? nested.profile ?? nested.data ?? root.data ?? root,
  );
}

function extractToken(payload: unknown): string {
  const root = toRecord(payload);
  const nested = toRecord(root.data);

  return String(
    root.token ?? root.access_token ?? root.jwt ?? nested.token ?? nested.access_token ?? nested.jwt ?? "",
  );
}

export function normalizeBedManagementAuthResponse(payload: unknown): BedManagementAuthSession {
  const token = extractToken(payload);
  const admin = normalizeAdminProfile(pickSessionSource(payload));

  return {
    token,
    admin,
  };
}

export function readBedManagementAuthSession(): BedManagementAuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = window.localStorage.getItem(STORAGE_KEYS.token);
  const admin = safeParseJson(window.localStorage.getItem(STORAGE_KEYS.admin));

  if (!token || !admin || typeof admin !== "object") {
    return null;
  }

  return {
    token,
    admin: normalizeAdminProfile(admin as Record<string, unknown>),
  };
}

export function saveBedManagementAuthSession(session: BedManagementAuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.token, session.token);
  window.localStorage.setItem(STORAGE_KEYS.admin, JSON.stringify(session.admin));
}

export function clearBedManagementAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.token);
  window.localStorage.removeItem(STORAGE_KEYS.admin);
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
  const session = normalizeBedManagementAuthResponse(response.data);

  if (!session.token) {
    throw new Error("The login response did not include a token.");
  }

  return session;
}

export async function signupBedManagementAdmin(input: BedManagementSignupInput) {
  const response = await bedManagementAuthClient.post("/bedManagementAuth/signup", input);
  const session = normalizeBedManagementAuthResponse(response.data);

  if (!session.token) {
    throw new Error("The signup response did not include a token.");
  }

  return session;
}

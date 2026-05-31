'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  clearBedManagementAuthSession,
  readBedManagementAuthSession,
  saveBedManagementAuthSession,
  setBedManagementAuthToken,
  type BedManagementAdminProfile,
  type BedManagementAuthSession,
} from "@/lib/bed-management-auth";

type BedManagementAuthContextValue = {
  admin: BedManagementAdminProfile | null;
  token: string | null;
  session: BedManagementAuthSession | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  signIn: (session: BedManagementAuthSession) => void;
  signOut: () => void;
};

const BedManagementAuthContext = createContext<BedManagementAuthContextValue | undefined>(undefined);

export function BedManagementAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<BedManagementAuthSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedSession = readBedManagementAuthSession();

    if (storedSession) {
      setSession(storedSession);
      setBedManagementAuthToken(storedSession.token);
    }

    setIsHydrated(true);
  }, []);

  const signIn = useCallback((nextSession: BedManagementAuthSession) => {
    setSession(nextSession);
    saveBedManagementAuthSession(nextSession);
    setBedManagementAuthToken(nextSession.token);
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    clearBedManagementAuthSession();
    setBedManagementAuthToken(null);
  }, []);

  const value = useMemo<BedManagementAuthContextValue>(
    () => ({
      admin: session?.admin ?? null,
      token: session?.token ?? null,
      session,
      isHydrated,
      isAuthenticated: Boolean(session?.token),
      signIn,
      signOut,
    }),
    [isHydrated, session, signIn, signOut],
  );

  return <BedManagementAuthContext.Provider value={value}>{children}</BedManagementAuthContext.Provider>;
}

export function useBedManagementAuth() {
  const context = useContext(BedManagementAuthContext);

  if (!context) {
    throw new Error("useBedManagementAuth must be used within BedManagementAuthProvider");
  }

  return context;
}

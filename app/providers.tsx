'use client';

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ReactNode } from "react";
import { BedManagementAuthProvider } from "@/components/auth/bed-management-auth-provider";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BedManagementAuthProvider>
          <Toaster />
          <Sonner />
          {children}
        </BedManagementAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

'use client';

import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BedDouble, ShieldCheck, Sparkles, Activity } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_49%,hsl(var(--border)/0.35)_50%,transparent_51%,transparent_100%)] bg-[length:72px_72px] opacity-20" />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:flex flex-col justify-between border-r border-border/70 bg-card/60 px-10 py-12 xl:px-16 xl:py-14 backdrop-blur-sm">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <BedDouble className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Healthka Doctor ERP</p>
                <h1 className="text-xl font-semibold text-foreground">Bed Management Admin Access</h1>
              </div>
            </div>

            <div className="space-y-5 max-w-lg">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                Secure access for ward operations
              </Badge>
              <div className="space-y-3">
                <h2 className="text-4xl font-semibold tracking-tight text-foreground xl:text-5xl">
                  Move faster across bed allocation, admissions, and transfers.
                </h2>
                <p className="text-base leading-7 text-muted-foreground">
                  Keep bed management admins on a single secure entry point with validated credentials,
                  persistent sessions, and immediate dashboard access.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-background/80 p-4 shadow-sm backdrop-blur">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-medium text-foreground">Token-backed session storage</p>
                <p className="mt-1 text-sm text-muted-foreground">Persisted admin sign-in with route protection.</p>
              </div>
              <div className="rounded-2xl border bg-background/80 p-4 shadow-sm backdrop-blur">
                <Activity className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-medium text-foreground">Dashboard-ready workflow</p>
                <p className="mt-1 text-sm text-muted-foreground">Login and signup land directly in the ward console.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Separator />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Built for the hospital admin experience, not a generic auth stub.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import Sidebar from "@/components/layout/Sidebar";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBedManagementAuth } from "@/components/auth/bed-management-auth-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { admin, isAuthenticated, isHydrated, signOut } = useBedManagementAuth();
  console.log("Admin:", admin);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-2xl border bg-card px-6 py-5 shadow-card text-sm text-muted-foreground">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="lg:pl-0 pl-12 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">Bed Management Dashboard</h2>
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs">
                Admin
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground hidden sm:block">Manage beds, patients & operations</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <div className="hidden md:flex items-center gap-2 rounded-full border bg-background px-3 py-1.5">
              <User className="w-4 h-4 text-muted-foreground" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground leading-none">{admin?.name || "Bed Admin"}</p>
                <p className="text-xs text-muted-foreground leading-none mt-1">{admin?.clinic_id || "Clinic ID"}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

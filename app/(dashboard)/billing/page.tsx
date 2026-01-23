'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Search } from "lucide-react";

export default function BillingPage() {
  const billingOptions = [
    {
      title: "Create Bill",
      description: "Create a new billing record",
      path: "/billing/create",
      icon: FileText,
    },
    {
      title: "Get Bill",
      description: "Search and view existing bills",
      path: "/billing/search",
      icon: Search,
    },
    {
      title: "Create Final Bill",
      description: "Generate the final consolidated bill for discharge",
      path: "/billing/create-final",
      icon: FileText,
    },
    {
      title: "Get Final Bill",
      description: "Search and view final bills",
      path: "/billing/get-final",
      icon: Search,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing/Finance</h1>
        <p className="text-muted-foreground mt-1">Manage patient billing and financial records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {billingOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Link key={option.path} href={option.path}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{option.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Go to {option.title}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

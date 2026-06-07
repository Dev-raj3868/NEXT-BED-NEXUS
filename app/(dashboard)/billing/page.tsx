'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CreditCard, FileText, Loader2, Search } from "lucide-react";
import { billingPost } from "./billing-api";

export default function BillingPage() {
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [paymentsSummary, setPaymentsSummary] = useState<any>(null);
  const [divisionSummary, setDivisionSummary] = useState<any[]>([]);

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
    {
      title: "Receive Payment",
      description: "Record payments against a bill",
      path: "/billing/payment",
      icon: CreditCard,
    },
    {
      title: "Payment Records",
      description: "Search and audit payment records",
      path: "/billing/get-payment",
      icon: Search,
    },
  ];

  useEffect(() => {
    const loadSummaries = async () => {
      setSummaryLoading(true);
      try {
        const [payments, divisions] = await Promise.all([
          billingPost("get_payments_summary", { group_by: "method" }),
          billingPost("get_division_summary"),
        ]);

        if (payments.apiSuccess === 1) {
          setPaymentsSummary((payments.data as any)?.summary || payments.data || null);
        }
        if (divisions.apiSuccess === 1) {
          setDivisionSummary((divisions.data as any)?.divisions || []);
        }
      } catch (error) {
        setPaymentsSummary(null);
        setDivisionSummary([]);
      } finally {
        setSummaryLoading(false);
      }
    };

    loadSummaries();
  }, []);

  const totalOutstanding = divisionSummary.reduce((total, division) => total + Number(division.outstanding || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing/Finance</h1>
        <p className="text-muted-foreground mt-1">Manage patient billing and financial records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Received</p>
            <p className="text-2xl font-bold">
              {summaryLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `INR ${Number(paymentsSummary?.total_received || 0).toLocaleString()}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Payment Methods</p>
            <p className="text-2xl font-bold">
              {summaryLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : Object.keys(paymentsSummary?.by_method || {}).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-2xl font-bold"> 
              {summaryLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `INR ${totalOutstanding.toLocaleString()}`}
            </p>
          </CardContent>
        </Card>
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

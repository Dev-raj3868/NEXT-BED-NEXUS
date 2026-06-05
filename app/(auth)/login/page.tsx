'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BedDouble, ShieldCheck, Mail, Lock, Sparkles } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  getBedManagementAuthErrorMessage,
  loginBedManagementAdmin,
} from "@/lib/bed-management-auth";
import type { BedManagementLoginInput } from "@/lib/bed-management-auth";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      const response = await loginBedManagementAdmin(values as BedManagementLoginInput);
      toast({
        title: "Signed in successfully",
        description: `Welcome back${response?.admin?.name ? `, ${response.admin.name}` : ""}.`,
      });
      router.replace("/dashboard");
    } catch (error) {
      form.setError("root", { message: getBedManagementAuthErrorMessage(error) });
    }
  };

  return (
    <Card className="shadow-card border-border/70 bg-card/95 backdrop-blur-sm animate-scale-in">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <BedDouble className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
            Bed Management Admin
          </Badge>
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="mt-2">
              Sign in to access hospital bed operations, admissions, and ward controls.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
            {form.formState.errors.root?.message ? (
              <Alert variant="destructive">
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            ) : null}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input {...field} type="email" autoComplete="email" placeholder="admin@hospital.com" className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input {...field} type="password" autoComplete="current-password" placeholder="Enter your password" className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-2xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                <p>Only validated bed management admins can access the dashboard.</p>
              </div>
            </div>

            <Button type="submit" className="w-full" variant="gradient" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-between gap-4 text-sm">
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Create an admin account
              </Link>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Secure session persistence</span>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

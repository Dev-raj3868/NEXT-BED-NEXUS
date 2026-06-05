'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Building2, Lock, Mail, PhoneCall, UserRound, ShieldCheck, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
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
  signupBedManagementAdmin,
} from "@/lib/bed-management-auth";

const signupSchema = z.object({
  hospital_id: z.string().trim().min(1, "Hospital ID is required."),
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  number: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(/^[0-9+()\-\s]{6,}$/, "Enter a valid phone number."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Use at least 8 characters.")
    .regex(/[a-z]/, "Include a lowercase letter.")
    .regex(/[A-Z]/, "Include an uppercase letter.")
    .regex(/[0-9]/, "Include a number.")
    .regex(/[^A-Za-z0-9]/, "Include a special character."),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      hospital_id: "",
      name: "",
      email: "",
      number: "",
      password: "",
    },
  });

  const handleSignup = async (values: SignupFormValues) => {
    try {
      const response = await signupBedManagementAdmin(values);
      toast({
        title: "Account created",
        description: `Bed management admin access is ready${response?.admin?.name ? ` for ${response.admin.name}` : ""}.`,
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
          <Building2 className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
            New Bed Management Admin
          </Badge>
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">Create your admin account</CardTitle>
            <CardDescription className="mt-2">
              Register a secure bed management admin profile for your hospital or ward.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-5">
            {form.formState.errors.root?.message ? (
              <Alert variant="destructive">
                <AlertTitle>Signup failed</AlertTitle>
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="hospital_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital ID</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input {...field} autoComplete="off" placeholder="HSP-1024" className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input {...field} autoComplete="name" placeholder="Admin name" className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <PhoneCall className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input {...field} type="tel" inputMode="tel" autoComplete="tel" placeholder="+1 555 012 3456" className="pl-10" />
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
                      <Input {...field} type="password" autoComplete="new-password" placeholder="Create a strong password" className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-2xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                <p>
                  Passwords must be at least 8 characters and include uppercase, lowercase, numeric, and special characters.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" variant="gradient" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating account..." : "Create admin account"}
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-between gap-4 text-sm">
              <Link href="/login" className="font-medium text-primary hover:underline">
                Back to login
              </Link>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Starts protected session on success</span>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
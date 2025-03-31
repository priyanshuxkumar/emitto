"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleIcon from "./Icons/Google.icon";
import Link from "next/link";
import { toast } from "sonner";
import { AxiosError } from "axios";
import AxiosInstance from "@/utils/axiosInstance";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormSchema } from "@/types/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function SignupForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
    try {
      setIsSubmitting(true);
      const response = await AxiosInstance.post(
        "/api/auth/signup",
        {
          name: values.name,
          email: values.email,
          password: values.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        toast.success("Signup Successful", {
          description: response.data.message,
        });
        router.push("/emails");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || "Login failed";

        toast.error("Login Error", {
          description: errorMessage,
        });

        setErrors((prev) => ({
          ...prev,
          general: errorMessage,
        }));
      } else {
        toast.error("Unexpected Error", {
          description: "An unexpected error occurred",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create a Ezysend account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing up" : "Create account"}
              </Button>
            </form>
          </Form>
          <div className="mt-5 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <div className="mt-5">
            <Button variant="outline" className="w-full">
              <GoogleIcon />
              Signup with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="/legal/terms-of-services">Terms of Service</Link> and{" "}
        <Link href="/legal/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  );
}

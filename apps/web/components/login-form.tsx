'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleIcon from "./Icons/Google.icon";
import Link from "next/link";
import { FormEvent, useState } from "react";
import AxiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { validateSigninForm } from "@/helper";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isSubmitting , setIsSubmitting] = useState<boolean>(false);
  const [email , setEmail] = useState<string>('');
  const [password , setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleFormSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateSigninForm({email, password, setErrors})) return;
    try {
      setIsSubmitting(true);
      const response = await AxiosInstance.post('/api/auth/signin', {
        email,
        password
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if(response.status == 200) {
        toast.success('Login Successful', {
          description: 'Redirecting to dashboard...'
        });
        router.push('/dashboard');
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || 'Login failed';

        toast.error('Login Error', {
          description: errorMessage
        });

        setErrors(prev => ({
          ...prev,
          general: errorMessage
        }));
      } else {
        toast.error('Unexpected Error', {
          description: 'An unexpected error occurred'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <GoogleIcon/>
                  Login with Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className={`${errors.password && 'border-red-500'}`}
                    onChange={(e) => setEmail(e.target.value)} 
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                   {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forget-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input onChange={(e) => setPassword(e.target.value)} id="password" type="password" placeholder="********" required 
                    className={`${errors.password && 'border-red-500'}`}
                  />
                   {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                </div>
                <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in' : 'Sign in'}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="/legal/terms-of-services">Terms of Service</Link>{" "}
        and <Link href="/legal/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  )
}

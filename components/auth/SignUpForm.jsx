"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Crown,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useSignUp, useSignInWithGoogle } from '@/lib/hooks/use-auth';
import { USER_ROLES } from '@/lib/appwrite';

// Enhanced validation schema
const formSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name must be less than 50 characters.' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address.' }),
  phone: z.string()
    .min(11, { message: 'Phone number must be at least 11 digits.' })
    .max(15, { message: 'Phone number must be less than 15 digits.' })
    .regex(/^[0-9+\-\s()]+$/, { message: 'Please enter a valid phone number.' })
    .optional()
    .or(z.literal('')),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain uppercase, lowercase, and number.'
    }),
  confirmPassword: z.string(),
  role: z.enum(['user', 'tailor', 'embroideryMan', 'stoneMan'], {
    required_error: 'Please select a role.',
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500'
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              level <= strength ? strengthColors[strength - 1] : 'bg-muted'
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Strength: <span className="font-medium">{strengthLabels[strength - 1] || 'Very Weak'}</span>
        </span>
        {strength >= 3 ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <XCircle className="h-3 w-3 text-red-500" />
        )}
      </div>
    </div>
  );
};

const roleOptions = [
  { value: 'user', label: 'Customer', description: 'Place orders and track progress' },
  { value: 'tailor', label: 'Tailor', description: 'Handle sewing and tailoring tasks' },
  { value: 'embroideryMan', label: 'Embroidery Specialist', description: 'Handle embroidery work' },
  { value: 'stoneMan', label: 'Stone Work Specialist', description: 'Handle stone and beadwork' },
];

export default function EnhancedSignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: signUp, isPending, error } = useSignUp();
  const { mutate: signInWithGoogle, isPending: isGoogleLoading } = useSignInWithGoogle();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: USER_ROLES.USER,
      acceptTerms: false,
    },
  });

  const onSubmit = (values) => {
    const { confirmPassword, acceptTerms, ...submitData } = values;
    signUp(submitData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 shadow-xl">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Join Our Platform
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Create your account and start your journey with us
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Google Sign Up Button */}
          <Button
            onClick={() => signInWithGoogle()}
            variant="outline"
            className="w-full h-12 border-2 hover:border-primary/50 transition-all duration-300"
            disabled={isGoogleLoading || isPending}
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-medium">
                Or sign up with email
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your full name"
                            className="pl-10"
                            {...field}
                          />
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            {...field}
                          />
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="+1 (555) 123-4567"
                            className="pl-10"
                            {...field}
                          />
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{role.label}</span>
                                <span className="text-xs text-muted-foreground">{role.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      <PasswordStrengthIndicator password={field.value} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        I agree to the{' '}
                        <a href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isPending || isGoogleLoading}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </Form>

          {error && (
            <div className="flex items-center space-x-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error.message}</span>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <a href="/sign-in" className="text-primary hover:underline font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
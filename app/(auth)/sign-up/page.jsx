"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSignUp, useSignInWithGoogle } from "@/lib/hooks/use-auth"
import { ROLES, getRoleDisplayName } from "@/lib/roles"

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().min(8, { message: "Please enter a valid phone number." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      }),
    confirmPassword: z.string(),
    role: z.enum([ROLES.USER, ROLES.TAILOR, ROLES.EMBROIDERY_MAN, ROLES.STONE_MAN], {
      required_error: "Please select a role.",
    }),
    shopId: z.string().min(1, { message: "Please select a shop." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Mock shop data - in production this would come from API
const shops = [
  { id: "shop1", name: "Muscat Main Branch", location: "Al Khuwair, Muscat" },
  { id: "shop2", name: "Salalah Branch", location: "Al Dahariz, Salalah" },
  { id: "shop3", name: "Nizwa Branch", location: "Al Aqr, Nizwa" },
  { id: "shop4", name: "Sur Branch", location: "Al Ayjah, Sur" },
]

const availableRoles = [
  { value: ROLES.USER, label: getRoleDisplayName(ROLES.USER) },
  { value: ROLES.TAILOR, label: getRoleDisplayName(ROLES.TAILOR) },
  { value: ROLES.EMBROIDERY_MAN, label: getRoleDisplayName(ROLES.EMBROIDERY_MAN) },
  { value: ROLES.STONE_MAN, label: getRoleDisplayName(ROLES.STONE_MAN) },
]

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { mutate: signUp, isPending: isSigningUp, error: signUpError } = useSignUp()
  const { mutate: signInWithGoogle, isPending: isGoogleSigningIn } = useSignInWithGoogle()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "",
      shopId: "",
    },
  })

  const password = form.watch("password")

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" }

    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++

    const levels = [
      { score: 0, label: "Very Weak", color: "text-red-500" },
      { score: 1, label: "Weak", color: "text-red-400" },
      { score: 2, label: "Fair", color: "text-yellow-500" },
      { score: 3, label: "Good", color: "text-blue-500" },
      { score: 4, label: "Strong", color: "text-green-500" },
      { score: 5, label: "Very Strong", color: "text-green-600" },
    ]

    return levels[score] || levels[0]
  }

  const passwordStrength = getPasswordStrength(password)

  const onSubmit = (values) => {
    signUp(values)
  }

  return (
    <Card className="w-full max-w-lg shadow-lg border-0 bg-card/50 backdrop-blur">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>Join our tailoring management system</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Google Sign Up */}
        <Button
          onClick={() => signInWithGoogle()}
          variant="outline"
          className="w-full h-11"
          disabled={isGoogleSigningIn}
        >
          {isGoogleSigningIn ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or create with email</span>
          </div>
        </div>

        {/* Registration Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Enter your full name" className="pl-10" {...field} />
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
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Enter your email" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="+968 XXXX XXXX" className="pl-10" {...field} />
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
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shopId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shop location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shops.map((shop) => (
                          <SelectItem key={shop.id} value={shop.id}>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-3 w-3" />
                              <span>{shop.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    {password && (
                      <div className="flex items-center space-x-2 text-xs">
                        <span className={passwordStrength.color}>{passwordStrength.label}</span>
                        <div className="flex-1 bg-muted rounded-full h-1">
                          <div
                            className={`h-1 rounded-full transition-all ${
                              passwordStrength.score <= 1
                                ? "bg-red-500"
                                : passwordStrength.score <= 2
                                  ? "bg-yellow-500"
                                  : passwordStrength.score <= 3
                                    ? "bg-blue-500"
                                    : "bg-green-500"
                            }`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <FormMessage />
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
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

            <Button type="submit" className="w-full h-11" disabled={isSigningUp}>
              {isSigningUp ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Error Display */}
        {signUpError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{signUpError.message}</span>
          </motion.div>
        )}

        {/* Sign In Link */}
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

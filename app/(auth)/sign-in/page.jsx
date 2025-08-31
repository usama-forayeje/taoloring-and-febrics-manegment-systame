'use client';
import SignInForm from "@/components/auth/SignInForm";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { isAuthenticated, userProfile, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only check after auth is fully initialized
    if (!initialized || loading) return;

    if (isAuthenticated && userProfile) {
      console.log('User already authenticated:', userProfile.name);
      console.log('Current role:', userProfile.role);

      // Check for 'from' parameter to redirect back
      const urlParams = new URLSearchParams(window.location.search);
      const fromPath = urlParams.get('from');

      if (fromPath && fromPath.startsWith('/dashboard')) {
        console.log('Redirecting to original destination:', fromPath);
        router.replace(fromPath);
      } else {
        // Default redirect based on role
        const redirectPath = '/dashboard'; // Simple redirect
        console.log('Redirecting to dashboard:', redirectPath);
        router.replace(redirectPath);
      }
    }
  }, [isAuthenticated, userProfile, loading, initialized, router]);

  // Show loading while checking auth
  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, show loading (redirect will happen)
  if (isAuthenticated && userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">You're already signed in. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  )
}
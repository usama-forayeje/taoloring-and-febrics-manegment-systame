"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useAuth } from './auth-provider';

export default function AuthCallback() {
  const { refreshAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Refresh auth state to get the new session
        await refreshAuth();

        toast.success('Successfully signed in!');

        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);

      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Authentication failed');
        router.push('/sign-in');
      }
    };

    handleOAuthCallback();
  }, [refreshAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <h2 className="mt-4 text-xl font-semibold">Completing sign in...</h2>
        <p className="mt-2 text-gray-600">Please wait while we set up your account.</p>
      </div>
    </div>
  );
}

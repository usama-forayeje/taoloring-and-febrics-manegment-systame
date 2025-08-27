"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Lock } from 'lucide-react';
import useAuthStore from '@/store/auth-store';

export default function AuthCallback() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const redirectAfterLogin = useAuthStore((state) => state.redirectAfterLogin);
  const getUserRole = useAuthStore((state) => state.getUserRole);
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Refresh auth state to get the new session
        await initializeAuth();

        const role = getUserRole();
        if (role) {
          toast.success('Successfully signed in!');
          
          // Small delay to ensure state is updated
          setTimeout(() => {
            redirectAfterLogin(role);
          }, 100);
        } else {
          throw new Error('Failed to get user role');
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Authentication failed');
        router.push('/auth/sign-in');
      }
    };

    handleOAuthCallback();
  }, [initializeAuth, redirectAfterLogin, getUserRole, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center animate-pulse">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <Loader2 className="w-6 h-6 absolute -bottom-1 -right-1 animate-spin text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Completing sign in...
        </h2>
        <p className="text-gray-600">Please wait while we set up your account.</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState('processing');
  const { handleOAuthSuccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const processOAuth = async () => {
      try {
        setStatus('processing');

        // Small delay to ensure OAuth flow is complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Processing OAuth callback...');
        const result = await handleOAuthSuccess();

        if (result && result.success) {
          setStatus('success');
          console.log('OAuth successful, redirect will happen automatically');
          // handleOAuthSuccess will handle the redirect
        } else {
          console.error('OAuth failed:', result);
          setStatus('error');
          setTimeout(() => {
            router.push('/sign-in?error=oauth_failed');
          }, 2000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setTimeout(() => {
          router.push('/sign-in?error=oauth_failed');
        }, 2000);
      }
    };

    processOAuth();
  }, [handleOAuthSuccess, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        {status === 'processing' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Completing your sign in...</p>
            <p className="text-sm text-gray-600 mt-2">Please wait while we set up your account</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <p className="text-lg font-medium text-green-700">Sign in successful!</p>
            <p className="text-sm text-gray-600 mt-2">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-red-600 text-5xl mb-4">✗</div>
            <p className="text-lg font-medium text-red-700">Authentication failed</p>
            <p className="text-sm text-gray-600 mt-2">Redirecting to sign in...</p>
          </div>
        )}
      </div>
    </div>
  );
}
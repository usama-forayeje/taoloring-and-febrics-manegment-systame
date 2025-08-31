'use client';

import { useEffect } from 'react';
import { useOAuthSuccess } from '@/lib/hooks/use-auth';
import { Loader2 } from 'lucide-react';

function OAuthSuccessPage() {
  const { mutate, isPending, isSuccess } = useOAuthSuccess();

  useEffect(() => {
    // Trigger the mutation to handle the OAuth success flow
    // This will fetch the user and create/update their profile
    mutate();
  }, [mutate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Logging you in...
        </p>
      </div>
    </div>
  );
}

export default OAuthSuccessPage;
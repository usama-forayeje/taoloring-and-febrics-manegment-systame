import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/services/auth-service';
import { toast } from 'sonner';

// ===== MAIN AUTH HOOK =====
export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get current user query
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get current user profile query
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authService.getCurrentUserProfile,
    enabled: !!user,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Initialize auth on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    user,
    userProfile,
    isLoading: isLoading || isProfileLoading,
    error,
    isAuthenticated: !!user && !!userProfile,
    refetch: () => {
      refetch();
      refetchProfile();
    }
  };
};


// ===== AUTH MUTATIONS WITH REACT QUERY =====
export const useSignUp = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (userData) => authService.signUp(userData),
    onSuccess: (result) => {
      if (result.success) {
        // Update cache
        queryClient.setQueryData(['auth', 'user'], result.user);
        queryClient.setQueryData(['auth', 'profile'], result.profile);

        // Show success toast
        toast.success(result.message || 'Account created successfully!');

        // Redirect based on role
        redirectAfterLogin(result.profile.role, router);
      } else {
        throw new Error(result.error.message);
      }
    },
    onError: (error) => {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
    }
  });
};

// ===== SIGN IN HOOK =====
export const useSignIn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }) => authService.signIn(email, password),
    onSuccess: (result) => {
      if (result.success) {
        // Update cache
        queryClient.setQueryData(['auth', 'user'], result.session);
        queryClient.setQueryData(['auth', 'profile'], result.user);

        // Show success toast
        toast.success(result.message || 'Welcome back!');

        // Redirect based on role
        redirectAfterLogin(result.user.role, router);
      } else {
        throw new Error(result.error.message);
      }
    },
    onError: (error) => {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    }
  });
};

// ===== GOOGLE SIGN IN HOOK =====
export const useSignInWithGoogle = () => {
  return useMutation({
    mutationFn: () => authService.signInWithGoogle(),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || 'Redirecting to Google...');
      } else {
        throw new Error(result.error.message);
      }
    },
    onError: (error) => {
      console.error('Google sign in error:', error);
      toast.error(error.message || 'Google sign in failed');
    }
  });
};

// ===== OAUTH SUCCESS HOOK =====
export const useOAuthSuccess = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.handleOAuthSuccess(),
    onSuccess: (result) => {
      if (result.success) {
        // Cache update
        queryClient.setQueryData(['auth', 'user'], result.user);
        queryClient.setQueryData(['auth', 'profile'], result.profile);

        toast.success('Signed in successfully!');

        // Redirect based on role
        redirectAfterLogin(result.profile.role, router);
      } else {
        throw new Error(result.error.message);
      }
    },
    onError: (error) => {
      console.error('OAuth success error:', error);
      toast.error(error.message || 'Authentication failed');
      router.push('/sign-in?error=oauth_failed');
    }
  });
};

// ===== LOGOUT HOOK =====
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: (result) => {
      if (result.success) {
        // Clear all cached data
        queryClient.clear();

        toast.success(result.message || 'Signed out successfully');

        // Redirect to sign in
        router.push('/sign-in');
      }
    },
    onError: (error) => {
      console.error('Logout error:', error);
      toast.error(error.message || 'Logout failed');
    }
  });
};

// ===== PASSWORD RESET HOOK =====
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (email) => authService.resetPassword(email),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
      } else {
        throw new Error(result.error.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send reset email');
    }
  });
};

// ===== UPDATE PASSWORD HOOK =====
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }) =>
      authService.updatePassword(oldPassword, newPassword),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
      } else {
        throw new Error(result.error.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update password');
    }
  });
};

// ===== UPDATE PASSWORD WITH RECOVERY HOOK =====
export const useUpdatePasswordWithRecovery = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ userId, secret, newPassword }) =>
      authService.updatePasswordWithRecovery(userId, secret, newPassword),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        router.push('/sign-in?message=password_updated');
      } else {
        throw new Error(result.error.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update password');
    }
  });
};

// ===== EMAIL VERIFICATION HOOKS =====
export const useSendEmailVerification = () => {
  return useMutation({
    mutationFn: () => authService.sendEmailVerification(),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
      } else {
        throw new Error(result.error.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send verification email');
    }
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ userId, secret }) => authService.verifyEmail(userId, secret),
    onSuccess: (result) => {
      if (result.success) {
        // Refresh user data
        queryClient.invalidateQueries({ queryKey: ['auth'] });

        toast.success(result.message);
        router.push('/dashboard?verified=true');
      } else {
        throw new Error(result.error.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Email verification failed');
    }
  });
};

// ===== UPDATE PROFILE HOOK =====
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ profileId, updateData }) =>
      authService.updateUserProfile(profileId, updateData),
    onSuccess: (updatedProfile) => {
      // Update cache
      queryClient.setQueryData(['auth', 'profile'], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });

      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    }
  });
};

// ===== PERMISSION HOOKS =====
export const usePermissions = () => {
  const { userProfile } = useAuth();

  const hasRole = (role) => userProfile?.role === role;

  const hasAnyRole = (roles) => roles.includes(userProfile?.role);

  const getUserPermissions = () => {
    return authService.getUserPermissions();
  };

  const hasPermission = (permission) => {
    const permissions = getUserPermissions();
    return permissions.includes('*') || permissions.includes(permission);
  };

  return {
    hasRole,
    hasAnyRole,
    hasPermission,
    getUserPermissions,
    userRole: userProfile?.role
  };
};

// ===== PROTECTED ROUTE HOOK =====
export const useProtectedRoute = (requiredRoles = [], redirectTo = '/sign-in') => {
  const { isAuthenticated, userProfile, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`${redirectTo}?from=${pathname}`);
      return;
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(userProfile?.role)) {
      router.push('/dashboard/unauthorized');
      return;
    }
  }, [isAuthenticated, userProfile, isLoading, router, pathname, requiredRoles, redirectTo]);

  return {
    isAuthenticated,
    userProfile,
    isLoading,
    hasAccess: isAuthenticated && (
      requiredRoles.length === 0 ||
      requiredRoles.includes(userProfile?.role)
    )
  };
};

// ===== REDIRECT UTILITY =====
const redirectAfterLogin = (role, router) => {
  const roleRedirects = {
    superAdmin: '/admin/dashboard',
    admin: '/admin/dashboard',
    manager: '/dashboard',
    tailor: '/dashboard/tasks',
    embroideryMan: '/dashboard/tasks',
    stoneMan: '/dashboard/tasks',
    user: '/dashboard'
  };

  const redirectPath = roleRedirects[role] || '/dashboard';
  router.push(redirectPath);
};

// ===== AUTH STATUS HOOK =====
export const useAuthStatus = () => {
  const { user, userProfile, isLoading, isAuthenticated } = useAuth();

  return {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    isReady: !isLoading && (isAuthenticated || (!user && !userProfile))
  };
};

"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStatus, usePermissions, useRoles } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, AlertTriangle, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PERMISSIONS, getRoleDisplayName } from '@/lib/roles';

export default function ProtectedRoute({
  children,
  requiredRole = null,
  requiredPermissions = [],
  fallbackPath = '/sign-in',
  showUnauthorizedPage = true,
  loadingComponent = null
}) {
  const { isAuthenticated, loading, initialized, userProfile } = useAuthStatus();
  const { checkAnyPermission } = usePermissions();
  const { hasRole, userRole } = useRoles();
  const router = useRouter();
  const pathname = usePathname();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Public routes that don't require authentication
  const publicRoutes = [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
    '/verify',
    '/error',
    '/callback',
    '/',
    '/about',
    '/contact'
  ];

  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route) || pathname === route
  );

  useEffect(() => {
    if (!initialized || loading) return;

    const checkAccess = () => {
      // Skip auth check for public routes
      if (isPublicRoute) {
        setHasCheckedAuth(true);
        return;
      }

      // Check authentication
      if (!isAuthenticated) {
        router.push(fallbackPath);
        return;
      }

      // Check role if required
      if (requiredRole && !hasRole(requiredRole)) {
        if (showUnauthorizedPage) {
          setHasCheckedAuth(true);
          return;
        } else {
          router.push('/dashboard/unauthorized');
          return;
        }
      }

      // Check permissions if required
      if (requiredPermissions.length > 0 && !checkAnyPermission(requiredPermissions)) {
        if (showUnauthorizedPage) {
          setHasCheckedAuth(true);
          return;
        } else {
          router.push('/dashboard/unauthorized');
          return;
        }
      }

      setHasCheckedAuth(true);
    };

    checkAccess();
  }, [
    initialized,
    loading,
    isAuthenticated,
    requiredRole,
    requiredPermissions,
    hasRole,
    checkAnyPermission,
    router,
    pathname,
    fallbackPath,
    showUnauthorizedPage,
    isPublicRoute
  ]);

  // Show loading while checking auth
  if (!initialized || loading || !hasCheckedAuth) {
    if (loadingComponent) return loadingComponent;

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
            Checking authentication...
          </h2>
          <p className="text-gray-600">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  // Skip auth checks for public routes
  if (isPublicRoute) {
    return children;
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Authentication Required
            </h2>
            <p className="text-gray-600">
              You need to be signed in to access this page.
            </p>
            <Button onClick={() => router.push(fallbackPath)} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role authorization
  if (requiredRole && !hasRole(requiredRole)) {
    if (!showUnauthorizedPage) return null;

    return (
      <UnauthorizedPage
        title="Insufficient Role"
        message={`This page requires ${getRoleDisplayName(requiredRole)} role. Your current role is ${getRoleDisplayName(userRole)}.`}
        type="role"
      />
    );
  }

  // Check permission authorization
  if (requiredPermissions.length > 0 && !checkAnyPermission(requiredPermissions)) {
    if (!showUnauthorizedPage) return null;

    return (
      <UnauthorizedPage
        title="Insufficient Permissions"
        message="You don't have the required permissions to access this page."
        type="permission"
        requiredPermissions={requiredPermissions}
      />
    );
  }

  // All checks passed
  return children;
}

// Unauthorized Page Component
function UnauthorizedPage({
  title,
  message,
  type,
  requiredPermissions = []
}) {
  const router = useRouter();
  const { userRole } = useRoles();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-lg w-full mx-4">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-yellow-600" />
          </div>

          {/* Title and Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="text-sm">
              <p className="font-medium text-gray-700">Your Current Role:</p>
              <p className="text-gray-600">{getRoleDisplayName(userRole)}</p>
            </div>

            {type === 'permission' && requiredPermissions.length > 0 && (
              <div className="text-sm">
                <p className="font-medium text-gray-700">Required Permissions:</p>
                <ul className="text-gray-600 text-left list-disc list-inside space-y-1">
                  {requiredPermissions.map((permission, index) => (
                    <li key={index} className="text-xs">
                      {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-blue-600 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-left">
                <p className="font-medium text-blue-800">Need Access?</p>
                <p className="text-blue-700 mt-1">
                  Contact your administrator to request the necessary permissions for your role.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              Go to Dashboard
            </Button>
          </div>

          {/* Contact Info */}
          <div className="text-xs text-gray-500">
            <p>Need help? Contact support at{" "}
              <Link
                href="mailto:support@yourapp.com"
                className="text-primary hover:underline"
              >
                support@yourapp.com
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

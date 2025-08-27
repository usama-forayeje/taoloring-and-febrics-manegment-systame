import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { authService } from '@/lib/services/auth-service';
import { hasPermission, hasAnyPermission, ROLES, PERMISSIONS } from '@/lib/roles';
import { toast } from 'sonner';

const useAuthStore = create(
  devtools(
    persist(
      subscribeWithSelector(
        (set, get) => ({
          // ===== STATE =====
          user: null,
          userProfile: null,
          loading: false,
          initialized: false,
          sessionCheckInterval: null,

          // ===== COMPUTED VALUES =====
          isAuthenticated: () => {
            const { user, userProfile } = get();
            return !!user && !!userProfile;
          },

          getUserRole: () => get().userProfile?.role || null,
          getShopId: () => get().userProfile?.shopId || null,
          getUserId: () => get().userProfile?.$id || null,

          // ===== PERMISSION CHECKS =====
          checkPermission: (permission) => {
            const role = get().getUserRole();
            if (!role) return false;
            return hasPermission(role, permission);
          },

          checkAnyPermission: (permissions) => {
            const role = get().getUserRole();
            if (!role) return false;
            return hasAnyPermission(role, permissions);
          },

          checkAllPermissions: (permissions) => {
            const role = get().getUserRole();
            if (!role || !permissions.length) return false;
            return permissions.every(permission => hasPermission(role, permission));
          },

          // ===== ROLE CHECKS =====
          hasRole: (role) => get().getUserRole() === role,

          hasAnyRole: (roles) => roles.includes(get().getUserRole()),

          isAdmin: () => {
            const role = get().getUserRole();
            return [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role);
          },

          isWorker: () => {
            const role = get().getUserRole();
            return [ROLES.TAILOR, ROLES.EMBROIDERY_MAN, ROLES.STONE_MAN].includes(role);
          },

          // ===== UTILITY PERMISSION CHECKS =====
          canManageUsers: () => get().checkPermission(PERMISSIONS.MANAGE_USERS),
          canViewAllOrders: () => get().checkPermission(PERMISSIONS.VIEW_ALL_ORDERS),
          canManageFinances: () => get().checkPermission(PERMISSIONS.MANAGE_FINANCES),
          canCreateOrders: () => get().checkPermission(PERMISSIONS.CREATE_ORDERS),
          canManageCustomers: () => get().checkPermission(PERMISSIONS.MANAGE_CUSTOMERS),

          // ===== SESSION MANAGEMENT =====
          startSessionCheck: () => {
            const { sessionCheckInterval } = get();
            if (sessionCheckInterval) return;

            const interval = setInterval(async () => {
              try {
                const currentUser = await authService.getCurrentUser();
                if (!currentUser) {
                  get().handleSessionExpired();
                }
              } catch (error) {
                if (error.code === 401) {
                  get().handleSessionExpired();
                }
              }
            }, 5 * 60 * 1000); // Check every 5 minutes

            set({ sessionCheckInterval: interval });
          },

          stopSessionCheck: () => {
            const { sessionCheckInterval } = get();
            if (sessionCheckInterval) {
              clearInterval(sessionCheckInterval);
              set({ sessionCheckInterval: null });
            }
          },

          handleSessionExpired: () => {
            get().stopSessionCheck();
            set({
              user: null,
              userProfile: null,
              initialized: true,
              loading: false
            });

            toast.warning('Your session has expired. Please sign in again.');

            // Only redirect if not on auth pages
            const currentPath = window.location.pathname;
            const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password'];

            if (!publicRoutes.includes(currentPath)) {
              window.location.href = '/sign-in';
            }
          },

          // ===== AUTH ACTIONS =====
          initializeAuth: async () => {
            try {
              set({ loading: true });

              const currentUser = await authService.getCurrentUser();
              if (currentUser) {
                const profile = await authService.getCurrentUserProfile();

                if (profile) {
                  set({
                    user: currentUser,
                    userProfile: profile
                  });
                  get().startSessionCheck();
                } else {
                  // Create profile if doesn't exist
                  const newProfile = await authService.createUserProfile(currentUser);
                  set({
                    user: currentUser,
                    userProfile: newProfile
                  });
                  get().startSessionCheck();
                }
              } else {
                set({ user: null, userProfile: null });
                get().stopSessionCheck();
              }
            } catch (error) {
              console.error('Auth initialization error:', error);
              set({ user: null, userProfile: null });
              get().stopSessionCheck();
            } finally {
              set({ loading: false, initialized: true });
            }
          },

          signUp: async (userData) => {
            try {
              set({ loading: true });

              const result = await authService.signUp(userData);

              if (result.success) {
                set({
                  user: result.user,
                  userProfile: result.profile
                });
                get().startSessionCheck();

                toast.success(`Welcome ${result.profile.name}! Account created successfully.`);

                return { success: true, profile: result.profile };
              }

              return result;
            } catch (error) {
              console.error('SignUp error:', error);
              return {
                success: false,
                error: error.message || 'Failed to create account'
              };
            } finally {
              set({ loading: false });
            }
          },

          signIn: async (email, password) => {
            try {
              set({ loading: true });

              const result = await authService.signIn(email, password);

              if (result.success) {
                set({
                  user: result.session,
                  userProfile: result.user
                });
                get().startSessionCheck();

                toast.success(`Welcome back ${result.user.name}!`);

                return { success: true, user: result.user };
              }

              return result;
            } catch (error) {
              console.error('SignIn error:', error);
              return {
                success: false,
                error: error.message || 'Sign in failed'
              };
            } finally {
              set({ loading: false });
            }
          },

          signInWithGoogle: async () => {
            try {
              return await authService.signInWithGoogle();
            } catch (error) {
              console.error('Google SignIn error:', error);
              return {
                success: false,
                error: error.message || 'Google sign in failed'
              };
            }
          },

          logout: async () => {
            try {
              set({ loading: true });

              const result = await authService.logout();
              if (result.success) {
                get().stopSessionCheck();
                set({
                  user: null,
                  userProfile: null
                });

                toast.success('Signed out successfully');
                window.location.href = '/sign-in';
              }
              return result;
            } catch (error) {
              console.error('Logout error:', error);
              return {
                success: false,
                error: error.message || 'Logout failed'
              };
            } finally {
              set({ loading: false });
            }
          },

          updateProfile: async (updateData) => {
            try {
              const { userProfile } = get();
              if (!userProfile) throw new Error('No user profile found');

              const updatedProfile = await authService.updateUserProfile(
                userProfile.$id,
                updateData
              );

              set({ userProfile: updatedProfile });
              toast.success('Profile updated successfully');

              return { success: true, data: updatedProfile };
            } catch (error) {
              console.error('Update profile error:', error);
              toast.error('Failed to update profile');
              return {
                success: false,
                error: error.message || 'Update failed'
              };
            }
          },

          resetPassword: async (email) => {
            try {
              const result = await authService.resetPassword(email);
              if (result.success) {
                toast.success(result.message);
              }
              return result;
            } catch (error) {
              return {
                success: false,
                error: error.message || 'Password reset failed'
              };
            }
          },

          updatePassword: async (oldPassword, newPassword) => {
            try {
              const result = await authService.updatePassword(oldPassword, newPassword);
              if (result.success) {
                toast.success(result.message);
              }
              return result;
            } catch (error) {
              return {
                success: false,
                error: error.message || 'Password update failed'
              };
            }
          },

          // ===== ROLE-BASED REDIRECT =====
          redirectAfterLogin: (role) => {
            const roleRedirects = {
              [ROLES.SUPER_ADMIN]: '/admin/dashboard',
              [ROLES.ADMIN]: '/admin/dashboard',
              [ROLES.MANAGER]: '/dashboard',
              [ROLES.TAILOR]: '/dashboard/tasks',
              [ROLES.EMBROIDERY_MAN]: '/dashboard/tasks',
              [ROLES.STONE_MAN]: '/dashboard/tasks',
              [ROLES.USER]: '/dashboard'
            };

            const redirectPath = roleRedirects[role] || '/dashboard';
            window.location.href = redirectPath;
          },

          // ===== CLEANUP =====
          cleanup: () => {
            get().stopSessionCheck();
            set({
              user: null,
              userProfile: null,
              loading: false,
              initialized: false,
              sessionCheckInterval: null
            });
          }
        })
      ),
      {
        name: 'auth-store',
        partialize: (state) => ({
          // Only persist essential user data
          user: state.user,
          userProfile: state.userProfile,
        }),
        version: 1,
        migrate: (persistedState, version) => {
          // Handle state migrations if needed
          return persistedState;
        }
      }
    ),
    { name: 'auth-store' }
  )
);

// Subscribe to auth changes for global side effects
useAuthStore.subscribe(
  (state) => state.isAuthenticated(),
  (isAuthenticated, previousIsAuthenticated) => {
    // Log authentication state changes
    if (isAuthenticated !== previousIsAuthenticated) {
      console.log('Auth state changed:', { isAuthenticated });
    }
  }
);

export default useAuthStore;

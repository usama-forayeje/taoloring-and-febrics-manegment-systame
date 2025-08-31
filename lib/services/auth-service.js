import { account, databases, USER_ROLES } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { ID, Query } from 'appwrite';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentUserProfile = null;
  }

  // ===== UTILITY METHODS =====

  /**
   * Generate a beautiful avatar for users
   */
  generateAvatar(name, email) {
    try {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${email}&backgroundColor=f97316,f59e0b,84cc16,10b981,06b6d4,3b82f6,8b5cf6,ec4899&textColor=ffffff`;
    } catch (error) {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${email}&backgroundColor=3b82f6&textColor=ffffff`;
    }
  }

  /**
   * Get user profile by user ID (with proper error handling)
   */
  async getUserProfileByUserId(userId) {
    try {
      const response = await databases.listRows(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        [Query.equal('userId', userId)]
      );

      if (response && response.rows && response.rows.length > 0) {
        return response.rows[0];
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Create or update user profile in database
   */
  async createOrUpdateUserProfile(user, additionalData = {}) {
    try {
      const profileData = {
        userId: user.$id,
        email: user.email,
        name: user.name || additionalData.name || 'User',
        phone: additionalData.phone || '',
        role: additionalData.role || USER_ROLES.USER,
        shopId: additionalData.shopId || '',
        avatar: additionalData.avatar || this.generateAvatar(
          user.name || additionalData.name || 'User',
          user.email
        ),
      };

      // First check if profile already exists
      const existingProfile = await this.getUserProfileByUserId(user.$id);

      if (existingProfile) {
        // Update existing profile
        return await databases.updateRow(
          appwriteConfig.databaseId,
          appwriteConfig.collections.users,
          existingProfile.$id,
          profileData
        );
      } else {
        // Create new profile
        return await databases.createRow(
          appwriteConfig.databaseId,
          appwriteConfig.collections.users,
          ID.unique(), // Pass a unique ID for the new row/document
          profileData // The data object must be the fourth parameter
        );
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);

      // If there's a conflict, try to fetch existing profile
      if (error.code === 409) {
        console.log('Profile conflict detected, fetching existing profile...');
        const existingProfile = await this.getUserProfileByUserId(user.$id);
        if (existingProfile) {
          return existingProfile;
        }
      }
      throw error;
    }
  }

  // ===== AUTHENTICATION METHODS =====

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      const user = await account.get();
      this.currentUser = user;
      return user;
    } catch (error) {
      if (error.code === 401) {
        this.currentUser = null;
        this.currentUserProfile = null;
        return null;
      }
      throw error;
    }
  }

  /**
   * Get current user profile from database
   */
  async getCurrentUserProfile() {
    try {
      if (!this.currentUser) {
        const user = await this.getCurrentUser();
        if (!user) return null;
      }

      const profile = await this.getUserProfileByUserId(this.currentUser.$id);
      this.currentUserProfile = profile;
      return profile;
    } catch (error) {
      console.error('Error getting current user profile:', error);
      return null;
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp({ email, password, name, phone, role = USER_ROLES.USER, shopId }) {
    try {
      // Create Appwrite account
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      // Create user profile in database
      const profile = await this.createOrUpdateUserProfile(user, {
        name,
        phone,
        role,
        shopId
      });

      // Create session
      try {
        await account.createEmailPasswordSession(email, password);
      } catch (sessionError) {
        console.warn('Failed to create session:', sessionError);
      }

      this.currentUser = user;
      this.currentUserProfile = profile;

      return {
        success: true,
        user,
        profile,
        message: 'Account created successfully!'
      };
    } catch (error) {
      console.error('SignUp error:', error);

      let message = 'Failed to create account. Please try again.';

      if (error.code === 409) {
        message = 'An account with this email already exists.';
      } else if (error.code === 400) {
        message = 'Invalid email or password format.';
      } else if (error.message) {
        message = error.message;
      }

      return {
        success: false,
        error: { message }
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    try {
      // Create session
      await account.createEmailPasswordSession(email, password);

      // Get user details
      const user = await account.get();

      // Get or create user profile
      let profile = await this.getUserProfileByUserId(user.$id);
      if (!profile) {
        profile = await this.createOrUpdateUserProfile(user);
      }

      this.currentUser = user;
      this.currentUserProfile = profile;

      return {
        success: true,
        user: profile,
        session: user,
        message: 'Signed in successfully!'
      };
    } catch (error) {
      console.error('SignIn error:', error);

      let message = 'Sign in failed. Please try again.';

      if (error.code === 401) {
        message = 'Invalid email or password.';
      } else if (error.code === 429) {
        message = 'Too many attempts. Please try again later.';
      } else if (error.message) {
        message = error.message;
      }

      return {
        success: false,
        error: { message }
      };
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle() {
    try {
      // Redirect to Google OAuth
      await account.createOAuth2Session(
        'google',
        `${window.location.origin}/callback`,
        `${window.location.origin}/sign-in?error=oauth_failed`
      );

      return {
        success: true,
        message: 'Redirecting to Google...'
      };
    } catch (error) {
      console.error('Google SignIn error:', error);
      return {
        success: false,
        error: { message: 'Google sign in failed. Please try again.' }
      };
    }
  }

  /**
   * Handle OAuth success callback
   */
  async handleOAuthSuccess() {
    try {
      const user = await account.get();
      if (!user) {
        return {
          success: false,
          error: { message: 'User not found after OAuth.' }
        };
      }

      console.log('OAuth user:', user);

      // Try to get existing profile first
      let profile = await this.getUserProfileByUserId(user.$id);

      if (!profile) {
        console.log('Creating new profile for OAuth user');

        // Get Google profile picture if available
        let finalAvatarUrl = this.generateAvatar(user.name || 'User', user.email);

        try {
          const sessions = await account.listSessions();
          if (sessions && sessions.sessions) {
            const googleSession = sessions.sessions.find(s => s.provider === 'google');
            if (googleSession && googleSession.providerAccessToken) {
              const googleAvatar = await this.getGooglePicture(googleSession.providerAccessToken);
              if (googleAvatar) {
                finalAvatarUrl = googleAvatar;
              }
            }
          }
        } catch (avatarError) {
          console.warn('Failed to get Google avatar:', avatarError);
        }

        // Create profile with retry mechanism
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          try {
            profile = await this.createOrUpdateUserProfile(user, {
              name: user.name || 'Google User',
              role: USER_ROLES.USER,
              avatar: finalAvatarUrl,
            });
            break; // Success, exit retry loop
          } catch (createError) {
            retryCount++;

            if (createError.code === 409) {
              console.log(`Conflict during creation (attempt ${retryCount}), fetching existing profile...`);
              profile = await this.getUserProfileByUserId(user.$id);
              if (profile) {
                break; // Found existing profile, exit retry loop
              }

              if (retryCount >= maxRetries) {
                throw new Error('Failed to create or fetch user profile after multiple attempts');
              }

              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            } else {
              throw createError;
            }
          }
        }

        console.log('Profile created/fetched:', profile);
      } else {
        console.log('Existing profile found:', profile);
      }

      this.currentUser = user;
      this.currentUserProfile = profile;

      return {
        success: true,
        user,
        profile,
        message: 'Successfully signed in with Google!'
      };

    } catch (error) {
      console.error('OAuth success handling error:', error);

      return {
        success: false,
        error: { message: error.message || 'Failed to complete authentication.' }
      };
    }
  }

  async getGooglePicture(accessToken) {
    try {
      const response = await fetch("https://people.googleapis.com/v1/people/me?personFields=photos", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data?.photos?.[0]?.url || null;
    } catch (error) {
      console.error("Error fetching Google picture:", error);
      return null;
    }
  }

  async logout() {
    try {
      await account.deleteSession('current');

      this.currentUser = null;
      this.currentUserProfile = null;

      return {
        success: true,
        message: 'Signed out successfully!'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: { message: 'Logout failed. Please try again.' }
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email) {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );

      return {
        success: true,
        message: 'Password reset email sent! Check your inbox.'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to send reset email.' }
      };
    }
  }

  /**
   * Update password with old password
   */
  async updatePassword(oldPassword, newPassword) {
    try {
      await account.updatePassword(newPassword, oldPassword);

      return {
        success: true,
        message: 'Password updated successfully!'
      };
    } catch (error) {
      console.error('Update password error:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to update password.' }
      };
    }
  }

  /**
   * Update password with recovery
   */
  async updatePasswordWithRecovery(userId, secret, newPassword) {
    try {
      await account.updateRecovery(userId, secret, newPassword);

      return {
        success: true,
        message: 'Password updated successfully! You can now sign in.'
      };
    } catch (error) {
      console.error('Update password with recovery error:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to update password.' }
      };
    }
  }

  /**
   * Send email verification
   */
  async sendEmailVerification() {
    try {
      await account.createVerification(`${window.location.origin}/verify`);

      return {
        success: true,
        message: 'Verification email sent! Check your inbox.'
      };
    } catch (error) {
      console.error('Send email verification error:', error);
      return {
        success: false,
        error: { message: error.message || 'Failed to send verification email.' }
      };
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(userId, secret) {
    try {
      await account.updateVerification(userId, secret);

      return {
        success: true,
        message: 'Email verified successfully!'
      };
    } catch (error) {
      console.error('Verify email error:', error);
      return {
        success: false,
        error: { message: error.message || 'Email verification failed.' }
      };
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(profileId, updateData) {
    try {
      const updatedProfile = await databases.updateRow(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        profileId,
        updateData
      );

      this.currentUserProfile = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  /**
   * Create user profile (for manual creation)
   */
  async createUserProfile(user, profileData = {}) {
    return await this.createOrUpdateUserProfile(user, profileData);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role) {
    return this.currentUserProfile?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles) {
    return roles.includes(this.currentUserProfile?.role);
  }

  /**
   * Get user permissions based on role
   */
  getUserPermissions() {
    const role = this.currentUserProfile?.role;

    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return ['*']; // All permissions
      case USER_ROLES.ADMIN:
        return ['read', 'write', 'delete', 'manage_users'];
      case USER_ROLES.MANAGER:
        return ['read', 'write', 'manage_tasks'];
      case USER_ROLES.TAILOR:
      case USER_ROLES.EMBROIDERY_MAN:
      case USER_ROLES.STONE_MAN:
        return ['read', 'write_tasks'];
      case USER_ROLES.USER:
      default:
        return ['read'];
    }
  }
}

// Export a single instance
const authService = new AuthService();
export default authService;
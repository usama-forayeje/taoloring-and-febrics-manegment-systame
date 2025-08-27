import { account, USER_ROLES } from '@/lib/appwrite';
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
      // Create initials avatar with beautiful colors
      const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

      return avatars.getInitials(initials, 200, 200);
    } catch (error) {
      // Fallback to email-based avatar
      return `https://api.dicebear.com/7.x/initials/svg?seed=${email}&backgroundColor=f97316,f59e0b,84cc16,10b981,06b6d4,3b82f6,8b5cf6,ec4899&textColor=ffffff`;
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Check if profile already exists
      const existingProfile = await this.getUserProfileByUserId(user.$id);

      if (existingProfile) {
        // Update existing profile
        return await databases.updateRow(
          appwriteConfig.databaseId,
          appwriteConfig.collections.users,
          existingProfile.$id,
          {
            ...profileData,
            createdAt: existingProfile.createdAt, // Keep original creation date
            lastLoginAt: new Date().toISOString()
          }
        );
      } else {
        // Create new profile
        return await databases.createRow(
          appwriteConfig.databaseId,
          appwriteConfig.collections.users,
          ID.unique(),
          profileData
        );
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  }


  //  Get user profile by user ID

  async getUserProfileByUserId(userId) {
    try {
      const response = await databases.listRows(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        [Query.equal('userId', userId)]
      );
      return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
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


      // Send email verification
      try {
        await account.createVerification(
          `${window.location.origin}/verify-email`
        );
      } catch (verificationError) {
        console.warn('Failed to send verification email:', verificationError);
      }

      // Create user profile in database
      const profile = await this.createOrUpdateUserProfile(user, {
        name,
        phone,
        role,
        shopId
      });

      try {
        await account.get();
        console.log("Active session found, skipping new session creation.");
      } catch (e) {
        if (e.code === 401) {
          await account.createEmailPasswordSession(email, password);
        }
      }
      this.currentUser = user;
      this.currentUserProfile = profile;
      return {
        success: true,
        user,
        profile,
        message: 'Account created successfully! Please verify your email.'
      };
    } catch (error) {
      console.error('SignUp error:', error);

      // Handle specific Appwrite errors
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
      const session = await account.createEmailPasswordSession(email, password);

      // Get user details
      const user = await account.get();

      // Get or create user profile
      let profile = await this.getUserProfileByUserId(user.$id);
      if (!profile) {
        profile = await this.createOrUpdateUserProfile(user);
      } else {
        // Update last login time
        profile = await databases.updateRow(
          appwriteConfig.databaseId,
          appwriteConfig.collections.users,
          profile.$id,
          {
            lastLoginAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        );
      }

      this.currentUser = user;
      this.currentUserProfile = profile;

      return {
        success: true,
        session,
        user: profile,
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
        `${window.location.origin}/success`,
        `${window.location.origin}/failure`
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
      // Get the current user from Appwrite
      const user = await account.get();
      
      if (!user) {
        return { 
          success: false, 
          error: { message: 'User not found after OAuth. Please try again.' } 
        };
      }

      console.log('OAuth user:', user);

      // Check if profile already exists
      let profile = await this.getUserProfileByUserId(user.$id);

      // If profile doesn't exist, create a new one
      if (!profile) {
        console.log('Creating new profile for OAuth user');
        
        profile = await this.createOrUpdateUserProfile(user, {
          name: user.name || 'Google User',
          email: user.email,
          role: USER_ROLES.USER, // Default role
          avatar: this.generateAvatar(user.name || 'User', user.email)
        });
        
        console.log('New profile created:', profile);
      } else {
        console.log('Existing profile found:', profile);
        
        // Update last login time for existing user
        profile = await databases.updateRow(
          appwriteConfig.databaseId,
          appwriteConfig.collections.users,
          profile.$id,
          {
            lastLoginAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        );
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
      
      let errorMessage = 'Failed to complete authentication.';
      if (error.code === 404) {
        errorMessage = 'Database collection not found. Please check your Appwrite configuration.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: { message: errorMessage }
      };
    }
  }

  /**
   * Logout user
   */
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
   * Send password reset email
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
      console.error('Password reset error:', error);

      let message = 'Failed to send reset email.';
      if (error.code === 429) {
        message = 'Too many requests. Please wait before trying again.';
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
   * Update password with recovery
   */
  async updatePasswordWithRecovery(userId, secret, newPassword) {
    try {
      await account.updateRecovery(userId, secret, newPassword, newPassword);

      return {
        success: true,
        message: 'Password updated successfully!'
      };
    } catch (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        error: { message: 'Failed to update password. Invalid or expired link.' }
      };
    }
  }

  /**
   * Update current user password
   */
  async updatePassword(oldPassword, newPassword) {
    try {
      await account.updatePassword(newPassword, oldPassword);

      return {
        success: true,
        message: 'Password updated successfully!'
      };
    } catch (error) {
      console.error('Password update error:', error);

      let message = 'Failed to update password.';
      if (error.code === 401) {
        message = 'Current password is incorrect.';
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
   * Send email verification
   */
  async sendEmailVerification() {
    try {
      await account.createVerification(`${window.location.origin}/verify-email`);

      return {
        success: true,
        message: 'Verification email sent! Check your inbox.'
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: { message: 'Failed to send verification email.' }
      };
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(userId, secret) {
    try {
      await account.updateVerification(userId, secret);

      // Update profile verification status
      if (this.currentUserProfile) {
        await databases.updateRow(
          appwriteConfig.databaseId,
          appwriteConfig.collections.users,
          this.currentUserProfile.$id,
          {
            updatedAt: new Date().toISOString()
          }
        );
      }

      return {
        success: true,
        message: 'Email verified successfully!'
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: { message: 'Email verification failed. Invalid or expired link.' }
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
        {
          ...updateData,
          updatedAt: new Date().toISOString()
        }
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
    return ROLE_PERMISSIONS[role] || [];
  }
}

export const authService = new AuthService();
export default authService;

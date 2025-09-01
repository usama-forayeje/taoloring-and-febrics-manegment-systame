import { storage } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { ID, Permission, Role } from 'appwrite';

class StorageService {
  constructor() {
    this.buckets = appwriteConfig.buckets;
  }

  // ===== FILE UPLOAD =====

  /**
   * Upload file to specific bucket
   */
  async uploadFile(bucketId, file, fileId = ID.unique(), permissions = []) {
    try {
      return await storage.createFile(
        bucketId,
        fileId,
        file,
        permissions
      );
    } catch (error) {
      console.error('Upload file error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload avatar image
   */
  async uploadAvatar(file, userId) {
    try {
      const fileId = `avatar_${userId}_${Date.now()}`;
      const permissions = [
        Permission.read(Role.any()),
        Permission.write(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ];

      return await this.uploadFile(this.buckets.avatars, file, fileId, permissions);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload document (receipts, invoices, etc.)
   */
  async uploadDocument(file, userId, shopId = null) {
    try {
      const fileId = `doc_${userId}_${Date.now()}`;
      const permissions = [
        Permission.read(Role.user(userId)),
        Permission.write(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ];

      // Add shop-level permissions if shopId provided
      if (shopId) {
        permissions.push(Permission.read(Role.team(shopId)));
      }

      return await this.uploadFile(this.buckets.documents, file, fileId, permissions);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload product/catalog image
   */
  async uploadProductImage(file, userId, shopId) {
    try {
      const fileId = `product_${shopId}_${Date.now()}`;
      const permissions = [
        Permission.read(Role.any()),
        Permission.write(Role.user(userId)),
        Permission.delete(Role.user(userId)),
        Permission.read(Role.team(shopId))
      ];

      return await this.uploadFile(this.buckets.images, file, fileId, permissions);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== FILE MANAGEMENT =====

  /**
   * Get file by ID
   */
  async getFile(bucketId, fileId) {
    try {
      return await storage.getFile(bucketId, fileId);
    } catch (error) {
      console.error('Get file error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get file preview URL
   */
  getFilePreview(bucketId, fileId, width = 400, height = 400, quality = 80) {
    try {
      return storage.getFilePreview(bucketId, fileId, width, height, 'center', quality);
    } catch (error) {
      console.error('Get file preview error:', error);
      return null;
    }
  }

  /**
   * Get file download URL
   */
  getFileDownload(bucketId, fileId) {
    try {
      return storage.getFileDownload(bucketId, fileId);
    } catch (error) {
      console.error('Get file download error:', error);
      return null;
    }
  }

  /**
   * Get file view URL
   */
  getFileView(bucketId, fileId) {
    try {
      return storage.getFileView(bucketId, fileId);
    } catch (error) {
      console.error('Get file view error:', error);
      return null;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(bucketId, fileId) {
    try {
      return await storage.deleteFile(bucketId, fileId);
    } catch (error) {
      console.error('Delete file error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * List files in bucket
   */
  async listFiles(bucketId, queries = []) {
    try {
      return await storage.listFiles(bucketId, queries);
    } catch (error) {
      console.error('List files error:', error);
      throw this.handleError(error);
    }
  }

  // ===== SPECIALIZED UPLOAD METHODS =====

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(bucketId, files, userId, permissions = []) {
    try {
      const uploadPromises = files.map(file => {
        const fileId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return this.uploadFile(bucketId, file, fileId, permissions);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload invoice with automatic file naming
   */
  async uploadInvoice(file, invoiceNumber, userId, shopId) {
    try {
      const fileId = `invoice_${invoiceNumber}_${shopId}_${Date.now()}`;
      const permissions = [
        Permission.read(Role.user(userId)),
        Permission.write(Role.user(userId)),
        Permission.delete(Role.user(userId)),
        Permission.read(Role.team(shopId))
      ];

      return await this.uploadFile(this.buckets.documents, file, fileId, permissions);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload fabric image
   */
  async uploadFabricImage(file, fabricCode, userId, shopId) {
    try {
      const fileId = `fabric_${fabricCode}_${shopId}_${Date.now()}`;
      const permissions = [
        Permission.read(Role.any()),
        Permission.write(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ];

      return await this.uploadFile(this.buckets.images, file, fileId, permissions);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== FILE VALIDATION =====

  /**
   * Validate file type and size
   */
  validateFile(file, allowedTypes = [], maxSize = 5 * 1024 * 1024) { // 5MB default
    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate image file
   */
  validateImage(file, maxSize = 2 * 1024 * 1024) { // 2MB for images
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return this.validateFile(file, allowedTypes, maxSize);
  }

  /**
   * Validate document file
   */
  validateDocument(file, maxSize = 10 * 1024 * 1024) { // 10MB for documents
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return this.validateFile(file, allowedTypes, maxSize);
  }

  // ===== BATCH OPERATIONS =====

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(bucketId, fileIds) {
    try {
      const deletePromises = fileIds.map(fileId => 
        this.deleteFile(bucketId, fileId)
      );
      
      return await Promise.all(deletePromises);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get multiple file previews
   */
  getMultipleFilePreviews(bucketId, fileIds, width = 400, height = 400) {
    return fileIds.map(fileId => ({
      fileId,
      previewUrl: this.getFilePreview(bucketId, fileId, width, height)
    }));
  }

  // ===== CLEANUP UTILITIES =====

  /**
   * Clean up orphaned files (files not referenced in database)
   */
  async cleanupOrphanedFiles(bucketId) {
    try {
      // This would require checking database references
      // Implementation depends on your specific use case
      console.log(`Cleanup orphaned files in bucket: ${bucketId}`);
      // TODO: Implement based on your database structure
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== ERROR HANDLING =====

  handleError(error) {
    console.error('Storage service error:', error);
    
    if (error.code === 401) {
      return new Error('Authentication required');
    } else if (error.code === 403) {
      return new Error('Permission denied');
    } else if (error.code === 404) {
      return new Error('File not found');
    } else if (error.code === 413) {
      return new Error('File too large');
    } else if (error.code === 415) {
      return new Error('Unsupported file type');
    } else {
      return new Error(error.message || 'Storage operation failed');
    }
  }
}

// Export singleton instance
const storageService = new StorageService();
export default storageService;
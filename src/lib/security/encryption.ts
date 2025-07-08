
import { environment } from '@/lib/config/environment';

/**
 * Simple encryption utility using Web Crypto API when available,
 * falling back to XOR for development
 */
class EncryptionService {
  private readonly key: string;

  constructor() {
    this.key = environment.ENCRYPTION_KEY;
  }

  /**
   * Encrypt text using Web Crypto API (production) or XOR (development)
   */
  async encrypt(text: string): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle && environment.APP_ENV === 'production') {
      return this.encryptWithWebCrypto(text);
    }
    return this.encryptWithXOR(text);
  }

  /**
   * Decrypt text using Web Crypto API (production) or XOR (development)
   */
  async decrypt(encryptedText: string): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle && environment.APP_ENV === 'production') {
      return this.decryptWithWebCrypto(encryptedText);
    }
    return this.decryptWithXOR(encryptedText);
  }

  /**
   * Encrypt using Web Crypto API (for production)
   */
  private async encryptWithWebCrypto(text: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // Generate a random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Import the key
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.key.padEnd(32, '0').substring(0, 32)),
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );

      // Encrypt the data
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        keyMaterial,
        data
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encrypted), iv.length);

      // Convert to base64
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      // Fallback to XOR if Web Crypto fails
      return this.encryptWithXOR(text);
    }
  }

  /**
   * Decrypt using Web Crypto API (for production)
   */
  private async decryptWithWebCrypto(encryptedText: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedText).split('').map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      // Import the key
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.key.padEnd(32, '0').substring(0, 32)),
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );

      // Decrypt the data
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        keyMaterial,
        encrypted
      );

      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      // Fallback to XOR if Web Crypto fails
      return this.decryptWithXOR(encryptedText);
    }
  }

  /**
   * Simple XOR encryption (for development only)
   */
  private encryptWithXOR(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length));
    }
    return btoa(result);
  }

  /**
   * Simple XOR decryption (for development only)
   */
  private decryptWithXOR(encryptedText: string): string {
    try {
      const decoded = atob(encryptedText);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length));
      }
      return result;
    } catch {
      return '';
    }
  }
}

export const encryptionService = new EncryptionService();

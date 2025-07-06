
// Simple encryption for tokens in localStorage
class TokenManager {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private readonly USER_KEY = 'auth_user';
  private readonly EXPIRY_KEY = 'auth_expiry';

  // Simple XOR encryption for basic obfuscation
  private encrypt(text: string): string {
    const key = 'connectsphere_secret_key';
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  private decrypt(encryptedText: string): string {
    try {
      const decoded = atob(encryptedText);
      const key = 'connectsphere_secret_key';
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch {
      return '';
    }
  }

  setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, this.encrypt(token));
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  }

  getToken(): string | null {
    try {
      const encrypted = localStorage.getItem(this.TOKEN_KEY);
      return encrypted ? this.decrypt(encrypted) : null;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }

  setRefreshToken(token: string): void {
    try {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, this.encrypt(token));
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  getRefreshToken(): string | null {
    try {
      const encrypted = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      return encrypted ? this.decrypt(encrypted) : null;
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  setUser(user: any): void {
    try {
      localStorage.setItem(this.USER_KEY, this.encrypt(JSON.stringify(user)));
    } catch (error) {
      console.error('Failed to store user:', error);
    }
  }

  getUser(): any | null {
    try {
      const encrypted = localStorage.getItem(this.USER_KEY);
      if (!encrypted) return null;
      const decrypted = this.decrypt(encrypted);
      return decrypted ? JSON.parse(decrypted) : null;
    } catch (error) {
      console.error('Failed to retrieve user:', error);
      return null;
    }
  }

  setExpiry(expiry: string): void {
    try {
      localStorage.setItem(this.EXPIRY_KEY, this.encrypt(expiry));
    } catch (error) {
      console.error('Failed to store expiry:', error);
    }
  }

  getExpiry(): string | null {
    try {
      const encrypted = localStorage.getItem(this.EXPIRY_KEY);
      return encrypted ? this.decrypt(encrypted) : null;
    } catch (error) {
      console.error('Failed to retrieve expiry:', error);
      return null;
    }
  }

  clearAll(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.EXPIRY_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  isTokenExpired(): boolean {
    const expiry = this.getExpiry();
    if (!expiry) return true;
    return new Date(expiry) <= new Date();
  }
}

export const tokenManager = new TokenManager();

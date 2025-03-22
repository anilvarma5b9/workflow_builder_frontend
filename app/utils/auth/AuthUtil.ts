import Cookies from "js-cookie";
import StorageUtils from "../storage/StorageUtils";
import StorageConstants from "../storage/StorageConstants";

class AuthUtil {
  // ====== TOKEN ======

  static getToken(): string | null {
    try {
      const localToken = StorageUtils.load<string>(
        StorageConstants.AUTH_TOKEN_KEY
      );
      const cookieToken = Cookies.get(StorageConstants.AUTH_TOKEN_KEY);
      return localToken || cookieToken || null;
    } catch (error) {
      console.error("AuthUtil: Error retrieving token:", error);
      return null;
    }
  }

  static saveToken(token: string): void {
    try {
      StorageUtils.save(StorageConstants.AUTH_TOKEN_KEY, token);
      Cookies.set(StorageConstants.AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error("AuthUtil: Error saving token:", error);
    }
  }

  static clearToken(): void {
    try {
      StorageUtils.remove(StorageConstants.AUTH_TOKEN_KEY);
      Cookies.remove(StorageConstants.AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("AuthUtil: Error clearing token:", error);
    }
  }

  // ====== USER ID ======

  static getUserId(): number | null {
    try {
      const localId = StorageUtils.load<number>(StorageConstants.USER_ID);
      const cookieId = Cookies.get(StorageConstants.USER_ID);
      return localId ?? (cookieId ? parseInt(cookieId) : null);
    } catch (error) {
      console.error("AuthUtil: Error retrieving user ID:", error);
      return null;
    }
  }

  static saveUserId(userId: string): void {
    try {
      StorageUtils.save(StorageConstants.USER_ID, userId);
      Cookies.set(StorageConstants.USER_ID, userId.toString());
    } catch (error) {
      console.error("AuthUtil: Error saving user ID:", error);
    }
  }

  static clearUserId(): void {
    try {
      StorageUtils.remove(StorageConstants.USER_ID);
      Cookies.remove(StorageConstants.USER_ID);
    } catch (error) {
      console.error("AuthUtil: Error clearing user ID:", error);
    }
  }

  // ====== USER NAME ======

  static getUserName(): string | null {
    try {
      const name = StorageUtils.load<string>(StorageConstants.USER_NAME, true);
      return name;
    } catch (error) {
      console.error("AuthUtil: Error retrieving user name:", error);
      return null;
    }
  }

  static saveUserName(name: string): void {
    try {
      StorageUtils.save(StorageConstants.USER_NAME, name, true);
    } catch (error) {
      console.error("AuthUtil: Error saving user name:", error);
    }
  }

  static clearUserName(): void {
    try {
      StorageUtils.remove(StorageConstants.USER_NAME);
    } catch (error) {
      console.error("AuthUtil: Error clearing user name:", error);
    }
  }

  // ====== USER EMAIL ======

  static getUserEmail(): string | null {
    try {
      const email = StorageUtils.load<string>(
        StorageConstants.USER_EMAIL,
        true
      );
      return email;
    } catch (error) {
      console.error("AuthUtil: Error retrieving user email:", error);
      return null;
    }
  }

  static saveUserEmail(email: string): void {
    try {
      StorageUtils.save(StorageConstants.USER_EMAIL, email, true);
    } catch (error) {
      console.error("AuthUtil: Error saving user email:", error);
    }
  }

  static clearUserEmail(): void {
    try {
      StorageUtils.remove(StorageConstants.USER_EMAIL);
    } catch (error) {
      console.error("AuthUtil: Error clearing user email:", error);
    }
  }

  // ====== CLEAR ALL AUTH DATA ======

  static clearAuth(): void {
    this.clearToken();
    this.clearUserId();
    this.clearUserName();
    this.clearUserEmail();
  }
}

export default AuthUtil;

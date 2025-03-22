import CryptoJS from "crypto-js";

class StorageUtils {
  private static encryptionKey = process.env.STRORAGE_ENCRYPT_KEY || "";
  private static prefix = process.env.STRORAGE_PREFIX || "";

  /**
   * Generates a fully qualified key for storage.
   * @param key The base key name.
   * @returns Fully qualified key with prefix.
   */
  private static generateKey(key: string): string {
    return `${StorageUtils.prefix}:${key}`;
  }

  /**
   * Encrypts data before storing it.
   * @param value The value to encrypt.
   * @returns Encrypted string.
   */
  private static encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, StorageUtils.encryptionKey).toString();
  }

  /**
   * Decrypts data retrieved from storage.
   * @param encryptedValue The encrypted string.
   * @returns Decrypted string or null if decryption fails.
   */
  private static decrypt(encryptedValue: string): string | null {
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedValue,
        StorageUtils.encryptionKey
      );
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.log("Decryption failed:", error);
      return null;
    }
  }

  /**
   * Saves data to localStorage.
   * Supports string, number, boolean, array, or JSON objects.
   * @param key The key to store the data under.
   * @param value The value to store.
   * @param encrypt Whether to encrypt the data (default: false).
   */
  static save<T extends string | number | boolean | object | Array<unknown>>(
    key: string,
    value: T,
    encrypt: boolean = false
  ): void {
    try {
      const stringValue = JSON.stringify(value);
      const dataToStore = encrypt
        ? StorageUtils.encrypt(stringValue)
        : stringValue;
      localStorage.setItem(StorageUtils.generateKey(key), dataToStore);
    } catch (error) {
      console.log("Error saving to localStorage:", error);
    }
  }

  /**
   * Loads data from localStorage.
   * Supports string, number, boolean, array, or JSON objects.
   * @param key The key to retrieve the data from.
   * @param decrypt Whether to decrypt the data (default: false).
   * @param defaultValue A default value to return if the key is not found.
   * @returns The parsed value or the default value.
   */
  static load<T extends string | number | boolean | object | Array<unknown>>(
    key: string,
    decrypt: boolean = false,
    defaultValue?: T
  ): T {
    try {
      const storedValue = localStorage.getItem(StorageUtils.generateKey(key));
      if (!storedValue) return StorageUtils.getDefault(defaultValue);

      const rawValue = decrypt
        ? StorageUtils.decrypt(storedValue)
        : storedValue;
      return rawValue
        ? JSON.parse(rawValue)
        : StorageUtils.getDefault(defaultValue);
    } catch (error) {
      console.log("Error loading from localStorage:", error);
      return StorageUtils.getDefault(defaultValue);
    }
  }

  /**
   * Returns a default value based on the type of the provided default value.
   * @param defaultValue The default value to use as a fallback.
   * @returns The default value or a sensible fallback.
   */
  private static getDefault<T>(defaultValue?: T): T {
    if (defaultValue !== undefined) return defaultValue;

    // Default fallback values based on inferred type
    if (typeof defaultValue === "string") return "" as T;
    if (typeof defaultValue === "number") return 0 as T;
    if (typeof defaultValue === "boolean") return false as T;
    if (Array.isArray(defaultValue)) return [] as T;
    if (typeof defaultValue === "object") return {} as T;

    // Fallback to empty string for unspecified types
    return "" as T;
  }

  /**
   * Removes data from localStorage.
   * @param key The key to remove.
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(StorageUtils.generateKey(key));
    } catch (error) {
      console.log("Error removing from localStorage:", error);
    }
  }

  /**
   * Clears all data from localStorage for the current prefix.
   */
  static clear(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(`${StorageUtils.prefix}:`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.log("Error clearing localStorage:", error);
    }
  }
}

export default StorageUtils;

/**
 * Converts a HEX color to an RGBA color with the specified opacity.
 * @param hex - The HEX color code (e.g., "#FF5733").
 * @param opacity - The opacity value (0.0 to 1.0).
 * @returns The RGBA color string (e.g., "rgba(255, 87, 51, 0.8)").
 */
export const addOpacityToHex = (hex: string, opacity: number): string => {
    // Remove # if present
    const sanitizedHex = hex.replace("#", "");
    const r = parseInt(sanitizedHex.substring(0, 2), 16);
    const g = parseInt(sanitizedHex.substring(2, 4), 16);
    const b = parseInt(sanitizedHex.substring(4, 6), 16);
  
    // Return RGBA string
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
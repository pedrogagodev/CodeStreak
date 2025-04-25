import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { jwtDecode } from "jwt-decode";
import type { JWT } from "next-auth/jwt";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${process.env.API_SERVER_BASE_URL}/api/auth/token/refresh`, {
      headers: {
        Authorization: `Bearer ${token.refreshToken}`,
      },
      method: "POST",
    });

    const tokens = await response.json();

    if (!response.ok) {
      console.error("Refresh token error:", tokens);
      throw tokens;
    }
    const decoded = jwtDecode(tokens.accessToken);
    return {
      ...token,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
      accessTokenExpires: decoded.exp ? decoded.exp * 1000 : undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

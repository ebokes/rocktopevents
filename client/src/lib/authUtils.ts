export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

// JWT Token management in localStorage
const TOKEN_KEY = "admin_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();

  // Debug logging
  console.log("🔍 Auth Debug:", {
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : "No token",
    tokenLength: token?.length || 0,
  });

  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
}

// Check if token exists (basic validation)
export function hasValidToken(): boolean {
  const token = getStoredToken();
  return !!token;
}

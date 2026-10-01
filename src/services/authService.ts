import type { LoginRequest, TokenResponse, User } from "../types/auth";

export const TOKEN_KEY = "jwt_token";
export const USER_KEY = "jwt_user";
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export async function login(credentials: LoginRequest): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Fel användarnamn eller lösenord."
        : `Inloggningen misslyckades (${response.status}).`,
    );
  }

  const data: TokenResponse = await response.json();
  sessionStorage.setItem(TOKEN_KEY, data.accessToken);
  sessionStorage.setItem(
    USER_KEY,
    JSON.stringify({ subject: data.subject, roles: data.roles }),
  );
  return data;
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  const raw = sessionStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

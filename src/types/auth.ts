export type LoginRequest = {
  username: string;
  password: string;
};

export type TokenResponse = {
  accessToken: string;
  expiresIn: number;
  subject: string;
  roles: string[];
};
export type User = { subject: string; roles: string[] };

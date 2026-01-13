export interface AuthTokenPayload {
  userId: string;
  email: string;
  role?: "USER" | "ADMIN" | "AUTHOR";
}

export interface UserData {
  username: string;
  email: string;
  passwordHash: string;
  name: string;
}

export {};


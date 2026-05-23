export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "admin" | "user";
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

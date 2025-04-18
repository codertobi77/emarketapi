import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "ACHETEUR" | "VENDEUR" | "ADMIN" | "GESTIONNAIRE";
    };
  }

  interface User {
    id: string;
    email: string;
    role: "ACHETEUR" | "VENDEUR" | "ADMIN" | "GESTIONNAIRE";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: "ACHETEUR" | "VENDEUR" | "ADMIN" | "GESTIONNAIRE";
  }
}

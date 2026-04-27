import type { NextAuthConfig } from "next-auth";

const NEXTAUTH_URL = process.env.NEXTAUTH_URL || process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true, // Required for non-localhost URLs
  basePath: "/api/auth", // NextAuth API endpoint
  session: { strategy: "jwt" },
  pages: {
    signIn: "/level-up",
  },
  providers: [], // Providers using Node.js APIs (e.g. Prisma/bcrypt) belong in auth.ts
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.username = (user as { username: string }).username;
        token.picture = user.image;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

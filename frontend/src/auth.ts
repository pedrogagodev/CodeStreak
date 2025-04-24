import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "./lib/utils";
import { CustomUser } from "./types/customUser";

export const { handlers, auth, signOut } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const response = await fetch(
            `${process.env.API_SERVER_BASE_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (response.ok) {
            const parsedData = await response.json();

            const accessToken = parsedData.accessToken;
            const refreshToken = parsedData.refreshToken;
            const userData = parsedData?.user;

            return {
              accessToken,
              refreshToken,
              email: userData.email,
              name: userData.name,
            };
          }
          return null;
        } catch (error) {
          throw new Error(`Failed to fetch user data, error: ${error}`);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 5 * 60, // 5 minutes
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      const customUser = user as CustomUser;
      if (user && account) {
        token.accessToken = customUser.accessToken;
        token.refreshToken = customUser.refreshToken;
        token.email = customUser.email;

        if (token.accessToken) {
          const decoded = jwtDecode(token.accessToken);
          if (decoded.exp) {
            token.accessTokenExpires = decoded.exp * 1000;
          }
        }
        return token;
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      return await refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      session.user.email = token.email as string;
      session.user.name = token.name;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
    // error: "/auth/error",
  },
} satisfies NextAuthConfig);

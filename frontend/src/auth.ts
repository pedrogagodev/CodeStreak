import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

export const { handlers } = NextAuth({
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

        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            id: data.user?.id,
            email: data.user?.email || credentials.email,
            name: data.user?.name || null,
            accessToken: data.accessToken,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
    // error: "/auth/error",
  },
});

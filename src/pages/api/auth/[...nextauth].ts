import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    session({ session, token}) {
      // console.log('tokenUsername', token.username);
      // console.log('Session', session);

      if (token) {
          session.user!.id = token.id as string;
          session.user!.username = token.username as string;
      }

      return session;
    },
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.id = user.id;
        token.username = user.username!;
      }
      // console.log('JWT', token)
      return token
    }
  },
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        const user = await prisma.user.findFirst({
          where: {
            username: credentials?.username,
          }
        });

        if(credentials?.password && user?.password) {
          const result = await bcrypt.compare(credentials.password, user.password);
          if(result) {
            return user;
          }
        }
        
        return null;
      }
    })
    // ...add more providers here
  ],
  session: {
    strategy: 'jwt',
  },
  secret: env.NEXTAUTH_SECRET,
  jwt: {
    secret: env.NEXTAUTH_SECRET
  }

};

export default NextAuth(authOptions);

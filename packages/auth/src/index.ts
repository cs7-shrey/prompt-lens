import prisma from "@prompt-lens/db";
import { env } from "@prompt-lens/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const crossSubDomainCookies = env.NODE_ENV === "development" ? {} : {
  enabled: true,
  domain: ".".concat(env.BASE_FRONTEND_DOMAIN),
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      enabled: true,
      prompt: "select_account consent",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    ...crossSubDomainCookies,
  },
  plugins: [],
});

import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** Username Token */
    username?: string
  }
}


declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  type ISODateString = string;
  interface DefaultSession {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
    };
    expires: ISODateString;
  }
  interface Session {
    user?: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }
  
  interface DefaultUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  }
}

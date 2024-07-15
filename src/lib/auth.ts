import { Lucia } from "lucia";
import { db } from "astro:db";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Session, User } from "db/config";
import { asDrizzleTable } from "@astrojs/db/utils";

const sessionTable: any = asDrizzleTable("Session", Session);
const userTable = asDrizzleTable("User", User);

const adapter = new DrizzleSQLiteAdapter(db as any, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      name: attributes.name,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
}
interface DatabaseUserAttributes {
  username: string;
  name: string;
}
interface DatabaseSessionAttributes {
  expiresAt: Date;
  userId: string;
}

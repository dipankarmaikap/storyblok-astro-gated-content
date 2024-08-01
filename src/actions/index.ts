import { ActionError, defineAction, z } from "astro:actions";
import { db, User } from "astro:db";
import { createSession, DBuuid, hashPassword } from "~/lib/helper";

export const server = {
  newsletter: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      receivePromo: z.boolean(),
    }),
    handler: async ({ email, receivePromo }) => {
      console.log({ email, receivePromo });
      return { success: true };
    },
  }),
  signup: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
      username: z.string(),
      password: z.string(),
    }),
    handler: async ({ name, username, password }, context) => {
      const passwordHash = await hashPassword(password);
      const userId = DBuuid();
      await db.insert(User).values({
        id: userId,
        name,
        username,
        passwordHash,
      });
      await createSession(userId, context);
      return { success: true };
    },
  }),
};

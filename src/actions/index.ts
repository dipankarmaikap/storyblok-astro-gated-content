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
      name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
      email: z.string().email(),
      password: z.string().min(8, { message: "Password must be at least 8 characters long." }), // Minimum length of 8 characters
      // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." }), // At least one uppercase letter
      // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." }) // At least one lowercase letter
      // .regex(/[0-9]/, { message: "Password must contain at least one number." }) // At least one number
      // .regex(/[\W_]/, { message: "Password must contain at least one special character." }), // At least one special character
    }),
    handler: async ({ name, email, password }, context) => {
      //1.check if this email already exists. If so suggest login.
      //2.create JWT token with user details and sent it to the email

      const passwordHash = await hashPassword(password);
      const userId = DBuuid();
      try {
        await db.insert(User).values({
          id: userId,
          name,
          email,
          passwordHash,
        });
        await createSession(userId, context);
        return { success: true };
      } catch (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Unable to create create account, Please contact admin.",
        });
      }
    },
  }),
};

import type { APIContext } from "astro";
import { db, eq, User } from "astro:db";
import { createSession, throwError, validatePassword } from "~/lib/helper";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const username = formData.get("username");
  //Basic username validation
  const invalidUsername =
    typeof username !== "string" || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username);

  if (invalidUsername) {
    return throwError("Invalid username");
  }
  //Basic password validation

  const password = formData.get("password");
  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return throwError("Invalid password");
  }

  console.log({ username, password });

  //Check if user exist

  const existingUsers = await db.select().from(User).where(eq(User.username, username)).limit(1);
  const existingUser = existingUsers[0];

  if (!existingUser) {
    return throwError("Incorrect username or password");
  }

  const validPassword = await validatePassword(existingUser.passwordHash, password);

  if (!validPassword) {
    return throwError("Incorrect username or password");
  }

  await createSession(existingUser.id, context);

  return new Response();
}

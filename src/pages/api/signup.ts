import type { APIContext } from "astro";
import { db, User } from "astro:db";
import { createSession, DBuuid, hashPassword, throwError } from "~/lib/helper";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const name = formData.get("name");

  //name validation
  if (typeof name !== "string" || name.length < 1) {
    return throwError("Invalid name");
  }

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

  const passwordHash = await hashPassword(password);
  const userId = DBuuid();

  try {
    await db.insert(User).values({
      id: userId,
      name,
      username,
      passwordHash,
    });
    await createSession(userId, context);
    return new Response();
  } catch (e) {
    return throwError("An unknown error occurred", 500);
  }
}

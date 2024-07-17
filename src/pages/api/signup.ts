import type { APIContext } from "astro";
import { db, eq, User } from "astro:db";
import { createSession, DBuuid, hashPassword, isValidPassword, isValidUsername, throwError } from "~/lib/helper";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const name = formData.get("name");

  //name validation
  if (typeof name !== "string" || name.length < 3) {
    return throwError("Invalid name");
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!isValidUsername(username) || !isValidPassword(password)) {
    return throwError("Invalid username or password");
  }

  //Check if already have account then return error.
  const [existingUser] = await db.select().from(User).where(eq(User.username, username));
  if (existingUser) {
    return throwError("Already have an account. Please login.");
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
    return new Response(
      JSON.stringify({
        sucess: true,
      })
    );
  } catch (e) {
    return throwError("An unknown error occurred", 500);
  }
}

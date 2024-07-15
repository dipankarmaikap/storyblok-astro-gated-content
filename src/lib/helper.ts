import bcrypt from "bcrypt";
import { generateId } from "lucia";
import { lucia } from "./auth";
import type { APIContext } from "astro";

export function DBuuid() {
  return generateId(15);
}

const saltRounds = 10;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, saltRounds);
}
export async function validatePassword(hashPassword: string, password: string) {
  return await bcrypt.compare(password, hashPassword);
}

export async function createSession(userId: string, context: APIContext) {
  const oneHourFromNow = new Date();
  oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
  const session = await lucia.createSession(userId, {
    expiresAt: oneHourFromNow,
    userId,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export function throwError(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status,
    }
  );
}

import { hash, verify } from "@node-rs/argon2";
import { generateId } from "lucia";
import { lucia } from "./auth";
import type { APIContext } from "astro";

export function DBuuid() {
  return generateId(15);
}

const hashParameter = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};
export async function hashPassword(password: string) {
  return await hash(password, hashParameter);
}
export async function validatePassword(hashPassword: string, password: string) {
  return await verify(hashPassword, password, hashParameter);
}

export async function createSession(userId: string, context: APIContext) {
  try {
    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    const session = await lucia.createSession(userId, {
      expiresAt: oneHourFromNow,
      userId,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  } catch (error) {
    console.log(error);
  }
}

export function throwError(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({
      error: message,
      sucess: false,
    }),
    {
      status,
    }
  );
}

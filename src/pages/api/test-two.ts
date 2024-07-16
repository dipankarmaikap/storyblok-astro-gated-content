import { hash } from "@node-rs/argon2";
import type { APIContext } from "astro";
import { generateId } from "lucia";

export async function GET(context: APIContext): Promise<Response> {
  const user = {
    id: generateId(15),
    name: "Dipankar maikap",
    password: "123456",
    hashed: await hash("123456"),
  };

  return new Response(JSON.stringify(user));
}

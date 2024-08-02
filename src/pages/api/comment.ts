import type { APIContext } from "astro";
import { delay } from "~/lib/helper";

export async function POST(context: APIContext): Promise<Response> {
  const result = `
    <p>Test commenthtml from HTMX endpoint</p>
    `;
  await delay(1000);
  return new Response(result, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

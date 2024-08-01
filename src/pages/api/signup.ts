import type { APIContext } from "astro";
import { db, eq, User } from "astro:db";
import { container, createSession, DBuuid, hashPassword, parseZodError } from "~/lib/helper";
import { z } from "astro/zod";
import SignupForm from "~/components/forms/SignupForm.astro";

const SignupSchema = z.object({
  email: z.string().email().min(1),
  name: z.string().min(1),
  password: z.string().min(1),
});
export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const data = Object.fromEntries(formData);
  try {
    const { email, name, password } = SignupSchema.parse(data);

    const [existingUser] = await db.select().from(User).where(eq(User.email, email));

    if (existingUser) {
      const result = await container.renderToString(SignupForm, {
        props: {
          errors: { custom: "Already have an account. Please login." },
        },
      });
      return new Response(result, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }
    const passwordHash = await hashPassword(password);
    const userId = DBuuid();
    await db.insert(User).values({
      id: userId,
      name,
      email,
      passwordHash,
    });
    await createSession(userId, context);
    return new Response(null, {
      headers: {
        "HX-Location": "/",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const invalidInput = parseZodError(error);
      const result = await container.renderToString(SignupForm, {
        props: {
          errors: invalidInput,
        },
      });
      return new Response(result, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }
    const result = await container.renderToString(SignupForm, {
      props: {
        errors: { custom: "Something went wrong." },
      },
    });
    return new Response(result, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
}

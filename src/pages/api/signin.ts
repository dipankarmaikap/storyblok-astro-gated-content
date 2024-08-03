import type { APIContext } from "astro";
import { db, eq, Password, User } from "astro:db";
import { container, createSession, parseZodError, validatePassword } from "~/lib/helper";
import SigninForm from "~/components/forms/SigninForm.astro";
import { z } from "astro/zod";
const LoginSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});
export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const data = Object.fromEntries(formData);

  try {
    const { email, password } = LoginSchema.parse(data);

    const [existingUser] = await db.select().from(User).where(eq(User.email, email));

    const result = await container.renderToString(SigninForm, {
      props: {
        errors: { custom: "Incorrect email or password" },
      },
    });
    if (!existingUser) {
      return new Response(result, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }
    const [userPassword] = await db.select().from(Password).where(eq(Password.id, existingUser.id));
    if (!(await validatePassword(userPassword.hash, password))) {
      return new Response(result, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }
    await createSession(existingUser.id, context);

    return new Response(null, {
      headers: {
        "HX-Location": "/",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const invalidInput = parseZodError(error);
      const result = await container.renderToString(SigninForm, {
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
    const result = await container.renderToString(SigninForm, {
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

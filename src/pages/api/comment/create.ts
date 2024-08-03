import type { APIContext } from "astro";
import { z } from "astro/zod";
import { Comment, db } from "astro:db";
import { DBuuid, container } from "~/lib/helper";
import CommentUi from "~/components/Comment.astro";
const CommentSchema = z.object({
  articleId: z.string().min(1),
  parentId: z.string().nullable(),
  body: z.string(),
});
export async function POST(context: APIContext): Promise<Response> {
  const user = context.locals.user;
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const formData = await context.request.formData();
  const data = Object.fromEntries(formData);
  try {
    const { articleId, parentId, body } = CommentSchema.parse(data);

    const parentID = parentId || null;
    console.log({ parentId: parentId || null });

    const [comment] = await db
      .insert(Comment)
      .values({
        id: DBuuid(),
        articleId,
        body,
        parentId: parentID,
        userId: user.id,
      })
      .returning();
    const result = await container.renderToString(CommentUi, {
      props: {
        comment: { ...comment, name: user.name },
        articleId,
        nested: parentID ? true : false,
      },
    });
    return new Response(result, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      const result = `<p class="text-red-600 mt-2 form-error">Input Error</p>`;
      return new Response(result, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }
    const result = `<p class="text-red-600 mt-2 form-error">Unknown Error</p>`;
    return new Response(result, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
}

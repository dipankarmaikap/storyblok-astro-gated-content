import { db, Comment, User } from "astro:db";
import { DBuuid, hashPassword } from "~/lib/helper";

export default async function () {
  const [user] = await db
    .insert(User)
    .values({
      id: DBuuid(),
      name: "Dipankar Maikap",
      passwordHash: await hashPassword("123456"),
      username: "dipankar",
    })
    .returning();

  await db.insert(Comment).values([
    {
      id: DBuuid(),
      userId: user.id,
      articleId: "05fb03e8-5703-496f-8696-8bfbd350f476",
      body: "Great read on Storyblok's gated content capabilities! The flexibility it offers for managing and distributing premium content is a game-changer. The integration with Astro makes it even more powerful for developers.",
    },
    {
      id: DBuuid(),
      userId: user.id,
      articleId: "05fb03e8-5703-496f-8696-8bfbd350f476",
      body: "Thanks for the deep dive into using Astro with Storyblok. The section on leveraging Astro DB to enhance content delivery really stood out. It's exciting to see how these tools can work together to create seamless user experiences.",
    },
  ]);
}

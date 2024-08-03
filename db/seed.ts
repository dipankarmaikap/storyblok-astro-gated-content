import { db, Comment, User, Password } from "astro:db";
import { DBuuid, hashPassword } from "~/lib/helper";

export default async function () {
  const userID = DBuuid();
  await db.insert(User).values({
    id: userID,
    name: "Dipankar Maikap",
    email: "mail@dipankarmaikap.com",
  });
  await db.insert(Password).values({
    id: userID,
    hash: await hashPassword("12345678"),
  });
  const commentOneID = DBuuid();
  const commentChildID = DBuuid();
  await db.insert(Comment).values([
    {
      id: commentOneID,
      userId: userID,
      articleId: "05fb03e8-5703-496f-8696-8bfbd350f476",
      body: "Great read on Storyblok's gated content capabilities! The flexibility it offers for managing and distributing premium content is a game-changer. The integration with Astro makes it even more powerful for developers.",
    },
    {
      id: commentChildID,
      userId: userID,
      parentId: commentOneID,
      articleId: "05fb03e8-5703-496f-8696-8bfbd350f476",
      body: "Great read on Storyblok's gated content capabilities!",
    },
    {
      id: DBuuid(),
      userId: userID,
      parentId: commentChildID,
      articleId: "05fb03e8-5703-496f-8696-8bfbd350f476",
      body: "The flexibility it offers for managing and distributing premium content is a game-changer.",
    },
    {
      id: DBuuid(),
      userId: userID,
      articleId: "05fb03e8-5703-496f-8696-8bfbd350f476",
      body: "Thanks for the deep dive into using Astro with Storyblok. The section on leveraging Astro DB to enhance content delivery really stood out. It's exciting to see how these tools can work together to create seamless user experiences.",
    },
  ]);
}

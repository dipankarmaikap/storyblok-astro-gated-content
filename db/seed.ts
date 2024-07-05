import { db, Comment } from "astro:db";

export default async function () {
  await db.insert(Comment).values([
    { authorId: 1, body: "Hope you like Astro DB!", likes: 2 },
    { authorId: 2, body: "Enjoy!", likes: 10 },
  ]);
}

import { db, Comment } from "astro:db";

export default async function () {
  await db.insert(Comment).values([
    {
      authorId: 1,
      body: "Fantastic overview of Astro! The way it integrates with Storyblok for creating dynamic, content-rich websites is impressive. I'm eager to try out the new features you've highlighted, especially with Astro DB.",
    },
    {
      authorId: 2,
      body: "Great read on Storyblok's gated content capabilities! The flexibility it offers for managing and distributing premium content is a game-changer. The integration with Astro makes it even more powerful for developers.",
    },
    {
      authorId: 3,
      body: "Thanks for the deep dive into using Astro with Storyblok. The section on leveraging Astro DB to enhance content delivery really stood out. It's exciting to see how these tools can work together to create seamless user experiences.",
    },
  ]);
}

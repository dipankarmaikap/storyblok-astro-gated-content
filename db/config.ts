import { defineDb, defineTable, column } from "astro:db";

const Comment = defineTable({
  columns: {
    authorId: column.number(),
    body: column.text(),
    likes: column.number(),
  },
});

export default defineDb({
  tables: { Comment },
});

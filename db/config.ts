import { defineDb, defineTable, column, NOW } from "astro:db";

const Comment = defineTable({
  columns: {
    authorId: column.number(),
    body: column.text(),
  },
});
const User = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    username: column.text({
      unique: true,
    }),
    password_hash: column.text(),
  },
});
const Session = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    expires_at: column.date(),
    user_id: column.number(),
    authorId: column.number(),
  },
  foreignKeys: [
    {
      columns: ["user_id"],
      references: () => [User.columns.id],
    },
  ],
});

export default defineDb({
  tables: { Comment, User, Session },
});

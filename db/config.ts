import { defineDb, defineTable, column, NOW } from "astro:db";

export const Comment = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    publishedAt: column.date({
      default: NOW,
    }),
    body: column.text(),
    userId: column.text({
      references: () => User.columns.id,
    }),
  },
});
export const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    username: column.text({
      unique: true,
    }),
    name: column.text(),
    passwordHash: column.text(),
  },
});
export const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    expiresAt: column.number(),
    userId: column.text({
      references: () => User.columns.id,
    }),
  },
});

export default defineDb({
  tables: { Comment, User, Session },
});

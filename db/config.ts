import { defineDb, defineTable, column, NOW } from "astro:db";

const Comment = defineTable({
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
const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    username: column.text({
      unique: true,
    }),
    name: column.text(),
    passwordHash: column.text(),
  },
});

const Session = defineTable({
  columns: {
    id: column.text(),
    expiresAt: column.number({ optional: false }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
  },
});
export default defineDb({
  tables: { Comment, User, Session },
});

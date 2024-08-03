import { defineDb, defineTable, column, NOW, sql } from "astro:db";

const Comment = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    createdAt: column.date({
      default: NOW,
    }),
    updatedAt: column.date({
      default: sql`(CURRENT_TIMESTAMP)`,
    }),
    body: column.text(),
    userId: column.text({
      references: () => User.columns.id,
    }),
    parentId: column.text({
      references: () => Comment.columns.id,
      optional: true,
    }),
    articleId: column.text(),
  },
});
const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    email: column.text({
      unique: true,
    }),
    name: column.text(),
    role: column.text({
      default: "subscriber",
    }),
  },
});
const Password = defineTable({
  columns: {
    id: column.text({ primaryKey: true, optional: false, references: () => User.columns.id }),
    hash: column.text(),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({ unique: true }),
    expiresAt: column.number({ optional: false }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
  },
});
export default defineDb({
  tables: { Comment, User, Session, Password },
});

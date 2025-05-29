import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    id: v.string(),
    usedStorage: v.number(),
  }).index("byId", ["id"]),
  files: defineTable({
    id: v.string(),
    userId: v.string(),
    name: v.string(),
    size: v.number(),
    type: v.string(),
    uploadDate: v.number(),
    link: v.string(),
  })
    .index("byId", ["id"])
    .index("byUserId", ["userId"]),
});

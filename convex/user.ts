import { mutation, query } from "./_generated/server";
import { extractUserId } from "@/lib/utils";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Unauthorized");
    }

    const userId = extractUserId(identity.tokenIdentifier);
    const existingUser = await ctx.db
      .query("users")
      .withIndex("byId", (q) => q.eq("id", userId))
      .unique();

    return existingUser;
  },
});

export const getOrCreate = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Unauthorized");
    }

    const userId = extractUserId(identity.tokenIdentifier);
    const existingUser = await ctx.db
      .query("users")
      .withIndex("byId", (q) => q.eq("id", userId))
      .unique();

    if (!existingUser) {
      const newUser = {
        id: userId,
        usedStorage: 0,
      };

      const _id = await ctx.db.insert("users", newUser);

      return {
        _id: _id,
        ...newUser,
      };
    }

    return existingUser;
  },
});

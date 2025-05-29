import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { extractUserId } from "@/lib/utils";
import { utapi } from "@/server/uploadthing";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Unauthorized");
    }

    const userId = extractUserId(identity.tokenIdentifier);
    const files = await ctx.db
      .query("files")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();

    return files;
  },
});

export const upload = mutation({
  args: {
    _userId: v.id("users"),
    usedStorage: v.number(),
    id: v.string(),
    type: v.string(),
    name: v.string(),
    size: v.number(),
    link: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Unauthorized");
    }

    const userId = extractUserId(identity.tokenIdentifier);

    ctx.db.insert("files", {
      id: args.id,
      type: args.type,
      userId: userId,
      name: args.name,
      size: args.size,
      uploadDate: Date.now(),
      link: args.link,
    });

    ctx.db.patch(args._userId, {
      usedStorage: args.usedStorage + args.size,
    });

    return "success";
  },
});

export const deleteFile = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Unauthorized");
    }

    const userId = extractUserId(identity.tokenIdentifier);

    const user = await ctx.db
      .query("users")
      .withIndex("byId", (q) => q.eq("id", userId))
      .unique();

    if (user == undefined) {
      throw new Error("Unauthorized");
    }

    const file = await ctx.db
      .query("files")
      .withIndex("byId", (q) => q.eq("id", args.id))
      .unique();

    if (file?.userId != userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(file._id);

    await ctx.db.patch(user?._id, {
      usedStorage: user?.usedStorage - file.size,
    });

    return true;
  },
});

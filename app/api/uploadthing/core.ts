import { getAuth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { fetchMutation } from "convex/nextjs";

const f = createUploadthing();

import { NextRequest } from "next/server";
import { api } from "@/convex/_generated/api";
import { MAXSTORAGESIZE } from "@/lib/constants";

const auth = async (req: NextRequest) => await getAuth(req);

export const fileShareFileRouter = {
  uploadedFile: f({
    blob: { maxFileCount: 1, minFileCount: 1, maxFileSize: "512MB" },
  })
    .middleware(async ({ req, files }) => {
      const token = await (
        await auth(req)
      ).getToken({
        template: "convex",
      });

      if (token == null) {
        throw new UploadThingError("Unauthorized");
      }

      const user = await fetchMutation(
        api.user.getOrCreate,
        {},
        {
          token: token,
        }
      );

      const storageLeft = MAXSTORAGESIZE - user.usedStorage;

      if (storageLeft < files[0].size) {
        throw new UploadThingError("Not enough storage");
      }

      return { user: user, token: token };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await fetchMutation(
        api.files.upload,
        {
          _userId: metadata.user._id,
          usedStorage: metadata.user.usedStorage,
          id: file.key,
          name: file.name,
          size: file.size,
          type: file.type,
          link: file.ufsUrl,
        },
        {
          token: metadata.token,
        }
      );
    }),
} satisfies FileRouter;

export type FileShareFileRouter = typeof fileShareFileRouter;

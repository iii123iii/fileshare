import { getAuth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const auth = async (req: NextRequest) => await getAuth(req);

export const fileShareFileRouter = {
  uploadedFile: f({
    blob: { maxFileCount: 1, minFileCount: 1, maxFileSize: "64MB" },
  })
    .middleware(async ({ req, files }) => {
      const user = await auth(req);

      if (!user.userId) throw new UploadThingError("Unauthorized");

      let usedStorage = 0;

      const userUsedStorage = await prisma.user.findUnique({
        where: {
          id: user.userId,
        },
        select: {
          usedStorage: true,
        },
      });

      if (!userUsedStorage) {
        await prisma.user.create({
          data: {
            id: user.userId,
            usedStorage: 0,
          },
        });

        usedStorage = 0;
      } else {
        usedStorage = userUsedStorage?.usedStorage;
      }

      const storageLeft = 64000000 - usedStorage;

      if (storageLeft < files[0].size) {
        throw new UploadThingError("Not enough storage");
      }

      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const data = await prisma.file.create({
        data: {
          id: file.key,
          uid: metadata.userId,
          name: file.name,
          type: file.type,
          size: file.size,
          link: file.ufsUrl,
        },
        select: {
          id: true,
          uid: true,
          name: true,
          type: true,
          size: true,
          link: true,
          uploadDate: true,
        },
      });

      await prisma.user.update({
        where: {
          id: metadata.userId,
        },
        data: {
          usedStorage: {
            increment: file.size,
          },
        },
      });

      return { data: { ...data, uploadDate: data.uploadDate.toISOString() } };
    }),
} satisfies FileRouter;

export type FileShareFileRouter = typeof fileShareFileRouter;

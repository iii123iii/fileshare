"use server";

import { prisma } from "@/lib/prisma";
import { utapi } from "@/server/uploadthing";
import { currentUser } from "@clerk/nextjs/server";

export const deleteFile = async (id: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("unAuthorized");

  const file = await prisma.file.findUnique({
    where: {
      id,
    },
    select: {
      uid: true,
      size: true,
    },
  });

  if (!file) throw new Error("File not found");
  if (user?.id != file.uid) throw new Error("unAuthorized");

  utapi.deleteFiles(id);

  await prisma.$transaction([
    prisma.file.delete({
      where: {
        uid: user.id,
        id,
      },
    }),
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        usedStorage: {
          decrement: file.size,
        },
      },
    }),
  ]);

  return "Ok";
};

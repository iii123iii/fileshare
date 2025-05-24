import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let user: {
      usedStorage: number;
      files: {
        id: string;
        name: string;
        type: string;
        size: number;
        link: string;
        uploadDate: Date;
      }[];
    } | null;

    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        files: {
          orderBy: {
            uploadDate: "desc",
          },
          select: {
            id: true,
            name: true,
            size: true,
            type: true,
            link: true,
            uploadDate: true,
          },
        },
        usedStorage: true,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          usedStorage: 0,
        },
        select: {
          files: {
            orderBy: {
              uploadDate: "desc",
            },
            select: {
              id: true,
              name: true,
              size: true,
              type: true,
              link: true,
              uploadDate: true,
            },
          },
          usedStorage: true,
        },
      });
    }

    const usedStorage = user.usedStorage;
    const files = user.files;

    return NextResponse.json({
      usedStorage,
      files,
    });
  } catch (error) {
    console.error("[STORAGE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export type Storage = {
  usedStorage: number;
  files: {
    id: string;
    name: string;
    type: string;
    size: number;
    link: string;
    uid: string;
    uploadDate: Date;
  }[];
};

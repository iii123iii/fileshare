import { api } from "@/convex/_generated/api";
import { utapi } from "@/server/uploadthing";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";

export async function DELETE(req: Request) {
  try {
    const Auth = await auth();
    const token = await Auth.getToken({
      template: "convex",
    });

    if (!token) {
      throw new Error("Unauthorized");
    }

    const body = await req.json();
    const { fileId } = body;

    if (!fileId) {
      return Response.json(
        { error: "File is required in the request body" },
        { status: 400 }
      );
    }

    const success = await fetchMutation(
      api.files.deleteFile,
      {
        id: fileId,
      },
      {
        token: token,
      }
    );

    if (!success) {
      throw new Error("Error in mutation");
    }

    utapi.deleteFiles([fileId]);

    return Response.json({ success: true });
  } catch (_error) {
    throw new Error("Error");
  }
}

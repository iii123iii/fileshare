"use client";

import type React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { MAXSTORAGESIZE } from "@/lib/constants";

export function FileUploader() {
  return (
    <div className="space-y-4 w-full overflow-hidden">
      <UploadDropzone
        endpoint="uploadedFile"
        appearance={{
          container: {
            marginTop: 0,
            borderColor: "var(--border)",
            borderWidth: "2px",
            borderStyle: "dashed",
          },
          button: {
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          },
          allowedContent: {
            color: "var(--muted-foreground)",
            content: `File (${(MAXSTORAGESIZE / (1024 * 1024)).toFixed(2)} MB)`,
          },
        }}
        onUploadBegin={() => {
          toast.loading("File is uploading", { id: "FileUpload" });
        }}
        onUploadError={(e) => {
          toast.error(e.message, { id: "FileUpload" });
        }}
        onClientUploadComplete={() => {
          toast.success("File uploaded successfully", { id: "FileUpload" });
        }}
      />
    </div>
  );
}

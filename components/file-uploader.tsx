"use client";

import type React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { file } from "@/types/types";

interface Props {
  onUpload: (file: file) => void;
}

export function FileUploader({ onUpload }: Props) {
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
          },
        }}
        onUploadBegin={() => {
          toast.loading("File is uploading", { id: "FileUpload" });
        }}
        onUploadError={(e) => {
          toast.error(e.message, { id: "FileUpload" });
        }}
        onClientUploadComplete={(file) => {
          toast.success("File uploaded successfully", { id: "FileUpload" });
          onUpload({
            ...file[0].serverData.data,
            uploadDate: new Date(file[0].serverData.data.uploadDate),
          });
        }}
      />
    </div>
  );
}

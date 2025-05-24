import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { FileShareFileRouter } from "../app/api/uploadthing/core";

export const UploadButton = generateUploadButton<FileShareFileRouter>();
export const UploadDropzone = generateUploadDropzone<FileShareFileRouter>();

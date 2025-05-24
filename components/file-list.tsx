"use client";

import { useState } from "react";
import {
  FileIcon,
  ImageIcon,
  FileTextIcon,
  FileVideoIcon,
  FileMusicIcon,
  MoreVertical,
  LinkIcon,
  Trash2,
  Download,
  Check,
  Copy,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { file } from "@/types/types";
import { useDeleteFile, useFileStorage } from "@/hooks";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";

export function FileList() {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<file | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data, isLoading } = useFileStorage();
  const deleteFileMutation = useDeleteFile();

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    if (fileType.startsWith("video/"))
      return <FileVideoIcon className="h-5 w-5" />;
    if (fileType.startsWith("audio/"))
      return <FileMusicIcon className="h-5 w-5" />;
    if (fileType.startsWith("text/"))
      return <FileTextIcon className="h-5 w-5" />;
    return <FileIcon className="h-5 w-5" />;
  };

  const handleShare = (file: file) => {
    setCurrentFile(file);
    setShareDialogOpen(true);
  };

  const handleCopyLink = () => {
    if (currentFile?.link) {
      navigator.clipboard.writeText(currentFile.link);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleDelete = async (fileId: string) => {
    setIsDeleting(true);
    try {
      await deleteFileMutation.mutateAsync(fileId);
      toast.success("File deleted successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === "string") {
        toast.error(error);
      } else {
        toast.error("An unexpected error occurred while deleting the file.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (File: file) => {
    try {
      if (File.link) {
        const response = await fetch(File.link, {
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Download failed");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", File.name || "download");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download failed:", error);
      window.open(File.link, "_blank");
    }
  };

  if (isLoading) {
    return (
      <Skeleton className="w-full h-[200px] rounded-lg border shadow-sm" />
    );
  }

  if (data?.files.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
        <h3 className="font-medium text-lg">No files uploaded yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Upload files to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="hidden md:block">
        <div className="max-h-[550px] overflow-y-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b sticky top-0 bg-card z-10">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Size
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Uploaded
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {data?.files.map((file) => (
                <tr
                  key={file.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="font-medium truncate">{file.name}</div>
                    </div>
                  </td>
                  <td className="p-4 align-middle whitespace-nowrap">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="p-4 align-middle whitespace-nowrap">
                    {formatDistanceToNow(new Date(file.uploadDate), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="p-4 align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleShare(file)}>
                          <LinkIcon className="mr-2 h-4 w-4" />
                          <span>Share</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(file)}>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(file.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden max-h-[600px] overflow-y-auto">
        <div className="divide-y divide-border">
          {data?.files.map((file) => (
            <div key={file.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="text-muted-foreground flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm leading-tight break-words">
                      {file.name}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(file.uploadDate), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare(file)}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(file)}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(file.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Share file</DialogTitle>
            <DialogDescription>
              Anyone with this link will be able to view and download this file.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-2">
            <div className="grid flex-1 gap-2 min-w-0">
              <Input
                value={currentFile?.link || "No link available"}
                readOnly
                className="pr-12 text-sm"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="px-3 flex-shrink-0"
              onClick={handleCopyLink}
              disabled={!currentFile?.link}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="ml-1 hidden sm:inline">
                {copied ? "Copied" : "Copy"}
              </span>
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <div className="text-xs text-muted-foreground mt-2">
              This link will not expire unless you delete the file.
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

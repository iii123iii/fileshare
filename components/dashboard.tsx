"use client";

import { FileUploader } from "./file-uploader";
import { FileList } from "./file-list";
import { Navbar } from "./navbar";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Dashboard() {
  const usedStorage = useQuery(api.user.get);

  const files = useQuery(api.files.get);

  const totalStorageUsed = usedStorage?.usedStorage ?? 0;
  const maxStorage = 64 * 1024 * 1024;
  const storagePercentage = Math.min(
    (totalStorageUsed / maxStorage) * 100,
    100
  );

  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="grid gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              File Dashboard
            </h1>
            <p className="text-muted-foreground">
              Upload and manage your files in one place
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
            <div className="space-y-6 min-w-0">
              <FileUploader />
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Files</h2>
                <FileList
                  files={files?.map((file) => ({
                    ...file,
                    uploadDate: new Date(file.uploadDate),
                  }))}
                />
              </div>
            </div>

            <div className="space-y-6 min-w-0">
              {usedStorage === undefined ? (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 flex flex-col gap-2">
                    <Skeleton className="h-6 w-1/3 rounded" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <Skeleton className="h-4 w-1/3 rounded" />
                        <Skeleton className="h-4 w-1/4 rounded" />
                      </div>
                      <Skeleton className="h-3 w-full rounded-full" />
                      <div className="flex items-center justify-between text-sm">
                        <Skeleton className="h-4 w-1/4 rounded" />
                        <Skeleton className="h-4 w-1/6 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 flex flex-col gap-2">
                    <h3 className="font-semibold text-lg">Storage</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate">Storage Used</span>
                        <span className="font-medium ml-2 whitespace-nowrap">
                          {(totalStorageUsed / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{
                            width: `${storagePercentage}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate">Limit</span>
                        <span className="font-medium ml-2 whitespace-nowrap">
                          64 MB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6">
                  {files === undefined ? (
                    <Skeleton className="h-6 w-1/2 rounded mb-2" />
                  ) : (
                    <h3 className="font-semibold text-lg mb-2">
                      Recent Activity
                    </h3>
                  )}
                  {files === undefined ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Skeleton className="w-2 h-2 rounded-full flex-shrink-0" />
                          <Skeleton className="h-4 w-3/4 rounded" />
                        </div>
                      ))}
                    </div>
                  ) : files.length > 0 ? (
                    <div className="space-y-4">
                      {files.slice(0, 3).map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                          <span className="truncate">{`Uploaded ${file.name}`}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent activity
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

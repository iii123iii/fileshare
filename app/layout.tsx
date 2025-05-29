import type React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import "./globals.css";
import { fileShareFileRouter } from "./api/uploadthing/core";
import { Toaster } from "sonner";
import QueryClientContextProvider from "@/components/QueryClientContextProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ConvexClientProvider from "@/components/ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FileShare - File Upload Dashboard",
  description:
    "A modern file upload dashboard with drag-and-drop functionality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientContextProvider>
      <ClerkProvider
        afterSignOutUrl="/sign-in"
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <ConvexClientProvider>
          <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
              <NextSSRPlugin
                routerConfig={extractRouterConfig(fileShareFileRouter)}
              />
              <div>{children}</div>
              <Toaster richColors />
              <ReactQueryDevtools initialIsOpen={false} />
            </body>
          </html>
        </ConvexClientProvider>
      </ClerkProvider>
    </QueryClientContextProvider>
  );
}

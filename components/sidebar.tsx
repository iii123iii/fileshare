import Link from "next/link";
import { Home, FileText, Share2 } from "lucide-react";

export function Sidebar() {
  const storageUsed = 28.2;
  const storageLimit = 100;
  const storagePercentage = (storageUsed / storageLimit) * 100;

  return (
    <div className="w-[220px] h-screen border-r bg-white flex flex-col">
      <div className="p-4">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Menu</h2>
        <nav className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-indigo-600 bg-indigo-50"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/files"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <FileText className="h-4 w-4" />
            My Files
          </Link>
          <Link
            href="/shared"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Share2 className="h-4 w-4" />
            Shared
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-4 border-t">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Storage</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Storage Used</span>
            <span className="font-medium">
              {storageUsed}MB / {storageLimit}MB
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

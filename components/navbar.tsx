"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
/*import { usePathname } from "next/navigation";*/
import { CheckCircle } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  /*const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);*/
  const [scrolled, setScrolled] = useState(false);
  /*const pathname = usePathname();*/

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  /*useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/files", label: "My Files", icon: FileText },
    { href: "/dashboard/shared", label: "Shared", icon: Share2 },
  ];*/

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/20 backdrop-blur-md border-b shadow-sm"
          : "bg-white border-b"
      }`}
    >
      {/* Desktop Navigation */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {/*<Button
            variant="ghost"
            size="icon"
            className="md:hidden flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>*/}

          <Link
            href="/dashboard"
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-indigo-600 text-white">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl">FileShare</span>
          </Link>

          {/* Desktop Navigation Links */}
          {/*         
          <nav className="hidden md:flex items-center ml-6 space-x-4 lg:space-x-6 overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap px-1 py-1 ${
                  isActive(link.href)
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                <link.icon className="h-4 w-4 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav> */}
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 ml-2">
          <UserButton />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {/*<div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[300px] border-t" : "max-h-0"
        }`}
      >
        <nav className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <link.icon className="h-5 w-5 flex-shrink-0" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div> */}
    </header>
  );
}

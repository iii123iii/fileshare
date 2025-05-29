"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/20 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-indigo-600 text-white">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl">FileShare</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 ml-2">
          <div className="hidden sm:flex">
            <Link href="/dashboard">
              <Button className="buttonGradient">Dashboard</Button>
            </Link>
          </div>
          <div className="flex items-center">
            <Unauthenticated>
              <Link href="/sign-in">
                <Button className="buttonGradientOutline" variant={"outline"}>
                  Log in
                </Button>
              </Link>
            </Unauthenticated>
            <Authenticated>
              <UserButton />
            </Authenticated>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

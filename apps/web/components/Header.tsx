'use client'

import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return(
    <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 "bg-background/80 shadow-sm"`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <span className="font-bold text-xl">EzySend</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Link
              href="/signin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link href={'/signup'}>
              <Button className="rounded-full">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden mx-2 absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
          >
            <div className="container py-4 flex flex-col gap-4">
              <Link href="#features" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="#testimonials" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Testimonials
              </Link>
              <Link href="#pricing" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="#faq" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link href="/signin" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Sign in
                </Link>
                <Button className="rounded-full">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
  )
}
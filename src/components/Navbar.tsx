"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/calculator", label: "Calculator" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-brand-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">$</span>
          BrightPath Loans
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-brand-700 ${
                pathname === link.href ? "text-brand-700" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-brand-700">
                Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-brand-700">
                Log in
              </Link>
              <Link href="/apply" className="btn-primary">
                Apply now
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-slate-600 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                {link.label}
              </Link>
            ))}
            <hr className="my-1 border-slate-200" />
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-left text-sm font-medium text-slate-700"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                  Log in
                </Link>
                <Link href="/apply" onClick={() => setOpen(false)} className="btn-primary w-fit">
                  Apply now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

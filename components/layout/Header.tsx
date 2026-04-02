"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const compareCount = useCompareStore((s) => s.schools.length);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="inner">
        {/* Logo */}
        <Link href="/" className="site-logo">
          SchoolFinder<span>.</span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="site-nav">
          <Link href="/schools" className={`nav-link ${isActive("/schools") ? "active" : ""}`}>
            Explore
          </Link>
          <Link href="/compare" className={`nav-link ${isActive("/compare") ? "active" : ""}`}>
            Compare
            {compareCount > 0 && <span className="nav-badge">{compareCount}</span>}
          </Link>
          <Link href="/login" className="btn-signin">
            Sign in
          </Link>
        </nav>

        {/* Hamburger — shown on mobile only */}
        <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="mobile-menu">
          <Link href="/schools" onClick={() => setOpen(false)}>Explore</Link>
          <Link href="/compare" onClick={() => setOpen(false)}>
            Compare {compareCount > 0 ? `(${compareCount})` : ""}
          </Link>
          <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
        </div>
      )}
    </header>
  );
}

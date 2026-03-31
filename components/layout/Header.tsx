"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, GitCompare } from "lucide-react";
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

        {/* Desktop nav */}
        <nav className="site-nav">
          <Link href="/schools" className={`nav-link ${isActive("/schools") ? "active" : ""}`}>
            Explore
          </Link>
          <Link href="/compare" className={`nav-link ${isActive("/compare") ? "active" : ""}`}>
            Compare
            {compareCount > 0 && (
              <span className="nav-badge">{compareCount}</span>
            )}
          </Link>
        </nav>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/login" className="btn-signin" style={{ display: "block" }}>
            Sign in Access
          </Link>
          <button className="mobile-toggle" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu">
          <Link href="/schools" onClick={() => setOpen(false)}>Explore</Link>
          <Link href="/compare" onClick={() => setOpen(false)}>
            Compare {compareCount > 0 ? `(${compareCount})` : ""}
          </Link>
          <Link href="/login" onClick={() => setOpen(false)}>Sign in Access</Link>
        </div>
      )}
    </header>
  );
}

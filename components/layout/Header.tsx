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
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--dark)", color: "white", height: 56,
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 20px",
          width: "100%", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          {/* Logo */}
          <Link href="/" style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: -0.5, textDecoration: "none", flexShrink: 0 }}>
            SchoolFinder<span style={{ color: "var(--beige-500)" }}>.</span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="desk-nav">
            <Link href="/schools" style={{
              padding: "7px 14px", borderRadius: 10, fontSize: 13, fontWeight: 500,
              color: isActive("/schools") ? "white" : "rgba(255,255,255,0.65)",
              background: isActive("/schools") ? "rgba(255,255,255,0.12)" : "none",
              textDecoration: "none",
            }}>Explore</Link>
            <Link href="/compare" style={{
              padding: "7px 14px", borderRadius: 10, fontSize: 13, fontWeight: 500,
              color: isActive("/compare") ? "white" : "rgba(255,255,255,0.65)",
              background: isActive("/compare") ? "rgba(255,255,255,0.12)" : "none",
              textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
            }}>
              Compare
              {compareCount > 0 && (
                <span style={{
                  width: 18, height: 18, background: "var(--beige-500)", color: "var(--dark)",
                  borderRadius: "50%", fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{compareCount}</span>
              )}
            </Link>
            <Link href="/login" style={{
              padding: "7px 16px", background: "white", color: "var(--dark)",
              borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none",
              marginLeft: 4,
            }}>Sign in</Link>
          </nav>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(!open)}
            className="ham-btn"
            style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.8)",
              padding: 6, cursor: "pointer", display: "none",
            }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div style={{
            background: "#222", borderTop: "1px solid #333",
            padding: "8px 16px 12px",
          }}>
            <Link href="/schools" onClick={() => setOpen(false)} style={{
              display: "block", padding: "10px 12px", borderRadius: 8,
              color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}>Explore</Link>
            <Link href="/compare" onClick={() => setOpen(false)} style={{
              display: "block", padding: "10px 12px", borderRadius: 8,
              color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}>
              Compare {compareCount > 0 ? `(${compareCount})` : ""}
            </Link>
            <Link href="/login" onClick={() => setOpen(false)} style={{
              display: "block", padding: "10px 12px", borderRadius: 8,
              color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}>Sign in</Link>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 768px) {
          .desk-nav { display: none !important; }
          .ham-btn { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </>
  );
}

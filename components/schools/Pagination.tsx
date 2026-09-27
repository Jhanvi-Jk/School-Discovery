"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// 1 … 4 5 [6] 7 8 … 42 — always show first, last and a window around the current page
function pageItems(page: number, total: number): (number | "gap")[] {
  const keep = new Set<number>([1, total, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => keep.add(n));
  if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => keep.add(n));
  const sorted = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) items.push("gap");
    items.push(n);
  });
  return items;
}

const base: React.CSSProperties = {
  minWidth: 36, height: 36, padding: "0 10px", borderRadius: 10,
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
  fontSize: 13, fontWeight: 600, cursor: "pointer",
  border: "1.5px solid var(--beige-500)", background: "var(--beige-200)", color: "var(--dark)",
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 6, margin: "24px 0 8px" }}
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        style={{ ...base, opacity: page <= 1 ? 0.45 : 1, cursor: page <= 1 ? "not-allowed" : "pointer" }}
      >
        <ChevronLeft size={14} /> Prev
      </button>

      {pageItems(page, totalPages).map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} aria-hidden="true" style={{ color: "var(--muted)", padding: "0 2px" }}>…</span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            style={{
              ...base,
              background: item === page ? "var(--dark)" : base.background,
              color: item === page ? "white" : "var(--dark)",
              borderColor: item === page ? "var(--dark)" : "var(--beige-500)",
            }}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        style={{ ...base, opacity: page >= totalPages ? 0.45 : 1, cursor: page >= totalPages ? "not-allowed" : "pointer" }}
      >
        Next <ChevronRight size={14} />
      </button>
    </nav>
  );
}

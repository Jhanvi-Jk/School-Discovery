"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type TabId =
  | "photos"
  | "basic"
  | "summary"
  | "sentiment"
  | "feedback"
  | "peer"
  | "unique"
  | "campus"
  | "admission"
  | "fees"
  | "sources";

export const ALL_TABS: { id: TabId; label: string }[] = [
  { id: "photos",    label: "📷 Photos" },
  { id: "basic",     label: "Basic Details" },
  { id: "summary",   label: "Summary" },
  { id: "sentiment", label: "Sentiment Analysis" },
  { id: "feedback",  label: "Parent Feedback" },
  { id: "peer",      label: "Peer Group" },
  { id: "unique",    label: "Unique Things" },
  { id: "campus",    label: "Campus" },
  { id: "admission", label: "Admission" },
  { id: "fees",      label: "Fees" },
  { id: "sources",   label: "Sources" },
];

interface Props {
  availableTabs?: TabId[];
}

// Total sticky offset: 56px site-header + ~52px this tab bar + 8px breathing = 116px
const SCROLL_OFFSET = 116;

export function SchoolProfileTabs({ availableTabs }: Props) {
  const visibleTabs = ALL_TABS;
  const [active, setActive] = useState<TabId>(ALL_TABS[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    activeButtonRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  // IntersectionObserver: highlight tab as section scrolls into view
  useEffect(() => {
    const sections = ALL_TABS
      .map((t) => document.getElementById(`section-${t.id}`))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
          setActive(visible[0].target.id.replace("section-", "") as TabId);
        }
      },
      // rootMargin top offset = SCROLL_OFFSET so sections activate when they clear the sticky bars
      { rootMargin: `-${SCROLL_OFFSET}px 0px -50% 0px`, threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: TabId) {
    const el = document.getElementById(`section-${id}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(id);
  }

  function scrollNav(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -180 : 180, behavior: "smooth" });
  }

  return (
    <div
      className="sticky top-14 z-30"
      style={{ background: "var(--beige-200)", borderBottom: "1px solid var(--beige-500)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center" }}>
        {/* Left arrow */}
        <button
          onClick={() => scrollNav("left")}
          aria-label="Scroll tabs left"
          style={{
            flexShrink: 0, marginLeft: 8, width: 26, height: 26, borderRadius: "50%",
            background: "var(--beige-300)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "opacity 0.2s",
            opacity: canScrollLeft ? 1 : 0, pointerEvents: canScrollLeft ? "auto" : "none",
          }}
        >
          <ChevronLeft style={{ width: 13, height: 13, color: "var(--muted)" }} />
        </button>

        {/* Tab strip */}
        <div
          ref={scrollRef}
          className="scrollbar-hide"
          style={{ flex: 1, display: "flex", alignItems: "center", gap: 2, overflowX: "auto", padding: "7px 6px" }}
        >
          {visibleTabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeButtonRef : undefined}
                onClick={() => scrollTo(tab.id)}
                style={{
                  flexShrink: 0, padding: "5px 14px", borderRadius: 99, fontSize: 12,
                  fontWeight: 600, whiteSpace: "nowrap", border: "none", cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                  background: isActive ? "var(--dark)" : "transparent",
                  color: isActive ? "white" : "var(--muted)",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scrollNav("right")}
          aria-label="Scroll tabs right"
          style={{
            flexShrink: 0, marginRight: 8, width: 26, height: 26, borderRadius: "50%",
            background: "var(--beige-300)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "opacity 0.2s",
            opacity: canScrollRight ? 1 : 0, pointerEvents: canScrollRight ? "auto" : "none",
          }}
        >
          <ChevronRight style={{ width: 13, height: 13, color: "var(--muted)" }} />
        </button>
      </div>
    </div>
  );
}

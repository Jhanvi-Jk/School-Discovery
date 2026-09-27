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
  | "transport"
  | "results"
  | "admission"
  | "fees"
  | "sources";

// Order here MUST match the order of the <section id="section-…"> blocks in
// app/schools/[slug]/page.tsx — the scroll-spy walks this list top to bottom.
export const ALL_TABS: { id: TabId; label: string }[] = [
  { id: "photos",    label: "📷 Photos" },
  { id: "basic",     label: "Basic Details" },
  { id: "summary",   label: "Summary" },
  { id: "fees",      label: "Fees" },
  { id: "campus",    label: "Campus" },
  { id: "transport", label: "Transport" },
  { id: "results",   label: "Board Results" },
  { id: "peer",      label: "Peer Group" },
  { id: "unique",    label: "Unique Things" },
  { id: "admission", label: "Admission" },
  { id: "sentiment", label: "Sentiment Analysis" },
  { id: "feedback",  label: "Parent Feedback" },
  { id: "sources",   label: "Sources" },
];

interface Props {
  /** Tabs whose section is actually rendered; a tab with no section would never highlight. */
  availableTabs?: TabId[];
}

// Total sticky offset: 56px site-header + ~52px this tab bar + 8px breathing = 116px
const SCROLL_OFFSET = 116;

export function SchoolProfileTabs({ availableTabs }: Props) {
  const visibleTabs = availableTabs ? ALL_TABS.filter((t) => availableTabs.includes(t.id)) : ALL_TABS;
  const [active, setActive] = useState<TabId>(visibleTabs[0]?.id ?? ALL_TABS[0].id);
  // Set when a tab was clicked, so the smooth scroll that follows doesn't
  // flicker through every section it passes. Released by the next manual scroll.
  const lockedRef = useRef(false);
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

  // Scroll-spy: the active tab is the LAST section whose top has reached the sticky bars.
  // (The previous IntersectionObserver version only looked at the entries that changed in
  // each callback, so a section peeking in below the current one often won the highlight.)
  const tabKey = visibleTabs.map((t) => t.id).join(",");
  useEffect(() => {
    const ids = tabKey.split(",") as TabId[];
    let frame = 0;

    const compute = () => {
      frame = 0;
      if (lockedRef.current) return;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(`section-${id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= SCROLL_OFFSET + 12) current = id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(compute); };
    // Any manual scroll input hands control back to the spy
    const release = () => { lockedRef.current = false; };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", release);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", release);
    };
  }, [tabKey]);

  function scrollTo(id: TabId) {
    const el = document.getElementById(`section-${id}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    lockedRef.current = true;
    setActive(id);
    window.scrollTo({ top, behavior: "smooth" });
  }

  function scrollNav(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -180 : 180, behavior: "smooth" });
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 56,
        zIndex: 40,
        background: "var(--beige-200)",
        borderBottom: "1px solid var(--beige-500)",
        boxShadow: "0 1px 0 var(--beige-400)",
      }}
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

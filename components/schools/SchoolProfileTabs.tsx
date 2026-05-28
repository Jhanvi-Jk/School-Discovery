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
    // top-14 = 56px — sits directly below the sticky site header
    <div className="sticky top-14 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center">
        {/* Left scroll arrow */}
        <button
          onClick={() => scrollNav("left")}
          aria-label="Scroll tabs left"
          className={[
            "flex-shrink-0 ml-2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-opacity",
            canScrollLeft ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        {/* Scrollable tab row */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide px-2 py-2.5"
        >
          {visibleTabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeButtonRef : undefined}
                onClick={() => scrollTo(tab.id)}
                className={[
                  "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
                ].join(" ")}
                style={
                  isActive
                    ? { background: "linear-gradient(135deg, #E8524A 0%, #D14E7A 100%)" }
                    : {}
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right scroll arrow */}
        <button
          onClick={() => scrollNav("right")}
          aria-label="Scroll tabs right"
          className={[
            "flex-shrink-0 mr-2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-opacity",
            canScrollRight ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

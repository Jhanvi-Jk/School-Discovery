"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/store/filterStore";
import type { SortOption } from "@/lib/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Top rated" },
  { value: "fees_asc", label: "Fees: Low → High" },
  { value: "fees_desc", label: "Fees: High → Low" },
  { value: "newest", label: "Recently added" },
];

interface SortBarProps {
  totalCount: number;
}

export function SortBar({ totalCount }: SortBarProps) {
  const { sort, setSort, viewMode, setViewMode } = useFilterStore();

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <p className="text-sm text-gray-600 font-medium flex-shrink-0">
        <span className="text-gray-900 font-bold">{totalCount}</span> schools found
      </p>

      <div className="flex items-center gap-2">
        {/* Sort select */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* View toggle */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 transition-colors",
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:bg-gray-50"
            )}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 transition-colors",
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:bg-gray-50"
            )}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

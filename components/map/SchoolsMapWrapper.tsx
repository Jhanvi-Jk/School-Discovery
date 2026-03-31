"use client";

import dynamic from "next/dynamic";
import type { SchoolSummary } from "@/lib/types";

const SchoolsMapInner = dynamic(() => import("@/components/map/SchoolsMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#E8DDD0]">
      <div className="w-8 h-8 border-2 border-[#2C1810] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface Props {
  schools: SchoolSummary[];
}

export function SchoolsMapWrapper({ schools }: Props) {
  return <SchoolsMapInner schools={schools} />;
}

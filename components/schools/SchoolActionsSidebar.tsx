"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, GitCompare, Send, ExternalLink, BookmarkPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompareStore } from "@/store/compareStore";
import { EnquiryForm } from "./EnquiryForm";

interface Props {
  school: any;
}

export function SchoolActionsSidebar({ school }: Props) {
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [saved, setSaved] = useState(false);
  const { isInCompare, addSchool, removeSchool, canAdd } = useCompareStore();
  const inCompare = isInCompare(school.id);

  const openAdmission = (school.admission_windows || []).find(
    (a: any) => a.status === "open"
  );

  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      {/* CTA card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-1">{school.name}</h3>
        {openAdmission && (
          <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-lg mb-3 inline-block font-medium">
            ✓ Admissions currently open
          </div>
        )}

        <div className="space-y-2 mt-3">
          <button
            onClick={() => setShowEnquiry(true)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            Enquire Now
          </button>

          {openAdmission?.application_url && (
            <a
              href={openAdmission.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors"
            >
              Apply Online <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => setSaved(!saved)}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm border transition-colors",
              saved
                ? "bg-red-50 border-red-200 text-red-600"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            )}
          >
            <Heart className={cn("w-4 h-4", saved && "fill-current")} />
            {saved ? "Saved" : "Save School"}
          </button>

          <button
            onClick={() => inCompare ? removeSchool(school.id) : canAdd() && addSchool(school)}
            disabled={!inCompare && !canAdd()}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm border transition-colors",
              inCompare
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : canAdd()
                  ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            <GitCompare className="w-4 h-4" />
            {inCompare ? "Added to Compare" : canAdd() ? "Add to Compare" : "Compare full (3/3)"}
          </button>
        </div>
      </div>

      {/* Contact info card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 text-sm space-y-3">
        <h4 className="font-semibold text-gray-800">Contact</h4>
        {school.phone && (
          <a href={`tel:${school.phone}`} className="text-blue-600 hover:underline block">
            {school.phone}
          </a>
        )}
        {school.email && (
          <a href={`mailto:${school.email}`} className="text-blue-600 hover:underline block truncate">
            {school.email}
          </a>
        )}
        {school.address_line1 && (
          <p className="text-gray-600 text-xs leading-relaxed">
            {school.address_line1}
            {school.address_line2 && `, ${school.address_line2}`}
            <br />
            {school.area && `${school.area}, `}{school.city}
            {school.pincode && ` – ${school.pincode}`}
          </p>
        )}
      </div>

      {/* Data freshness */}
      {school.last_data_updated_at && (
        <p className="text-xs text-gray-400 text-center">
          Last updated:{" "}
          {new Date(school.last_data_updated_at).toLocaleDateString("en-IN", {
            year: "numeric", month: "short", day: "numeric"
          })}
        </p>
      )}

      {/* Enquiry modal */}
      {showEnquiry && (
        <EnquiryForm
          schoolSlug={school.slug}
          schoolName={school.name}
          onClose={() => setShowEnquiry(false)}
        />
      )}
    </div>
  );
}

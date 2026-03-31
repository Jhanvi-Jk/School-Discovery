import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Heart, Search, MapPin, Star } from "lucide-react";
import { formatFeesRange, formatRating } from "@/lib/utils";
import { CURRICULUM_LABELS } from "@/lib/types";

export default async function SavedSchoolsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: savedRows } = await supabase
    .from("saved_schools")
    .select(`
      saved_at,
      schools(
        id, slug, name, area, city, type, cover_image_url,
        school_details(total_fees_min, total_fees_max),
        school_curricula(curriculum)
      )
    `)
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false });

  const saved = (savedRows || []).map((r: any) => r.schools).filter(Boolean);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              <h1 className="text-xl font-bold text-gray-900">
                Saved Schools
                <span className="ml-2 text-base font-normal text-gray-500">({saved.length})</span>
              </h1>
            </div>
            <Link
              href="/schools"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              Find more
            </Link>
          </div>

          {saved.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-700 mb-2">No saved schools yet</h2>
              <p className="text-gray-500 text-sm mb-6">
                Save schools you&apos;re interested in to track them here.
              </p>
              <Link
                href="/schools"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <Search className="w-4 h-4" />
                Browse Schools
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {saved.map((school: any) => (
                <Link
                  key={school.id}
                  href={`/schools/${school.slug}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow group"
                >
                  <div className="relative h-36 bg-gray-100">
                    {school.cover_image_url ? (
                      <Image
                        src={school.cover_image_url}
                        alt={school.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <span className="text-3xl font-bold text-blue-200">{school.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {(school.school_curricula || []).map((c: any) => (
                        <span key={c.curriculum} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          {CURRICULUM_LABELS[c.curriculum as keyof typeof CURRICULUM_LABELS] || c.curriculum}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {school.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {school.area || school.city}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-2">
                      {formatFeesRange(school.school_details?.total_fees_min, school.school_details?.total_fees_max)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

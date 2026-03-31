import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Heart, BookOpen, Bell, Search, ChevronRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const [savedRes, applicationsRes] = await Promise.all([
    supabase.from("saved_schools").select("school_id").eq("user_id", user.id),
    supabase.from("applications").select("id, status").eq("user_id", user.id),
  ]);

  const savedCount = savedRes.data?.length || 0;
  const appCount = applicationsRes.data?.length || 0;

  const appsByStatus = (applicationsRes.data || []).reduce(
    (acc: Record<string, number>, a: any) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Hello, {firstName} 👋
            </h1>
            <p className="text-blue-200 text-sm">
              Your school discovery dashboard
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <Link href="/dashboard/saved" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{savedCount}</p>
              <p className="text-sm text-gray-500">Saved Schools</p>
            </Link>

            <Link href="/dashboard/applications" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{appCount}</p>
              <p className="text-sm text-gray-500">Applications</p>
            </Link>

            <Link href="/dashboard/alerts" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                  <Bell className="w-5 h-5 text-green-500" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Active Alerts</p>
            </Link>
          </div>

          {/* Application tracker summary */}
          {appCount > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
              <h2 className="font-bold text-gray-900 mb-4">Application Status</h2>
              <div className="flex flex-wrap gap-3">
                {Object.entries(appsByStatus).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-xs font-medium text-gray-600 capitalize">
                      {status}
                    </span>
                    <span className="text-xs font-bold text-gray-900 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
                      {count as number}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/schools"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100">
                  <Search className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Find Schools</p>
                  <p className="text-xs text-gray-500">Search and filter Bengaluru schools</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
              <Link
                href="/compare"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Compare Schools</p>
                  <p className="text-xs text-gray-500">Side-by-side comparison</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
              <Link
                href="/quiz"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100">
                  <Bell className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Get Personalised Matches</p>
                  <p className="text-xs text-gray-500">Take the 5-minute quiz</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

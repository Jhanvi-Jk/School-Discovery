import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapWrapper } from "@/components/map/MapWrapper";

const QUICK_AREAS = [
  "Whitefield", "Koramangala", "Indiranagar", "Jayanagar", "Hebbal",
  "Yelahanka", "Sarjapur", "Electronic City", "Malleswaram", "HSR Layout",
  "Marathahalli", "JP Nagar", "Rajajinagar", "Bannerghatta Road", "BTM Layout",
  "Sadashivanagar", "Vijayanagar", "Basavanagudi", "Nagarbhavi", "Kengeri",
];

export default function MapPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-5 h-5 text-[#1e3a5f]" />
                  <h1 className="text-2xl font-extrabold text-[#1e3a5f]">The Map</h1>
                </div>
                <p className="text-gray-500 text-sm">
                  Explore Bengaluru schools by neighbourhood — click any area to browse schools there.
                </p>
              </div>
              <Link
                href="/schools"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-xl text-sm font-semibold hover:bg-[#162d4a] transition-colors"
              >
                All Schools <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map — takes 3/4 width on desktop */}
            <div className="lg:col-span-3">
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                style={{ height: "600px" }}
              >
                <MapWrapper />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Click a coloured area to see schools in that neighbourhood
              </p>
            </div>

            {/* Area list sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1e3a5f]" />
                  Browse by Area
                </h2>
                <div className="space-y-0.5 max-h-[540px] overflow-y-auto pr-1">
                  {QUICK_AREAS.map((area) => (
                    <Link
                      key={area}
                      href={`/schools?area=${encodeURIComponent(area)}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1e3a5f] transition-colors group"
                    >
                      <span className="font-medium">{area}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1e3a5f] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

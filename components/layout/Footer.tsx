import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <GraduationCap className="w-6 h-6" />
              SchoolFinder
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Helping Bengaluru families find the right school — verified data, intuitive search.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/schools" className="hover:text-white transition-colors">Find Schools</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Compare Schools</Link></li>
              <li><Link href="/quiz" className="hover:text-white transition-colors">Get Matched</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">School Guides</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">For Schools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/schools/claim" className="hover:text-white transition-colors">Claim Your Profile</Link></li>
              <li><Link href="/manage/profile" className="hover:text-white transition-colors">School Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Curricula</h4>
            <ul className="space-y-2 text-sm">
              {["CBSE", "ICSE", "IB", "IGCSE", "State Board"].map((c) => (
                <li key={c}>
                  <Link
                    href={`/schools?curriculum=${c.toLowerCase()}`}
                    className="hover:text-white transition-colors"
                  >
                    {c} Schools
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SchoolFinder Bengaluru. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

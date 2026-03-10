import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#374151] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-lg font-bold">
              <span className="text-[#22c55e]">BuyAndScrap</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Honest cars for honest people. Find cheap, reliable cars with MOT
              — or sell yours for free. No commission, no middlemen.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-3">Browse</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/cars" className="hover:text-white transition-colors">Browse Cars</Link></li>
              <li><Link href="/sell" className="hover:text-white transition-colors">Sell Your Car</Link></li>
              <li><Link href="/mot-checker" className="hover:text-white transition-colors">MOT Checker</Link></li>
              <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-3">Trust</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>DVLA registered data</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free to list, no commission</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Honest sellers only</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-gray-500 text-xs">
          &copy; 2025 BuyAndScrap.com. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

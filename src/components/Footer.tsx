import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-brand-700">BrightPath Loans</p>
            <p className="mt-2 text-sm text-slate-500">
              Simple, transparent personal loans from $500 to $100,000. Apply online in minutes.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Company</p>
            <div className="mt-2 flex flex-col gap-2 text-sm text-slate-500">
              <Link href="/about" className="hover:text-brand-700">About</Link>
              <Link href="/contact" className="hover:text-brand-700">Contact</Link>
              <Link href="/calculator" className="hover:text-brand-700">Loan calculator</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Get started</p>
            <div className="mt-2 flex flex-col gap-2 text-sm text-slate-500">
              <Link href="/apply" className="hover:text-brand-700">Apply for a loan</Link>
              <Link href="/login" className="hover:text-brand-700">Log in</Link>
              <Link href="/register" className="hover:text-brand-700">Create an account</Link>
            </div>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-100 pt-6 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} BrightPath Loans. This is a demo application for educational purposes only,
          not a real lender.
        </p>
      </div>
    </footer>
  );
}

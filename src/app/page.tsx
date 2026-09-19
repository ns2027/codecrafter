import Link from "next/link";
import { LoanCalculator } from "@/components/LoanCalculator";

const features = [
  {
    title: "Fast decisions",
    description: "Get a rate estimate instantly and hear back on your application within one business day.",
    icon: "⚡",
  },
  {
    title: "Transparent pricing",
    description: "No hidden fees. See your exact monthly payment before you apply.",
    icon: "🔍",
  },
  {
    title: "Flexible terms",
    description: "Borrow from $500 to $100,000 with repayment terms from 6 to 84 months.",
    icon: "🧭",
  },
  {
    title: "Track everything",
    description: "A personal dashboard shows every application and its status in real time.",
    icon: "📊",
  },
];

const steps = [
  { title: "Check your rate", description: "Use the calculator to estimate your payment — it won't affect your credit." },
  { title: "Create an account", description: "Sign up in seconds so you can save and track your application." },
  { title: "Complete your application", description: "Tell us about your income and how much you'd like to borrow." },
  { title: "Get your decision", description: "Track the status of your loan from your personal dashboard." },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              Personal loans, done right
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Borrow with confidence. <span className="text-brand-700">No surprises.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              BrightPath Loans helps you cover life's big moments — from debt consolidation to home
              improvements — with clear rates and a fast, fully online application.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/apply" className="btn-primary text-base">
                Check your rate — it&apos;s free
              </Link>
              <Link href="/calculator" className="btn-secondary text-base">
                Estimate your payment
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-8 text-sm text-slate-500">
              <div><span className="font-bold text-slate-900">$500 – $100k</span> loan amounts</div>
              <div><span className="font-bold text-slate-900">6 – 84 mo</span> repayment terms</div>
              <div><span className="font-bold text-slate-900">24 hr</span> average decision time</div>
            </div>
          </div>
          <LoanCalculator />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900">Why borrowers choose us</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="card">
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold">How it works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold">
                  {index + 1}
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-slate-900">Ready to get started?</h2>
        <p className="mt-3 text-slate-600">
          Create a free account and submit your application in under five minutes.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/apply" className="btn-primary text-base">Apply now</Link>
          <Link href="/register" className="btn-secondary text-base">Create an account</Link>
        </div>
      </section>
    </div>
  );
}

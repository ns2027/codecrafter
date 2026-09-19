"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { calculateEmi, estimateInterestRate, formatCurrency } from "@/lib/loan";

const STEPS = ["Personal", "Employment", "Loan details", "Review"];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  employmentType: "SALARIED",
  employerName: "",
  monthlyIncome: "",
  loanAmount: "10000",
  loanPurpose: "",
  loanTermMonths: "36",
};

type FormState = typeof initialForm;

export default function ApplyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    ...initialForm,
    fullName: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (status === "loading") {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-slate-500">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-slate-900">Log in to apply</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create a free account or log in to start your loan application and track its status.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/register?callbackUrl=/apply" className="btn-primary">Create an account</Link>
            <Link href="/login?callbackUrl=/apply" className="btn-secondary">Log in</Link>
          </div>
        </div>
      </div>
    );
  }

  if (submittedId) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="card text-center">
          <p className="text-3xl">🎉</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Application submitted</h1>
          <p className="mt-2 text-sm text-slate-500">
            We&apos;ve received your application. You can track its status from your dashboard.
          </p>
          <Link href={`/dashboard/${submittedId}`} className="btn-primary mt-6">
            View application
          </Link>
        </div>
      </div>
    );
  }

  const monthlyIncome = Number(form.monthlyIncome) || 0;
  const loanAmount = Number(form.loanAmount) || 0;
  const loanTermMonths = Number(form.loanTermMonths) || 1;
  const estimatedRate = estimateInterestRate(monthlyIncome, loanAmount);
  const { monthlyPayment } = calculateEmi(loanAmount, estimatedRate, loanTermMonths);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          monthlyIncome: Number(form.monthlyIncome),
          loanAmount: Number(form.loanAmount),
          loanTermMonths: Number(form.loanTermMonths),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setSubmitting(false);
        return;
      }
      setSubmittedId(data.application.id);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  function goNext() {
    setError(null);
    if (step === 0 && (!form.fullName || !form.email || !form.phone || !form.dateOfBirth || !form.address)) {
      setError("Please fill in all fields before continuing.");
      return;
    }
    if (step === 1 && !form.monthlyIncome) {
      setError("Please enter your monthly income.");
      return;
    }
    if (step === 2 && (!form.loanAmount || !form.loanPurpose || !form.loanTermMonths)) {
      setError("Please complete the loan details.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Loan application</h1>
      <p className="mt-1 text-slate-600">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

      <div className="mt-4 flex gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-600" : "bg-slate-200"}`} />
        ))}
      </div>

      <div className="card mt-6">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Full name">
              <input className="input" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
            </Field>
            <Field label="Email">
              <input type="email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </Field>
            <Field label="Phone number">
              <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </Field>
            <Field label="Date of birth">
              <input type="date" className="input" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
            </Field>
            <Field label="Home address">
              <input className="input" value={form.address} onChange={(e) => update("address", e.target.value)} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Field label="Employment type">
              <select
                className="input"
                value={form.employmentType}
                onChange={(e) => update("employmentType", e.target.value)}
              >
                <option value="SALARIED">Salaried employee</option>
                <option value="SELF_EMPLOYED">Self-employed</option>
                <option value="BUSINESS_OWNER">Business owner</option>
                <option value="UNEMPLOYED">Currently unemployed</option>
              </select>
            </Field>
            <Field label="Employer name (optional)">
              <input className="input" value={form.employerName} onChange={(e) => update("employerName", e.target.value)} />
            </Field>
            <Field label="Gross monthly income ($)">
              <input
                type="number"
                min={0}
                className="input"
                value={form.monthlyIncome}
                onChange={(e) => update("monthlyIncome", e.target.value)}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Loan amount ($)">
              <input
                type="number"
                min={500}
                max={100000}
                className="input"
                value={form.loanAmount}
                onChange={(e) => update("loanAmount", e.target.value)}
              />
            </Field>
            <Field label="Loan term (months)">
              <select className="input" value={form.loanTermMonths} onChange={(e) => update("loanTermMonths", e.target.value)}>
                {[12, 24, 36, 48, 60, 72, 84].map((m) => (
                  <option key={m} value={m}>{m} months</option>
                ))}
              </select>
            </Field>
            <Field label="What is this loan for?">
              <input
                className="input"
                placeholder="e.g. Debt consolidation, home repair, medical expenses"
                value={form.loanPurpose}
                onChange={(e) => update("loanPurpose", e.target.value)}
              />
            </Field>

            {loanAmount > 0 && monthlyIncome > 0 && (
              <div className="rounded-xl bg-brand-50 p-4 text-sm">
                <p className="text-slate-600">Estimated rate: <span className="font-semibold text-brand-700">{estimatedRate}% APR</span></p>
                <p className="mt-1 text-slate-600">
                  Estimated monthly payment: <span className="font-semibold text-brand-700">{formatCurrency(monthlyPayment)}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <SummaryRow label="Full name" value={form.fullName} />
            <SummaryRow label="Email" value={form.email} />
            <SummaryRow label="Phone" value={form.phone} />
            <SummaryRow label="Date of birth" value={form.dateOfBirth} />
            <SummaryRow label="Address" value={form.address} />
            <SummaryRow label="Employment" value={form.employmentType.replace("_", " ")} />
            <SummaryRow label="Monthly income" value={formatCurrency(monthlyIncome)} />
            <SummaryRow label="Loan amount" value={formatCurrency(loanAmount)} />
            <SummaryRow label="Loan term" value={`${form.loanTermMonths} months`} />
            <SummaryRow label="Purpose" value={form.loanPurpose} />
            <hr className="border-slate-200" />
            <SummaryRow label="Estimated rate" value={`${estimatedRate}% APR`} />
            <SummaryRow label="Estimated monthly payment" value={formatCurrency(monthlyPayment)} strong />
          </div>
        )}

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        <div className="mt-8 flex justify-between">
          <button className="btn-secondary" onClick={goBack} disabled={step === 0}>
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={goNext}>Continue</button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={strong ? "font-bold text-brand-700" : "font-medium text-slate-900"}>{value}</span>
    </div>
  );
}

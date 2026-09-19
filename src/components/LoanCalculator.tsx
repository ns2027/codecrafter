"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateEmi, formatCurrency } from "@/lib/loan";

export function LoanCalculator({ showScheduleLink = true }: { showScheduleLink?: boolean }) {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(11.5);
  const [term, setTerm] = useState(36);

  const result = useMemo(() => calculateEmi(amount, rate, term), [amount, rate, term]);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900">Estimate your monthly payment</h3>
      <p className="mt-1 text-sm text-slate-500">Adjust the sliders to see how much a loan could cost you.</p>

      <div className="mt-6 space-y-6">
        <SliderField
          label="Loan amount"
          value={amount}
          onChange={setAmount}
          min={500}
          max={100000}
          step={500}
          format={(v) => formatCurrency(v)}
        />
        <SliderField
          label="Interest rate (APR)"
          value={rate}
          onChange={setRate}
          min={3}
          max={30}
          step={0.1}
          format={(v) => `${v.toFixed(1)}%`}
        />
        <SliderField
          label="Loan term"
          value={term}
          onChange={setTerm}
          min={6}
          max={84}
          step={1}
          format={(v) => `${v} months`}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl bg-brand-50 p-5 sm:grid-cols-3">
        <Stat label="Monthly payment" value={formatCurrency(result.monthlyPayment)} highlight />
        <Stat label="Total interest" value={formatCurrency(result.totalInterest)} />
        <Stat label="Total repayment" value={formatCurrency(result.totalPayment)} />
      </div>

      {showScheduleLink && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/apply" className="btn-primary">Apply for this loan</Link>
          <Link href="/calculator" className="btn-secondary">View full amortization schedule</Link>
        </div>
      )}
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-semibold text-brand-700">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600"
      />
    </div>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${highlight ? "text-brand-700" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}

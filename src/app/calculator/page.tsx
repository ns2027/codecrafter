"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildAmortizationSchedule, calculateEmi, formatCurrency } from "@/lib/loan";

export default function CalculatorPage() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(11.5);
  const [term, setTerm] = useState(36);
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo(() => calculateEmi(amount, rate, term), [amount, rate, term]);
  const schedule = useMemo(
    () => (showSchedule ? buildAmortizationSchedule(amount, rate, term) : []),
    [amount, rate, term, showSchedule]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Loan calculator</h1>
      <p className="mt-2 text-slate-600">
        Estimate your monthly payment and see a full amortization schedule before you apply.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <NumberField label="Loan amount ($)" value={amount} onChange={setAmount} min={500} max={100000} step={100} />
          <NumberField label="Interest rate (APR %)" value={rate} onChange={setRate} min={1} max={35} step={0.1} />
          <NumberField label="Loan term (months)" value={term} onChange={setTerm} min={6} max={84} step={1} />

          <div className="mt-6 space-y-3 rounded-xl bg-brand-50 p-4">
            <Row label="Monthly payment" value={formatCurrency(result.monthlyPayment)} strong />
            <Row label="Total interest" value={formatCurrency(result.totalInterest)} />
            <Row label="Total repayment" value={formatCurrency(result.totalPayment)} />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button className="btn-secondary" onClick={() => setShowSchedule((v) => !v)}>
              {showSchedule ? "Hide" : "Show"} amortization schedule
            </button>
            <Link href="/apply" className="btn-primary">Apply for this loan</Link>
          </div>
        </div>

        <div className="lg:col-span-2">
          {showSchedule ? (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-4">Month</th>
                    <th className="py-2 pr-4">Payment</th>
                    <th className="py-2 pr-4">Principal</th>
                    <th className="py-2 pr-4">Interest</th>
                    <th className="py-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.month} className="border-b border-slate-100 text-slate-700">
                      <td className="py-2 pr-4">{row.month}</td>
                      <td className="py-2 pr-4">{formatCurrency(row.payment)}</td>
                      <td className="py-2 pr-4">{formatCurrency(row.principalPaid)}</td>
                      <td className="py-2 pr-4">{formatCurrency(row.interestPaid)}</td>
                      <td className="py-2">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card flex h-full items-center justify-center text-center text-slate-500">
              Click &ldquo;Show amortization schedule&rdquo; to see a month-by-month breakdown of your payments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div className="mb-4">
      <label className="label">{label}</label>
      <input
        type="number"
        className="input"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={strong ? "text-lg font-bold text-brand-700" : "font-semibold text-slate-900"}>{value}</span>
    </div>
  );
}

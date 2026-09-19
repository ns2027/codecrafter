"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatCurrency } from "@/lib/loan";

// Placeholder-only demo data. This does not route to any real account and
// no request here ever leaves the browser or is verified server-side.
const DEMO_PAYEE_VPA = "demo-payee@upi";
const DEMO_PAYEE_NAME = "BrightPath Loans (Demo)";

export function UpiPaymentDemo({ applicationId, amount }: { applicationId: string; amount: number }) {
  const [paid, setPaid] = useState(false);
  const storageKey = `demo-emi-paid-${applicationId}`;

  useEffect(() => {
    try {
      setPaid(localStorage.getItem(storageKey) === "true");
    } catch {
      // localStorage unavailable (e.g. private browsing) — default to unpaid.
    }
  }, [storageKey]);

  const upiLink = `upi://pay?pa=${encodeURIComponent(DEMO_PAYEE_VPA)}&pn=${encodeURIComponent(
    DEMO_PAYEE_NAME
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Demo EMI for ${applicationId}`)}`;

  function markPaid() {
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      // ignore
    }
    setPaid(true);
  }

  function resetPaid() {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setPaid(false);
  }

  return (
    <div className="card">
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs font-medium text-amber-800">
        Demo only — this UPI ID and QR code are placeholder data. No real payment is sent, received, or
        verified by this app.
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">Pay this month&apos;s EMI</h3>
      <p className="mt-1 text-sm text-slate-500">Scan the demo QR code or use the UPI ID below.</p>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="rounded-xl border border-slate-200 p-3">
          <QRCodeSVG value={upiLink} size={160} />
        </div>

        <div className="flex-1 space-y-2 text-sm">
          <Row label="Amount" value={formatCurrency(amount)} />
          <Row label="Demo UPI ID" value={DEMO_PAYEE_VPA} />
          <Row label="Payee" value={DEMO_PAYEE_NAME} />

          {paid ? (
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Marked as paid (demo)
              </span>
              <button onClick={resetPaid} className="text-xs font-medium text-slate-500 underline">
                Reset
              </button>
            </div>
          ) : (
            <button onClick={markPaid} className="btn-primary mt-3">
              I&apos;ve completed this payment (demo)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

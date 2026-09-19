"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Contact us</h1>
      <p className="mt-2 text-slate-600">Have a question about your application or our loans? We&apos;re here to help.</p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold text-slate-900">Get in touch</h2>
          <dl className="mt-4 space-y-3 text-sm text-slate-600">
            <div>
              <dt className="font-medium text-slate-500">Email</dt>
              <dd>support@brightpathloans.example</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Phone</dt>
              <dd>1-800-555-0134</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Hours</dt>
              <dd>Monday–Friday, 8am–8pm ET</dd>
            </div>
          </dl>
        </div>

        <div className="card">
          {submitted ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-2xl">✅</p>
              <p className="mt-2 font-semibold text-slate-900">Message sent</p>
              <p className="mt-1 text-sm text-slate-500">Thanks for reaching out — we&apos;ll reply within one business day.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="label">Name</label>
                <input required className="input" type="text" name="name" />
              </div>
              <div>
                <label className="label">Email</label>
                <input required className="input" type="email" name="email" />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea required className="input" name="message" rows={4} />
              </div>
              <button type="submit" className="btn-primary w-full">Send message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

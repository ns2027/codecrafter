const values = [
  { title: "Transparency", description: "We show you your exact rate and payment before you ever apply." },
  { title: "Speed", description: "Applications are reviewed quickly so you're never left waiting." },
  { title: "Fairness", description: "We evaluate every application consistently, with clear criteria." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">About BrightPath Loans</h1>
      <p className="mt-4 text-slate-600">
        BrightPath Loans was built to make personal borrowing simple. Whether you&apos;re consolidating debt,
        covering an unexpected expense, or funding a home project, we believe getting a loan shouldn&apos;t
        require guesswork, paperwork, or a trip to a branch.
      </p>
      <p className="mt-4 text-slate-600">
        Our online platform lets you estimate your payment, submit an application, and track its status
        from any device — all in one place.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-slate-900">Our values</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="card">
            <h3 className="font-semibold text-slate-900">{value.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{value.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Note: BrightPath Loans is a demo application built for a coding exercise. It is not a real
        financial institution, and no real loans are issued.
      </div>
    </div>
  );
}

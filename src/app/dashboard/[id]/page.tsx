import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/loan";

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/dashboard/${params.id}`);
  }

  const application = await prisma.loanApplication.findUnique({ where: { id: params.id } });

  if (!application || application.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/dashboard" className="text-sm font-medium text-brand-700">&larr; Back to dashboard</Link>

      <div className="card mt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{formatCurrency(application.loanAmount)} loan</h1>
            <p className="mt-1 text-sm text-slate-500">Application ID: {application.id}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Section title="Loan details">
            <Detail label="Amount" value={formatCurrency(application.loanAmount)} />
            <Detail label="Term" value={`${application.loanTermMonths} months`} />
            <Detail label="Interest rate" value={`${application.interestRate}% APR`} />
            <Detail label="Monthly payment" value={formatCurrency(application.monthlyPayment)} />
            <Detail label="Purpose" value={application.loanPurpose} />
          </Section>

          <Section title="Applicant">
            <Detail label="Name" value={application.fullName} />
            <Detail label="Email" value={application.email} />
            <Detail label="Phone" value={application.phone} />
            <Detail label="Address" value={application.address} />
            <Detail label="Employment" value={application.employmentType.replace("_", " ")} />
            <Detail label="Monthly income" value={formatCurrency(application.monthlyIncome)} />
          </Section>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          Submitted on {application.createdAt.toLocaleString("en-US")}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <dl className="mt-3 space-y-2">{children}</dl>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium capitalize text-slate-900">{value}</dd>
    </div>
  );
}

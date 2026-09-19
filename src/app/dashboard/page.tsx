import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/loan";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const applications = await prisma.loanApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {session.user.name?.split(" ")[0]}</h1>
          <p className="mt-1 text-slate-600">Here&apos;s an overview of your loan applications.</p>
        </div>
        <Link href="/apply" className="btn-primary">New application</Link>
      </div>

      {applications.length === 0 ? (
        <div className="card mt-8 text-center">
          <p className="text-slate-600">You haven&apos;t submitted a loan application yet.</p>
          <Link href="/apply" className="btn-primary mt-4 inline-flex">Start an application</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/dashboard/${app.id}`}
              className="card flex flex-wrap items-center justify-between gap-4 transition hover:border-brand-300 hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-slate-900">{formatCurrency(app.loanAmount)} — {app.loanPurpose}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Submitted {app.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Est. monthly payment</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(app.monthlyPayment)}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

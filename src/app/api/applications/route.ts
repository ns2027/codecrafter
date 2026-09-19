import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validations";
import { calculateEmi, estimateInterestRate } from "@/lib/loan";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.loanApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const interestRate = estimateInterestRate(data.monthlyIncome, data.loanAmount);
  const { monthlyPayment } = calculateEmi(data.loanAmount, interestRate, data.loanTermMonths);

  const application = await prisma.loanApplication.create({
    data: {
      userId: session.user.id,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      employmentType: data.employmentType,
      employerName: data.employerName || null,
      monthlyIncome: data.monthlyIncome,
      loanAmount: data.loanAmount,
      loanPurpose: data.loanPurpose,
      loanTermMonths: data.loanTermMonths,
      interestRate,
      monthlyPayment,
    },
  });

  return NextResponse.json({ application }, { status: 201 });
}

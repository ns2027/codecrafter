export interface EmiResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

/** Standard reducing-balance EMI formula. */
export function calculateEmi(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): EmiResult {
  if (principal <= 0 || termMonths <= 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
  }

  const monthlyRate = annualRatePercent / 100 / 12;

  const monthlyPayment =
    monthlyRate === 0
      ? principal / termMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment: round2(monthlyPayment),
    totalPayment: round2(totalPayment),
    totalInterest: round2(totalInterest),
  };
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
}

export function buildAmortizationSchedule(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): AmortizationRow[] {
  const monthlyRate = annualRatePercent / 100 / 12;
  const { monthlyPayment } = calculateEmi(principal, annualRatePercent, termMonths);

  let balance = principal;
  const rows: AmortizationRow[] = [];

  for (let month = 1; month <= termMonths; month++) {
    const interestPaid = balance * monthlyRate;
    let principalPaid = monthlyPayment - interestPaid;
    if (month === termMonths) {
      principalPaid = balance;
    }
    balance = Math.max(0, balance - principalPaid);

    rows.push({
      month,
      payment: round2(month === termMonths ? principalPaid + interestPaid : monthlyPayment),
      principalPaid: round2(principalPaid),
      interestPaid: round2(interestPaid),
      balance: round2(balance),
    });
  }

  return rows;
}

/** Simple risk-based interest rate estimate used across the app. */
export function estimateInterestRate(monthlyIncome: number, loanAmount: number): number {
  const ratio = loanAmount / Math.max(monthlyIncome, 1);
  if (ratio < 5) return 8.5;
  if (ratio < 10) return 11.5;
  if (ratio < 20) return 15;
  return 19.5;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

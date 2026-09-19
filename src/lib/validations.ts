import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(7, "Enter a valid phone number").optional().or(z.literal("")),
});

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  employmentType: z.enum(["SALARIED", "SELF_EMPLOYED", "BUSINESS_OWNER", "UNEMPLOYED"]),
  employerName: z.string().optional().or(z.literal("")),
  monthlyIncome: z.coerce.number().positive("Monthly income must be greater than 0"),
  loanAmount: z.coerce.number().min(500, "Minimum loan amount is $500").max(100000, "Maximum loan amount is $100,000"),
  loanPurpose: z.string().min(3, "Tell us what the loan is for"),
  loanTermMonths: z.coerce.number().int().min(6).max(84),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;

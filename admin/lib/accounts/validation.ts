import { z } from "zod";

export const AccountSchema = z.object({
  subject: z.string().trim().min(3, "Enter an identity subject.").max(200).regex(
    /^[A-Za-z0-9][A-Za-z0-9:._@/-]*$/,
    "Use letters, numbers, and standard identity separators only.",
  ),
  displayName: z.string().trim().min(2, "Enter a display name.").max(120),
  email: z.union([z.literal(""), z.email("Enter a valid email address.")]),
  role: z.enum(["super_admin", "admin", "user"]),
  active: z.boolean(),
});

export type AccountFormValues = z.infer<typeof AccountSchema>;
export type AccountFormState = {
  status: "idle" | "error";
  message?: string;
  errors?: Partial<Record<keyof AccountFormValues, string[]>>;
};

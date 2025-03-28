import z from "zod";

export const EmailSchema = z.string().email("Invalid Email format");

const PasswordSchema = z
  .string()
  .min(8, { message: "Be at least 8 characters long" })
  .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
  .regex(/[0-9]/, { message: "Contain at least one number." })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Contain at least one special character.",
  })
  .trim();

export const SignupSchema = z.object({
  name: z.string(),
  email: EmailSchema,
  avatarUrl: z.string().optional(),
  password: PasswordSchema,
});

export const SigninSchema = z.object({
  email: EmailSchema.optional(),
  password: PasswordSchema,
});

export const ApiKeyName = z.object({
  name: z.string(),
});

export const ParamsSchema = z.object({
  id: z.string().uuid(),
});

export const SendEmailSchema = z.object({
  from: z.string(),
  to: z.array(z.string()) ,
  subject: z.string(),
  html: z.string().optional(),
});
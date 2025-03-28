import { z } from "zod";

const EmailSchema = z
  .string()
  .email({ message: "Please enter a valid email." })
  .trim();

const PasswordSchema = z
  .string()
  .min(8, { message: "Be at least 8 characters long" })
  .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
  .regex(/[0-9]/, { message: "Contain at least one number." })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Contain at least one special character.",
  })
  .trim();

export const SigninFormSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const SignupFormSchema = z.object({
  name : z.string(),
  email: EmailSchema,
  password: PasswordSchema,
});

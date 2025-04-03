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
  email: EmailSchema,
  password: PasswordSchema,
});

export const ApiKeyName = z.object({
  name: z.string().trim().nonempty("Field cannot be empty"),
});

export const ParamsSchema = z.object({
  id: z.string().uuid(),
});

export const SendEmailSchema = z.object({
  from: z.string().trim(),
  to: z.array(z.string()) ,
  subject: z.string(),
  html: z.string().optional(),
});

export const SubmitFeedbackSchema = z.object({
  comment : z.string().trim().nonempty("Comment can not be empty")
});

export const UpdateUserDetailsSchema =  z.object({
  name : z.string().optional(),
  email : EmailSchema.optional(),
}).refine((data) => data.email || data.name , {
  message : "At least one of name or email must be provided."
});

export const SendSMSSchema = z.object({
  phoneNumber : z.string(),
  message : z.string()
})
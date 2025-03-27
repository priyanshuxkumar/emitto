import z from 'zod'

export const EmailSchema = z.string().email('Invalid Email format'); 
export const PasswordSchema = z.string().min(8, { message: 'Enter minimum 8 characters password' });
export const UsernameSchema = z.string()

export const SignupSchema = z.object({
    name: z.string(),
    username: UsernameSchema,
    email : EmailSchema,
    avatarUrl: z.string().optional(),
    password: PasswordSchema,
});

export const SigninSchema = z.object({
    email: EmailSchema.optional(),
    username : UsernameSchema.optional(),
    password: PasswordSchema,
}).refine(data => data.email || data.username, {
    message : "Either email or username must be provided",
    path: ["email", "username"]
});

export const ApiKeyName = z.object({
    name : z.string()
});

export const ParamsSchema = z.object({
    id: z.string().uuid()
});

export const SendEmailSchema = z.object({
    toEmail : z.string(),
    body : z.object({
        recipientFirstname : z.string(),
        recipientLastname : z.string().optional(),
        subject : z.string(),
        message : z.string()
    })
})
import z from 'zod'

export const EmailSchema = z.string().email('Invalid Email format'); 
export const PasswordSchema = z.string().min(8, { message: 'Enter minimum 8 characters password' });

export const SignupSchema = z.object({
    name: z.string(),
    username: z.string({message: 'Enter valid username'}),
    email : EmailSchema,
    password: PasswordSchema,
});

export const SigninSchema = z.object({
    email: EmailSchema ,
    password: PasswordSchema,
});

export const ApiKeyName = z.object({
    name : z.string()
});

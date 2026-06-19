import { z } from "zod";

export const SuccessResponseSchema = z.object({
    message: z.string(),
});
export const ErrorResponseSchema = z.object({
    message: z.array(z.string()),
    statusCode: z.number(),
});

export const DraftLogInSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string('Password inválido').min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const UserAPIResponseSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    role: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const LogInResponseSchema = z.object({
    user: UserAPIResponseSchema,
    token: z.string(),
});

export type LogInFormData = z.infer<typeof DraftLogInSchema>;
export type User = z.infer<typeof UserAPIResponseSchema>;
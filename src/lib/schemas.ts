import { z } from 'zod';

export const loginSchema = z.object({
    display_name: z.string().min(2, 'Ingresa tu nombre'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const signupSchema = z.object({
    display_name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(20, 'Máximo 20 caracteres')
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/,
            'Solo letras, sin espacios ni números'
        ),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const forgotPasswordSchema = z.object({
    display_name: z.string().min(2, 'Ingresa tu nombre'),
    token: z.string().min(4, 'Ingresa el token recibido'),
    new_password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const predictionSchema = z.object({
    home_score: z.coerce.number().int().min(0, 'Mínimo 0').max(99),
    away_score: z.coerce.number().int().min(0, 'Mínimo 0').max(99),
    winner_team: z.string().nullable().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type PredictionInput = z.infer<typeof predictionSchema>;
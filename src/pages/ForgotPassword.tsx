import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { forgotPasswordSchema, type ForgotPasswordInput } from '../lib/schemas';
import { slugifyUsername } from '../lib/slug';
import { FormInput } from '../components/FormInput';
import  mundialLogo from '../assets/splash-icon.png';

export function ForgotPassword() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (values: ForgotPasswordInput) => {
        setServerError(null);
        setSubmitting(true);

        const username = slugifyUsername(values.display_name);

        const { data, error } = await supabase.functions.invoke('apply-password-reset', {
            body: {
                username,
                token: values.token.toUpperCase().trim(),
                new_password: values.new_password,
            },
        });

        setSubmitting(false);

        if (error) {
            try {
                const errorBody = await error.context?.json?.();
                setServerError(errorBody?.error || 'Error al cambiar la contraseña');
            } catch {
                setServerError('Error al cambiar la contraseña');
            }
            return;
        }

        if (data?.success) {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-500 to-orange-700 grid grid-cols-1 md:grid-cols-[3fr_1fr] items-center justify-center px-0">
            <div className='hidden md:flex items-center justify-center w-full h-full bg-red-950 order-2'>
                <img src={mundialLogo} alt="Mundial VCM" className="max-w-sm mx-auto mb-4" />
            </div>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
                    Recuperar contraseña
                </h1>
                <p className="text-center text-slate-600 mb-6 text-sm">
                    Ingresa tu nombre y el token que te enviaron por WhatsApp.
                </p>

                {success ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <p className="text-green-700 text-center">
                            ¡Contraseña cambiada! Redirigiendo al login...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormInput
                            label="Tu nombre"
                            register={register('display_name')}
                            error={errors.display_name?.message}
                        />

                        <FormInput
                            label="Token"
                            register={register('token')}
                            error={errors.token?.message}
                            placeholder="Ej: A1B2C3D4"
                        />

                        <FormInput
                            label="Nueva contraseña"
                            type="password"
                            register={register('new_password')}
                            error={errors.new_password?.message}
                        />

                        {serverError && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-700">{serverError}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-md transition disabled:opacity-50"
                        >
                            {submitting ? 'Cambiando...' : 'Cambiar contraseña'}
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm">
                    <Link to="/login" className="text-orange-600 hover:underline">
                        ← Volver al login
                    </Link>
                </p>
            </div>
        </div>
    );
}
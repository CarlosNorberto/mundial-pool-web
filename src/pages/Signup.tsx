import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { signupSchema, type SignupInput } from '../lib/schemas';
import { slugifyUsername } from '../lib/slug';
import { translateAuthError } from '../lib/auth-errors';
import { FormInput } from '../components/FormInput';

export function Signup() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (values: SignupInput) => {
        setServerError(null);
        setSubmitting(true);

        const slug = slugifyUsername(values.display_name);
        const email = `${slug}@mundialpool.local`;

        const { error } = await supabase.auth.signUp({
            email,
            password: values.password,
            options: {
                data: {
                    display_name: values.display_name.trim(),
                },
            },
        });

        setSubmitting(false);

        if (error) {
            setServerError(translateAuthError(error.message));
            return;
        }

        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">Crear cuenta</h1>
                <p className="text-center text-slate-600 mb-6">Unite al pool</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormInput
                        label="Tu nombre"
                        register={register('display_name')}
                        error={errors.display_name?.message}
                        hint="Una sola palabra, sin espacios ni números"
                        placeholder="ej: Carlos"
                    />

                    <FormInput
                        label="Contraseña"
                        type="password"
                        register={register('password')}
                        error={errors.password?.message}
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
                        {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    ¿Ya tenés cuenta?{' '}
                    <Link to="/login" className="text-orange-600 hover:underline font-medium">
                        Ingresar
                    </Link>
                </p>
            </div>
        </div>
    );
}
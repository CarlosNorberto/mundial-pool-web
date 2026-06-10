import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { loginSchema, type LoginInput } from '../lib/schemas';
import { slugifyUsername } from '../lib/slug';
import { translateAuthError } from '../lib/auth-errors';
import { FormInput } from '../components/FormInput';
import  mundialLogo from '../assets/splash-icon.png';

export function Login() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (values: LoginInput) => {
        setServerError(null);
        setSubmitting(true);

        const email = `${slugifyUsername(values.display_name)}@mundialpool.local`;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: values.password,
        });

        setSubmitting(false);

        if (error) {
            setServerError(translateAuthError(error.message));
            return;
        }

        navigate('/');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-500 to-orange-700 grid grid-cols-1 md:grid-cols-[3fr_1fr] items-center justify-center px-0">
            <div className='hidden md:flex items-center justify-center w-full h-full bg-red-950 order-2'>
                <img src={mundialLogo} alt="Mundial VCM" className="max-w-sm mx-auto mb-4" />
            </div>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-2 flex flex-col items-center justify-center">
                    <span>Mundial</span>
                    <span>Versatil - C&amp;M</span>
                </h1>
                <p className="text-center text-slate-600 mb-6">Predice. Gana. Celebra.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormInput
                        label="Tu nombre"
                        register={register('display_name')}
                        error={errors.display_name?.message}
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
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-md transition disabled:opacity-50 cursor-pointer"
                    >
                        {submitting ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm space-y-2">
                    <Link to="/forgot-password" className="text-orange-600 hover:underline block">
                        ¿Olvidaste tu contraseña?
                    </Link>
                    <p className="text-slate-600">
                        ¿No tenés cuenta?{' '}
                        <Link to="/signup" className="text-orange-600 hover:underline font-medium">
                            Registrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
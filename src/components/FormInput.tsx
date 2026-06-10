import type { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
    label: string;
    type?: string;
    register: UseFormRegisterReturn;
    error?: string;
    hint?: string;
    placeholder?: string;
};

export function FormInput({ label, type = 'text', register, error, hint, placeholder }: Props) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                {...register}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${error
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:ring-orange-200 focus:border-orange-400'
                    }`}
            />
            {hint && !error && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}
export function translateAuthError(message: string): string {
    const errorMap: Record<string, string> = {
        'Invalid login credentials': 'Nombre o contraseña incorrectos',
        'User already registered': 'Ese nombre ya está tomado, elige otro',
        'Email not confirmed': 'Email no confirmado',
        'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
        'Anonymous sign-ins are disabled': 'Inicio de sesión anónimo deshabilitado',
    };

    return errorMap[message] || message;
}
import { Navigate, Outlet } from 'react-router-dom';
import { useSessionStore } from '../lib/store/session';

export function ProtectedRoute() {
    const session = useSessionStore((s) => s.session);
    const isLoading = useSessionStore((s) => s.isLoading);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-slate-600">Cargando...</div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
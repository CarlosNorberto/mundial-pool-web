import { useState } from 'react';
import { useMyProfile } from '../lib/queries/profile';
import { useLeaderboard } from '../lib/queries/leaderboard';
import { useSessionStore } from '../lib/store/session';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function Profile() {
    const navigate = useNavigate();
    const session = useSessionStore((s) => s.session);
    const { data: profile, isLoading } = useMyProfile();
    const { data: leaderboard } = useLeaderboard();
    const [loggingOut, setLoggingOut] = useState(false);

    const myStats = leaderboard?.find((e) => e.user_id === session?.user.id);

    const handleLogout = async () => {
        setLoggingOut(true);
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (isLoading) {
        return <div className="text-center py-12 text-slate-600">Cargando...</div>;
    }

    return (
        <div className="space-y-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800">Perfil</h1>

            {/* Info del usuario */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-orange-100 mx-auto flex items-center justify-center mb-3">
                    <span className="text-3xl font-bold text-orange-700">
                        {profile?.display_name?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <h2 className="text-xl font-bold text-slate-800">{profile?.display_name}</h2>
                <p className="text-sm text-slate-500">@{profile?.username}</p>
            </div>

            {/* Estadísticas */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Tus estadísticas</h2>
                <div className="space-y-3">
                    <StatRow label="Puntos totales" value={myStats?.total_points ?? 0} />
                    <StatRow label="Marcadores exactos" value={myStats?.exact_matches ?? 0} />
                    <StatRow label="Aciertos totales" value={myStats?.exact_predictions ?? 0} />
                    <StatRow label="Predicciones hechas" value={myStats?.total_predictions ?? 0} />
                </div>
            </div>

            {/* Cerrar sesión */}
            <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-medium disabled:opacity-50"
            >
                {loggingOut ? 'Saliendo...' : 'Cerrar sesión'}
            </button>
        </div>
    );
}

function StatRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-600">{label}</span>
            <span className="font-bold text-slate-800">{value}</span>
        </div>
    );
}
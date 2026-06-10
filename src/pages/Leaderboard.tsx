import { useLeaderboard } from '../lib/queries/leaderboard';
import { useSessionStore } from '../lib/store/session';

export function Leaderboard() {
    const { data: leaderboard, isLoading, refetch, isRefetching } = useLeaderboard();
    const session = useSessionStore((s) => s.session);
    const currentUserId = session?.user.id;

    if (isLoading) {
        return <div className="text-center py-12 text-slate-600">Cargando posiciones...</div>;
    }

    return (
        <div className="space-y-4 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Posiciones</h1>
                    <p className="text-sm text-slate-600">Tabla de líderes del pool</p>
                </div>
                <button
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-medium disabled:opacity-50"
                >
                    {isRefetching ? '⟳ Actualizando...' : '⟳ Actualizar'}
                </button>
            </div>

            {/* Lista de posiciones */}
            <div className="space-y-2">
                {!leaderboard || leaderboard.length === 0 ? (
                    <p className="text-center text-slate-500 py-12 bg-white rounded-lg border border-slate-200">
                        Aún no hay jugadores en el ranking.
                    </p>
                ) : (
                    leaderboard.map((entry, idx) => {
                        const isMe = entry.user_id === currentUserId;
                        const position = idx + 1;

                        const positionIcon = () => {
                            if (position === 1) return '🏆';
                            if (position === 2) return '🥈';
                            if (position === 3) return '🥉';
                            return position;
                        };

                        const positionBorder = () => {
                            if (isMe) return 'border-orange-400 border-2';
                            if (position === 1) return 'border-yellow-400 border-2';
                            if (position === 2) return 'border-slate-400 border-2';
                            if (position === 3) return 'border-amber-600 border-2';
                            return 'border-slate-200';
                        };

                        return (
                            <div
                                key={entry.user_id}
                                className={`flex items-center bg-white rounded-lg p-4 border ${positionBorder()}`}
                            >
                                {/* Posición */}
                                <div className="w-10 text-center font-bold text-lg mr-3">
                                    {typeof positionIcon() === 'string' ? (
                                        <span className="text-2xl">{positionIcon()}</span>
                                    ) : (
                                        <span className="text-slate-600">{positionIcon()}</span>
                                    )}
                                </div>

                                {/* Nombre + stats */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-slate-800 truncate">
                                            {entry.display_name}
                                        </p>
                                        {isMe && (
                                            <span className="text-orange-500 text-xs font-bold bg-orange-50 px-1.5 py-0.5 rounded">
                                                Tú
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {entry.exact_matches} exactos · {entry.exact_predictions} aciertos
                                    </p>
                                </div>

                                {/* Puntos */}
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-orange-500">{entry.total_points}</p>
                                    <p className="text-xs text-slate-500">pts</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
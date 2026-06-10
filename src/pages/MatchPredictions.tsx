import { Link, useParams } from 'react-router-dom';
import { useMatch } from '../lib/queries/matches';
import { useMatchPredictions } from '../lib/queries/predictions';
import { useSessionStore } from '../lib/store/session';
import { formatKickoff } from '../lib/utils/match';

export function MatchPredictions() {
    const { id } = useParams<{ id: string }>();
    const session = useSessionStore((s) => s.session);
    const currentUserId = session?.user.id;

    const { data: match, isLoading: matchLoading } = useMatch(id ?? '');
    const {
        data: predictions,
        isLoading: predictionsLoading,
        refetch,
        isRefetching,
    } = useMatchPredictions(id ?? '');

    if (matchLoading || predictionsLoading) {
        return (
            <div className="text-center py-12 text-slate-600">Cargando pronósticos...</div>
        );
    }

    if (!match) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600 mb-4">Partido no encontrado</p>
                <Link to="/" className="text-orange-600 hover:underline">
                    ← Volver a partidos
                </Link>
            </div>
        );
    }

    const hasResult = match.status === 'finished' && match.home_score !== null;

    return (
        <div className="space-y-4 max-w-3xl mx-auto">
            {/* Header con botón volver + refresh */}
            <div className="flex justify-between items-center">
                <Link
                    to="/"
                    className="text-orange-600 hover:underline font-medium text-sm"
                >
                    ← Volver a partidos
                </Link>

                <button
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-medium disabled:opacity-50"
                >
                    {isRefetching ? '⟳ Actualizando...' : '⟳ Actualizar'}
                </button>
            </div>

            {/* Resumen del partido */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                <p className="text-center text-xs text-slate-500 mb-3">
                    {formatKickoff(match.kickoff_at)}
                    {match.group_name && (
                        <span className="ml-2 font-semibold text-orange-600">Grupo {match.group_name}</span>
                    )}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                        <p className="font-bold text-slate-800 text-lg">{match.home_team}</p>
                    </div>

                    <div className="px-4">
                        {hasResult ? (
                            <div className="flex items-center text-3xl font-bold text-slate-800">
                                <span>{match.home_score}</span>
                                <span className="mx-2 text-slate-400">-</span>
                                <span>{match.away_score}</span>
                            </div>
                        ) : (
                            <span className="text-slate-400 text-xl font-bold">vs</span>
                        )}
                    </div>

                    <div className="flex-1 text-center">
                        <p className="font-bold text-slate-800 text-lg">{match.away_team}</p>
                    </div>
                </div>

                {match.winner_team && hasResult && (
                    <p className="text-center text-sm text-slate-600 italic mt-3">
                        Pasó: {match.winner_team}
                    </p>
                )}
            </div>

            {/* Título de la sección */}
            <h2 className="text-lg font-bold text-slate-800 mt-6">
                Pronósticos ({predictions?.length ?? 0})
            </h2>

            {/* Lista de pronósticos */}
            <div className="space-y-2">
                {!predictions || predictions.length === 0 ? (
                    <p className="text-center text-slate-500 py-12 bg-white rounded-lg border border-slate-200">
                        Nadie pronosticó este partido.
                    </p>
                ) : (
                    predictions.map((item) => {
                        const isMe = item.user_id === currentUserId;
                        const showPoints = match.status === 'finished' && item.points !== null;

                        return (
                            <div
                                key={item.user_id}
                                className={`flex items-center bg-white rounded-lg p-3 border ${isMe ? 'border-orange-400 border-2' : 'border-slate-200'
                                    }`}
                            >
                                {/* Avatar con inicial */}
                                <div className="w-10 h-10 rounded-full bg-orange-100 mr-3 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-orange-700">
                                        {item.profiles.display_name.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                {/* Nombre + badge "Tú" */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-slate-800 truncate">
                                            {item.profiles.display_name}
                                        </p>
                                        {isMe && (
                                            <span className="text-orange-500 text-xs font-bold bg-orange-50 px-1.5 py-0.5 rounded">
                                                Tú
                                            </span>
                                        )}
                                    </div>
                                    {item.winner_team && (
                                        <p className="text-xs text-slate-500 italic">
                                            Pasa: {item.winner_team}
                                        </p>
                                    )}
                                </div>

                                {/* Pronóstico */}
                                <div className="flex items-center mr-3">
                                    <span className="text-xl font-bold text-slate-800">
                                        {item.home_score}
                                    </span>
                                    <span className="mx-1.5 text-slate-400">-</span>
                                    <span className="text-xl font-bold text-slate-800">
                                        {item.away_score}
                                    </span>
                                </div>

                                {/* Puntos */}
                                {showPoints && (
                                    <div
                                        className={`px-2 py-1 rounded font-bold text-xs ${item.points! > 0
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {item.points} pts
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
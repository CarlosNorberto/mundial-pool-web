import { Link } from 'react-router-dom';
import type { Match, Prediction } from '../lib/types';
import { formatKickoff, isMatchLocked } from '../lib/utils/match';
import { PredictionForm } from './PredictionForm';
import { Flag } from './Flag';

type Props = {
    match: Match;
    prediction?: Prediction;
};

export function MatchCard({ match, prediction }: Props) {
    const hasResult = match.status === 'finished' && match.home_score !== null;
    const locked = isMatchLocked(match.kickoff_at);

    const statusBadge = () => {
        if (match.status === 'finished') {
            return <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">Terminado</span>;
        }
        if (locked) {
            return <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">Cerrado</span>;
        }
        return <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">Abierto</span>;
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            {/* Fecha + grupo */}
            <div className="text-center text-xs text-slate-500 mb-3">
                {formatKickoff(match.kickoff_at)}
                {match.group_name && (
                    <span className="ml-2 font-semibold text-orange-600">Grupo {match.group_name}</span>
                )}
            </div>

            {/* Equipos + Resultado */}
            <div className="flex items-center justify-between">
                {/* Local */}
                <div className="flex-1 flex flex-col items-center gap-2">
                    <Flag team={match.home_team} size={40} />
                    <p className="font-bold text-slate-800 text-sm text-center">{match.home_team}</p>
                </div>

                <div className="px-4">
                    {hasResult ? (
                        <div className="flex items-center text-2xl font-bold text-slate-800">
                            <span>{match.home_score}</span>
                            <span className="mx-2 text-slate-400">-</span>
                            <span>{match.away_score}</span>
                        </div>
                    ) : (
                        <span className="text-slate-400 text-lg font-bold">vs</span>
                    )}
                </div>

                {/* Visitante */}
                <div className="flex-1 flex flex-col items-center gap-2">
                    <Flag team={match.away_team} size={40} />
                    <p className="font-bold text-slate-800 text-sm text-center">{match.away_team}</p>
                </div>
            </div>

            {/* Winner team si aplica */}
            {match.winner_team && hasResult && (
                <p className="text-center text-xs text-slate-600 italic mt-2">
                    Pasó: {match.winner_team}
                </p>
            )}

            {/* Pronóstico: form si está abierto, read-only si está cerrado/terminado */}
            {locked ? (
                prediction ? (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Tu pronóstico:</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">
                                <span className="font-semibold">{prediction.home_score}</span>
                                {' - '}
                                <span className="font-semibold">{prediction.away_score}</span>
                                {prediction.winner_team && (
                                    <span className="text-slate-500 italic ml-2">
                                        (pasa: {prediction.winner_team})
                                    </span>
                                )}
                            </span>
                            {prediction.points !== null && match.status === 'finished' && (
                                <span className={`text-xs font-bold px-2 py-1 rounded ${prediction.points > 0 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {prediction.points} pts
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 italic">No pronosticaste este partido</p>
                    </div>
                )
            ) : (
                <PredictionForm match={match} prediction={prediction} />
            )}

            {/* Footer: ver pronósticos + estado */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                {locked ? (
                    <Link
                        to={`/match/${match.id}/predictions`}
                        className="text-xs text-orange-600 hover:underline font-medium"
                    >
                        👥 Ver pronósticos
                    </Link>
                ) : (
                    <span className="text-xs text-slate-400">
                        👥 Ver pronósticos (al cerrar el partido)
                    </span>
                )}

                {statusBadge()}
            </div>
        </div>
    );
}
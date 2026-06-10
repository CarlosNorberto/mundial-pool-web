import { useEffect, useState } from 'react';
import type { Match, Prediction } from '../lib/types';
import { useUpsertPrediction } from '../lib/queries/predictions';

type Props = {
    match: Match;
    prediction?: Prediction;
};

export function PredictionForm({ match, prediction }: Props) {
    const [homeScore, setHomeScore] = useState<string>(
        prediction?.home_score?.toString() ?? ''
    );
    const [awayScore, setAwayScore] = useState<string>(
        prediction?.away_score?.toString() ?? ''
    );
    const [winnerTeam, setWinnerTeam] = useState<string | null>(
        prediction?.winner_team ?? null
    );
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const upsert = useUpsertPrediction();

    // Sincronizar cuando llega el pronóstico desde el server
    useEffect(() => {
        if (prediction) {
            setHomeScore(prediction.home_score.toString());
            setAwayScore(prediction.away_score.toString());
            setWinnerTeam(prediction.winner_team);
        }
    }, [prediction]);

    // Si cambia a no-empate, limpiar winner_team
    useEffect(() => {
        if (homeScore !== awayScore) {
            setWinnerTeam(null);
        }
    }, [homeScore, awayScore]);

    const isKnockoutTie =
        match.stage !== 'group' &&
        homeScore !== '' &&
        awayScore !== '' &&
        homeScore === awayScore;

    const canSubmit =
        homeScore !== '' &&
        awayScore !== '' &&
        Number(homeScore) >= 0 &&
        Number(awayScore) >= 0 &&
        (!isKnockoutTie || winnerTeam !== null);

    const handleSubmit = async () => {
        setFeedback(null);

        try {
            await upsert.mutateAsync({
                matchId: match.id,
                homeScore: Number(homeScore),
                awayScore: Number(awayScore),
                winnerTeam: isKnockoutTie ? winnerTeam : null,
            });
            setFeedback({ type: 'success', msg: '✓ Guardado' });
            setTimeout(() => setFeedback(null), 2500);
        } catch (err: any) {
            setFeedback({
                type: 'error',
                msg: err?.message || 'Error al guardar',
            });
        }
    };

    return (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
            <p className="text-xs text-slate-500 font-medium">Tu pronóstico:</p>

            {/* Inputs de score */}
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <label className="block text-xs text-slate-600 mb-1 truncate">
                        {match.home_team}
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={99}
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-center font-bold focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    />
                </div>

                <span className="text-slate-400 font-bold pt-5">-</span>

                <div className="flex-1">
                    <label className="block text-xs text-slate-600 mb-1 truncate">
                        {match.away_team}
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={99}
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-center font-bold focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    />
                </div>
            </div>

            {/* Selector "Quién pasa" en eliminatorias con empate */}
            {isKnockoutTie && (
                <div>
                    <label className="block text-xs text-slate-600 mb-1">¿Quién pasa?</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setWinnerTeam(match.home_team)}
                            className={`px-3 py-1.5 rounded text-sm font-medium border ${winnerTeam === match.home_team
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            {match.home_team}
                        </button>
                        <button
                            type="button"
                            onClick={() => setWinnerTeam(match.away_team)}
                            className={`px-3 py-1.5 rounded text-sm font-medium border ${winnerTeam === match.away_team
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            {match.away_team}
                        </button>
                    </div>
                </div>
            )}

            {/* Botón guardar + feedback */}
            <div className="flex items-center justify-between gap-2">
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || upsert.isPending}
                    className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {upsert.isPending ? 'Guardando...' : prediction ? 'Actualizar' : 'Guardar'}
                </button>

                {feedback && (
                    <span
                        className={`text-xs font-medium ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {feedback.msg}
                    </span>
                )}
            </div>
        </div>
    );
}
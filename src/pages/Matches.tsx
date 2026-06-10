import { useEffect, useMemo, useState } from 'react';
import { useMatches } from '../lib/queries/matches';
import { useMyPredictions } from '../lib/queries/predictions';
import { useMyProfile } from '../lib/queries/profile';
import { STAGES_ORDER, type Stage } from '../lib/constants/stages';
import { MatchCard } from '../components/MatchCard';
import { StageTabs } from '../components/StageTabs';

export function Matches() {
    const { data: matches, isLoading, refetch, isRefetching } = useMatches();
    const { data: predictions, refetch: refetchPredictions } = useMyPredictions();
    const { data: profile } = useMyProfile();

    // Map de prediction por matchId para acceso O(1)
    const predictionByMatchId = useMemo(() => {
        const map = new Map<string, typeof predictions extends (infer T)[] | undefined ? T : never>();
        predictions?.forEach((p) => map.set(p.match_id, p as any));
        return map;
    }, [predictions]);

    // Fases disponibles (que tienen partidos cargados)
    const availableStages = useMemo<Stage[]>(() => {
        if (!matches) return [];
        const stagesPresent = new Set(matches.map((m) => m.stage));
        return STAGES_ORDER.filter((s) => stagesPresent.has(s));
    }, [matches]);

    // Fase actual (primera con partidos no terminados)
    const currentStage = useMemo<Stage>(() => {
        if (!matches) return 'group';
        for (const stage of STAGES_ORDER) {
            const hasUnfinished = matches.some((m) => m.stage === stage && m.status !== 'finished');
            if (hasUnfinished) return stage;
        }
        return availableStages[availableStages.length - 1] ?? 'group';
    }, [matches, availableStages]);

    const [selectedStage, setSelectedStage] = useState<Stage>(currentStage);

    // Sincronizar con la fase actual cuando se cargan los datos
    useEffect(() => {
        if (availableStages.length > 0 && !availableStages.includes(selectedStage)) {
            setSelectedStage(currentStage);
        }
    }, [availableStages, currentStage, selectedStage]);

    const filteredMatches = useMemo(
        () => matches?.filter((m) => m.stage === selectedStage) ?? [],
        [matches, selectedStage]
    );

    const handleRefresh = () => {
        refetch();
        refetchPredictions();
    };

    const firstName = profile?.display_name?.split(' ')[0] ?? 'jugador';

    if (isLoading) {
        return (
            <div className="text-center py-12 text-slate-600">Cargando partidos...</div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Saludo */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Hola, {firstName} 👋
                    </h1>
                    <p className="text-sm text-slate-600">Partidos del Mundial</p>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={isRefetching}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                >
                    {isRefetching ? '⟳ Actualizando...' : '⟳ Actualizar'}
                </button>
            </div>

            {/* Tabs por fase */}
            <StageTabs
                stages={availableStages}
                selected={selectedStage}
                onSelect={setSelectedStage}
            />

            {/* Lista de partidos */}
            <div className="grid gap-3 md:grid-cols-2">
                {filteredMatches.length === 0 ? (
                    <p className="text-center text-slate-500 py-12 md:col-span-2">
                        No hay partidos en esta fase aún.
                    </p>
                ) : (
                    filteredMatches.map((match) => (
                        <MatchCard
                            key={match.id}
                            match={match}
                            prediction={predictionByMatchId.get(match.id) as any}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
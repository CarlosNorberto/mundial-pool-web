export function Rules() {
    return (
        <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800">Reglas del Pool</h1>

            {/* Sistema de puntos */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
                <h2 className="text-lg font-bold text-slate-800 mb-3">Sistema de puntos</h2>
                <div className="space-y-3">
                    <RuleItem points="5" desc="Acertaste el marcador exacto (ej: pronosticaste 2-1 y fue 2-1)" />
                    <RuleItem points="3" desc="Acertaste el ganador + la diferencia de goles (ej: pronosticaste 3-1 y fue 2-0, ambos victoria local por 2 de diferencia)" />
                    <RuleItem points="1" desc="Acertaste solo la tendencia (gana local, empate o gana visitante)" />
                    <RuleItem points="0" desc="No acertaste nada" />
                </div>
            </div>

            {/* Bonus eliminatorias */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
                <h2 className="text-lg font-bold text-slate-800 mb-3">Bonus en eliminatorias</h2>
                <p className="text-sm text-slate-700 mb-2">
                    En fases eliminatorias (1/16 en adelante), si pronosticas un <strong>empate exacto</strong> y eliges bien quién pasa por penales/extras, ganas <strong>+2 puntos</strong> de bonus.
                </p>
                <p className="text-xs text-slate-500 italic">
                    Ejemplo: pronosticaste 1-1 con "pasa Brasil" y el partido terminó 1-1 con Brasil ganando por penales. Resultado: 5 pts (exacto) + 2 pts (bonus) = 7 pts.
                </p>
            </div>

            {/* Cierre y modificación */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
                <h2 className="text-lg font-bold text-slate-800 mb-3">Cierre de pronósticos</h2>
                <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                    <li>Puedes modificar tu pronóstico tantas veces como quieras hasta <strong>5 minutos antes</strong> del partido.</li>
                    <li>Una vez cerrado, ya no puedes modificar. El pronóstico que tengas guardado en ese momento es el que cuenta.</li>
                    <li>Los marcadores siempre se evalúan según los <strong>90 minutos reglamentarios</strong>. Si hay extras o penales, no afectan al pronóstico (excepto para el bonus en eliminatorias).</li>
                </ul>
            </div>

            {/* Premios */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-5">
                <h2 className="text-lg font-bold text-orange-800 mb-3">🏆 Ganador</h2>
                <div className="space-y-2 text-sm">
                    <p>El ganador será quien acumule más puntos al final del Mundial. En caso de empate de puntos totales, se desempata por:</p>
                </div>                
                <ol className="space-y-2 text-sm text-slate-700 list-decimal pl-5 mt-4">
                    <li>Mayor cantidad de <strong>marcadores exactos</strong> (5 pts).</li>
                    <li>Mayor cantidad de <strong>aciertos parciales</strong> (3 pts).</li>
                    <li>Mayor cantidad de <strong>predicciones realizadas</strong>.</li>                    
                </ol>
            </div>

        </div>
    );
}

function RuleItem({ points, desc }: { points: string; desc: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                {points}
            </div>
            <p className="text-sm text-slate-700 pt-2">{desc}</p>
        </div>
    );
}
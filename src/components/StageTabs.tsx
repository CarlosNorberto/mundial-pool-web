import { STAGE_LABELS, type Stage } from '../lib/constants/stages';

type Props = {
    stages: Stage[];
    selected: Stage;
    onSelect: (stage: Stage) => void;
};

export function StageTabs({ stages, selected, onSelect }: Props) {
    return (
        <div className="bg-white border-b border-slate-200 sticky top-[97px] z-10">
            <div className="max-w-5xl mx-auto px-2 py-2 flex gap-2 overflow-x-auto">
                {stages.map((stage) => {
                    const isActive = stage === selected;
                    return (
                        <button
                            key={stage}
                            onClick={() => onSelect(stage)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${isActive
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {STAGE_LABELS[stage]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
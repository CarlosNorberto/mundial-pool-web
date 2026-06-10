export const STAGES_ORDER = [
    'group',
    'round_of_32',
    'round_of_16',
    'quarter_finals',
    'semi_finals',
    'third_place',
    'final',
] as const;

export type Stage = (typeof STAGES_ORDER)[number];

export const STAGE_LABELS: Record<Stage, string> = {
    group: 'Grupos',
    round_of_32: '1/16',
    round_of_16: 'Octavos',
    quarter_finals: 'Cuartos',
    semi_finals: 'Semifinales',
    third_place: '3er puesto',
    final: 'Final',
};
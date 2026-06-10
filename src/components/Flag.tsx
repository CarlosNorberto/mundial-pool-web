const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Vite carga todas las banderas como módulos
const flagsMap = import.meta.glob<{ default: string }>(
    '../assets/flags/*.{png,jpg,jpeg,webp,svg}',
    { eager: true }
);

// Convertimos a un Record con el nombre en MINÚSCULAS como key
const flagPaths: Record<string, string> = Object.entries(flagsMap).reduce(
    (acc, [path, mod]) => {
        const name = path
            .split('/')
            .pop()!
            .replace(/\.(png|jpg|jpeg|webp|svg)$/i, '')
            .toLowerCase();                          // ← agregar esto
        acc[normalize(name)] = mod.default;
        return acc;
    },
    {} as Record<string, string>
);

type Props = {
    team: string;
    size?: number;
    className?: string;
};

export function Flag({ team, size = 32, className = '' }: Props) {
    const src = flagPaths[normalize(team)];   // ← y esto

    if (!src) {
        return (
            <div
                style={{ width: size, height: size }}
                className={`bg-slate-200 rounded flex items-center justify-center ${className}`}
            >
                <span className="text-xs text-slate-500">?</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={team}
            style={{ width: size, height: size, objectFit: 'cover' }}
            className={`rounded ${className}`}
        />
    );
}
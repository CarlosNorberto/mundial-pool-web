export function slugifyUsername(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')   // sacar tildes
        .replace(/[^a-z0-9]/g, '');         // solo letras y números
}
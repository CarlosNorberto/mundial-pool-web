export function isMatchLocked(kickoffAt: string | Date): boolean {
    const kickoff = typeof kickoffAt === 'string' ? new Date(kickoffAt) : kickoffAt;
    const fiveMinBefore = new Date(kickoff.getTime() - 5 * 60 * 1000);
    return new Date() >= fiveMinBefore;
}

export function formatKickoff(kickoffAt: string | Date): string {
    const date = typeof kickoffAt === 'string' ? new Date(kickoffAt) : kickoffAt;
    return date.toLocaleString('es-BO', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}
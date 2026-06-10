import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { Match } from '../types';

export function useMatches() {
    return useQuery({
        queryKey: ['matches'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .order('kickoff_at', { ascending: true });

            if (error) throw error;
            return data as Match[];
        },
    });
}

export function useMatch(matchId: string) {
    return useQuery({
        queryKey: ['match', matchId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .eq('id', matchId)
                .single();

            if (error) throw error;
            return data as Match;
        },
        enabled: !!matchId,
    });
}
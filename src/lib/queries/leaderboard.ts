import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { LeaderboardEntry } from '../types';

export function useLeaderboard() {
    return useQuery({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('leaderboard')
                .select('*');

            if (error) throw error;
            return data as LeaderboardEntry[];
        },
    });
}
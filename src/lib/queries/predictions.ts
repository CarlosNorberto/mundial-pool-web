import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { Prediction } from '../types';

export function useMyPredictions() {
    return useQuery({
        queryKey: ['my-predictions'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('predictions')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;
            return data as Prediction[];
        },
    });
}

export function useUpsertPrediction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            matchId,
            homeScore,
            awayScore,
            winnerTeam,
        }: {
            matchId: string;
            homeScore: number;
            awayScore: number;
            winnerTeam: string | null;
        }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No autenticado');

            const { data, error } = await supabase
                .from('predictions')
                .upsert(
                    {
                        user_id: user.id,
                        match_id: matchId,
                        home_score: homeScore,
                        away_score: awayScore,
                        winner_team: winnerTeam,
                    },
                    { onConflict: 'user_id,match_id' }
                )
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-predictions'] });
        },
    });
}

export type MatchPrediction = {
    home_score: number;
    away_score: number;
    winner_team: string | null;
    points: number | null;
    user_id: string;
    profiles: {
        display_name: string;
        avatar_url: string | null;
    };
};

export function useMatchPredictions(matchId: string) {
    return useQuery({
        queryKey: ['match-predictions', matchId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('predictions')
                .select(`
          home_score,
          away_score,
          winner_team,
          points,
          user_id,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
                .eq('match_id', matchId)
                .order('points', { ascending: false, nullsFirst: true });

            if (error) throw error;
            return data as unknown as MatchPrediction[];
        },
        enabled: !!matchId,
    });
}
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { Profile } from '../types';

export function useMyProfile() {
    return useQuery({
        queryKey: ['my-profile'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            return data as Profile;
        },
    });
}
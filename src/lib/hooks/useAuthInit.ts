import { useEffect } from 'react';
import { supabase } from '../supabase';
import { useSessionStore } from '../store/session';

export function useAuthInit() {
    const setSession = useSessionStore((s) => s.setSession);
    const setLoading = useSessionStore((s) => s.setLoading);

    useEffect(() => {
        // Obtener sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Suscribirse a cambios de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, [setSession, setLoading]);
}
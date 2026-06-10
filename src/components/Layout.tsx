import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function Layout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-orange-100 text-orange-700' : 'text-slate-700 hover:bg-slate-100'
        }`;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="font-bold text-xl text-orange-500">
                        Mundial VCM
                    </Link>

                    <div className="flex items-center gap-2">
                        <NavLink to="/" end className={linkClass}>Partidos</NavLink>
                        <NavLink to="/leaderboard" className={linkClass}>Posiciones</NavLink>
                        <NavLink to="/rules" className={linkClass}>Reglas</NavLink>
                        <NavLink to="/profile" className={linkClass}>Perfil</NavLink>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium"
                        >
                            Salir
                        </button>
                    </div>
                </div>
            </nav>

            {/* Contenido */}
            <main className="max-w-5xl mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}
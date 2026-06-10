import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import  mundialLogo from '../assets/splash-icon.png';

export function Layout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-orange-100 text-orange-700' : 'text-white hover:bg-red-900'
        }`;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-orange-500 border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="font-bold text-xl text-orange-500 flex items-center justify-center">
                        <img src={mundialLogo} alt="Mundial VCM" className="w-18 mx-auto" />
                        <div className="flex flex-col items-start justify-center text-left">
                            <span className="text-white text-2xl">Mundial</span>
                            <span className="text-white text-sm">Versatil - C&amp;M</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2">
                        <NavLink to="/" end className={linkClass}>Partidos</NavLink>
                        <NavLink to="/leaderboard" className={linkClass}>Posiciones</NavLink>
                        <NavLink to="/rules" className={linkClass}>Reglas</NavLink>
                        <NavLink to="/profile" className={linkClass}>Perfil</NavLink>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 text-sm text-white hover:bg-red-900 rounded-md font-medium"
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
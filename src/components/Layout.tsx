import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import mundialLogo from '../assets/splash-icon.png'; 

export function Layout() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setMenuOpen(false);
        navigate('/login');
    };

    const closeMenu = () => setMenuOpen(false);

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium ${isActive
            ? 'bg-orange-100 text-orange-700'
            : 'text-white hover:bg-red-900'
        }`;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-orange-500 border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo + título */}
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="font-bold text-xl text-orange-500 flex items-center justify-center"
                    >
                        <img src={mundialLogo} alt="Mundial VCM" className="w-18 mx-auto" />
                        <div className="flex flex-col items-start justify-center text-left">
                            <span className="text-white text-2xl">Mundial</span>
                            <span className="text-white text-sm">Versatil - C&amp;M</span>
                        </div>
                    </Link>

                    {/* Links desktop */}
                    <div className="hidden md:flex items-center gap-2">
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

                    {/* Botón hamburguesa (solo móvil) */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-md hover:bg-red-900 text-white"
                        aria-label="Abrir menú"
                    >
                        {menuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Menú móvil desplegable */}
                {menuOpen && (
                    <div className="md:hidden border-t border-orange-600 bg-orange-500">
                        <div className="max-w-5xl mx-auto px-4 py-2 flex flex-col gap-1">
                            <NavLink to="/" end className={linkClass} onClick={closeMenu}>
                                Partidos
                            </NavLink>
                            <NavLink to="/leaderboard" className={linkClass} onClick={closeMenu}>
                                Posiciones
                            </NavLink>
                            <NavLink to="/rules" className={linkClass} onClick={closeMenu}>
                                Reglas
                            </NavLink>
                            <NavLink to="/profile" className={linkClass} onClick={closeMenu}>
                                Perfil
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="text-left px-3 py-2 text-sm text-white hover:bg-red-900 rounded-md font-medium"
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}
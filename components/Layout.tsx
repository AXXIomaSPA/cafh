import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Bell, Search, User as UserIcon, LogOut, Globe, ChevronRight, FileText, KeyRound } from 'lucide-react';
import { PUBLIC_NAV_STRUCTURE, ADMIN_NAV_ITEMS, CURRENT_TENANT } from '../constants';
import { db } from '../storage';
import { User, UserRole } from '../types';

// --- MEGA MENU COMPONENT (FULL WIDTH) ---

const MegaMenuOverlay: React.FC<{ activeLabel: string | null, close: () => void }> = ({ activeLabel, close }) => {
    const [dynamicPages, setDynamicPages] = useState<any[]>([]);

    useEffect(() => {
        if (activeLabel === 'Páginas') {
            const pages = db.cms.getPages().filter(p => p.status === 'Published');
            setDynamicPages(pages.map(p => ({
                label: p.title,
                path: `/p/${p.slug}`,
                icon: FileText,
                desc: p.seo.description || 'Página personalizada.'
            })));
        }
    }, [activeLabel]);

    const baseItem = PUBLIC_NAV_STRUCTURE.find(i => i.label === activeLabel);
    if (!baseItem) return null;

    const item = { ...baseItem };
    if (item.label === 'Páginas') {
        item.columns = [{
            title: 'Contenidos Publicados',
            items: dynamicPages.length > 0 ? dynamicPages : [{ label: 'Próximamente', path: '#', icon: FileText, desc: 'Aún no hay páginas publicadas.' }]
        }];
    }

    return (
        <div
            className="absolute top-full left-0 w-full px-4 md:px-6 pt-2 z-50 animate-fade-in-up origin-top"
            onMouseEnter={() => { }} // Keep open when hovering the menu
            onMouseLeave={close}
        >
            <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-cafh-indigo/10 border border-slate-100 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative overflow-hidden">

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cafh-cyan/10 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                {/* Description Column */}
                <div className="lg:col-span-4 flex flex-col justify-center relative z-10">
                    <div className="bg-cafh-light/50 rounded-3xl p-6 md:p-8 border border-white/50">
                        <h3 className="font-display text-3xl text-cafh-indigo mb-3">{item.label}</h3>
                        <p className="text-slate-600 leading-relaxed mb-6 text-base">{item.description}</p>
                        <NavLink
                            to={item.path}
                            onClick={close}
                            className="inline-flex items-center gap-2 text-cafh-indigo font-bold hover:gap-4 transition-all group"
                        >
                            <span className="border-b-2 border-cafh-cyan/50 group-hover:border-cafh-cyan">Explorar sección</span>
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-cafh-cyan group-hover:bg-cafh-indigo group-hover:text-white transition-colors">
                                <ChevronRight size={16} />
                            </div>
                        </NavLink>
                    </div>
                </div>

                {/* Links Columns */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
                    {item.columns.map((col, idx) => (
                        <div key={idx}>
                            <h4 className="flex items-center gap-2 text-xs font-bold text-cafh-indigo/50 uppercase tracking-widest mb-6">
                                <span className="w-2 h-2 rounded-full bg-cafh-cyan"></span>
                                {col.title}
                            </h4>
                            <ul className="space-y-4">
                                {col.items.map((subItem) => {
                                    const Icon = subItem.icon;
                                    return (
                                        <li key={subItem.path}>
                                            <NavLink
                                                to={subItem.path}
                                                onClick={close}
                                                className="group flex items-start gap-4 p-3 -mx-3 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-cafh-light group-hover:bg-cafh-indigo group-hover:text-white flex items-center justify-center text-cafh-indigo transition-colors duration-300 shrink-0 shadow-sm border border-white">
                                                    <Icon size={22} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <span className="block text-base font-bold text-slate-700 group-hover:text-cafh-indigo transition-colors">{subItem.label}</span>
                                                    <span className="block text-sm text-slate-500 leading-snug mt-1 group-hover:text-slate-600">{subItem.desc}</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- PUBLIC HEADER ---

export const PublicHeader: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dynamicPages, setDynamicPages] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const pages = db.cms.getPages().filter(p => p.status === 'Published');
        setDynamicPages(pages.map(p => ({
            label: p.title,
            path: `/p/${p.slug}`,
            icon: FileText,
            desc: p.seo.description || 'Página personalizada.'
        })));
    }, []);

    const navStructure = PUBLIC_NAV_STRUCTURE.map(item => {
        if (item.label === 'Páginas') {
            return {
                ...item,
                columns: [{
                    title: 'Contenidos Publicados',
                    items: dynamicPages.length > 0 ? dynamicPages : [{ label: 'Próximamente', path: '#', icon: FileText, desc: 'Aún no hay páginas publicadas.' }]
                }]
            };
        }
        return item;
    });

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || activeMenu || mobileMenuOpen
                ? 'bg-white/90 backdrop-blur-md shadow-sm py-2 md:py-4'
                : 'bg-transparent py-4 md:py-8'
                }`}
            onMouseLeave={() => !mobileMenuOpen && setActiveMenu(null)}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
                <div className="flex items-center justify-between z-20 relative">

                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <span className={`font-sans font-bold text-3xl md:text-4xl tracking-tight transition-colors duration-300 ${(isScrolled || activeMenu || mobileMenuOpen) ? 'text-cafh-indigo' : 'text-white'
                            }`}>
                            Cafh
                        </span>
                    </div>

                    {/* Desktop Nav - Centered Trigger */}
                    <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-sm p-1 rounded-full border border-white/10">
                        {navStructure.map((item) => (
                            <button
                                key={item.label}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${(isScrolled || activeMenu)
                                    ? activeMenu === item.label ? 'bg-cafh-indigo text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                                    : activeMenu === item.label ? 'bg-white text-cafh-indigo' : 'text-white hover:bg-white/20'
                                    }`}
                                onMouseEnter={() => setActiveMenu(item.label)}
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                                <ChevronDown size={14} className={`transition-transform duration-300 ${activeMenu === item.label ? 'rotate-180' : ''}`} />
                            </button>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        <button className={`p-3 rounded-full transition-colors ${(isScrolled || activeMenu) ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-white'
                            }`}>
                            <Search size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg transform hover:scale-105 active:scale-95 ${(isScrolled || activeMenu)
                                ? 'bg-cafh-indigo text-white hover:bg-blue-900'
                                : 'bg-white text-cafh-indigo hover:bg-slate-100'
                                }`}
                        >
                            Zona Miembros
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className={`lg:hidden p-2 transition-colors ${(isScrolled || activeMenu || mobileMenuOpen) ? 'text-slate-800' : 'text-white'
                            }`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

                {/* Full Width Mega Menu Container */}
                <div className={`hidden lg:block absolute top-full left-0 w-full transition-all duration-300 ${activeMenu ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    <MegaMenuOverlay activeLabel={activeMenu} close={() => setActiveMenu(null)} />
                </div>
            </div>

            {/* Mobile Menu Overlay - Full Screen */}
            {mobileMenuOpen && (
                <div className="absolute top-0 left-0 w-full h-screen bg-slate-50 z-10 flex flex-col pt-24 px-6 animate-in slide-in-from-right-10 overflow-y-auto">
                    <div className="space-y-8 pb-10 max-w-lg mx-auto w-full">
                        {navStructure.map(item => (
                            <div key={item.label} className="border-b border-slate-200 pb-6 last:border-0">
                                <div className="flex justify-between items-center mb-4">
                                    <NavLink
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-3xl font-display font-bold text-cafh-indigo"
                                    >
                                        {item.label}
                                    </NavLink>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {item.columns.flatMap(c => c.items).map(sub => {
                                        const Icon = sub.icon;
                                        return (
                                            <NavLink
                                                key={sub.label}
                                                to={sub.path}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-4 p-3 rounded-xl bg-white shadow-sm border border-slate-100 active:scale-95 transition-transform"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-cafh-light text-cafh-indigo flex items-center justify-center shrink-0">
                                                    <Icon size={18} />
                                                </div>
                                                <span className="text-slate-700 font-bold">{sub.label}</span>
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 space-y-4">
                            <button onClick={() => navigate('/login')} className="w-full bg-cafh-indigo text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-cafh-indigo/20">
                                Ingresar a Zona Miembros
                            </button>
                            <div className="flex justify-center gap-6 pt-4 text-slate-400">
                                <Search size={24} />
                                <Globe size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export const PublicFooter: React.FC = () => {
    const [footerConfig, setFooterConfig] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const config = db.cms.getFooterConfig();
        setFooterConfig(config);
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !footerConfig) return;

        setIsSubmitting(true);
        try {
            // Connect to CRM with Lead Source Tag
            await db.crm.addLead({
                email,
                source: footerConfig.leadSourceTag || 'footer_subscription',
                date: new Date().toISOString(),
                status: 'new'
            });

            setIsSuccess(true);
            setEmail('');
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (error) {
            console.error('Subscription error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!footerConfig) return null;

    return (
        <footer className="bg-cafh-indigo text-slate-300 py-16 md:py-24 rounded-t-[2.5rem] md:rounded-t-[4rem] mt-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-cafh-cyan rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cafh-lavender rounded-full blur-3xl mix-blend-overlay"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Main grid — 12 columns: Brand(3) | NavCol1(2) | NavCol2(2) | ContactCol(2) | Subscribe(3) = 12 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6">

                    {/* Brand + Social — span 3 */}
                    <div className="lg:col-span-3 space-y-5">
                        <span className="font-sans font-bold text-5xl text-white block">Cafh</span>
                        <p className="text-slate-300 text-sm leading-relaxed font-light">
                            Una reunión de personas dedicadas al servicio de la gente. Nuestro propósito es puramente espiritual, ayudando a desarrollar la conciencia y la capacidad de amar.
                        </p>
                        <div className="flex gap-2.5 pt-1">
                            {footerConfig.socialLinks?.map((link: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={link.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={link.platform}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-cafh-cyan/20 hover:border-cafh-cyan border border-white/10 flex items-center justify-center text-white cursor-pointer transition-all duration-200"
                                >
                                    <Globe size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Nav Columns — span 2 each (cols 4-5 and 6-7) */}
                    {footerConfig.columns?.slice(0, 2).map((col: any, idx: number) => (
                        <div key={idx} className="lg:col-span-2">
                            <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[11px]">{col.title}</h4>
                            <ul className="space-y-3.5">
                                {col.links?.map((link: any, lIdx: number) => (
                                    <li key={lIdx}>
                                        <a
                                            href={link.path || link.url || '#'}
                                            className="text-slate-300 hover:text-cafh-cyan transition-colors flex items-center gap-2 text-sm font-medium group"
                                        >
                                            <div className="w-1 h-1 rounded-full bg-cafh-cyan/40 group-hover:bg-cafh-cyan transition-colors flex-shrink-0"></div>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Column 3 — span 2 (cols 8-9) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[11px]">
                            {footerConfig.columns?.[2]?.title || 'Comunidad'}
                        </h4>
                        <ul className="space-y-3.5">
                            {footerConfig.columns?.[2]?.links?.map((link: any, lIdx: number) => (
                                <li key={lIdx}>
                                    <a
                                        href={link.path || link.url || '#'}
                                        className="text-slate-300 hover:text-cafh-cyan transition-colors flex items-center gap-2 text-sm font-medium group"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-cafh-cyan/40 group-hover:bg-cafh-cyan transition-colors flex-shrink-0"></div>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Subscription Box — span 3 (cols 10-12) */}
                    <div className="lg:col-span-3 sm:col-span-2">
                        <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-xs">
                            {footerConfig.subscriptionTitle || 'Mantente Conectado'}
                        </h4>
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                            <p className="text-sm mb-4 text-blue-200/80 leading-relaxed">{footerConfig.subscriptionSubtitle}</p>
                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Tu dirección de email"
                                    className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-cafh-cyan focus:border-cafh-cyan/30 outline-none text-white placeholder-white/40 transition-all"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full px-4 py-3 rounded-xl font-bold transition-all text-sm shadow-lg shadow-black/20 ${isSuccess
                                        ? 'bg-green-500 text-white'
                                        : 'bg-cafh-cyan text-cafh-indigo hover:bg-white'
                                        }`}
                                >
                                    {isSubmitting ? 'Enviando...' : isSuccess ? '✓ ¡Suscrito!' : 'Suscribirme'}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>

                {/* Copyright Bar */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40 font-light">
                    <span>{footerConfig.copyright}</span>
                    <div className="flex items-center gap-1 text-xs text-white/25">
                        <span className="font-sans font-bold text-white/30">Cafh</span>
                        <span>·</span>
                        <span>Plataforma Digital</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// --- ADMIN LAYOUT (Keep Existing) ---
export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentUser(db.auth.getCurrentUser());
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        db.auth.logout();
        navigate('/login');
    };

    const roleLabel = (role?: string) => {
        if (role === UserRole.SUPER_ADMIN) return 'Super Admin';
        if (role === UserRole.ADMIN) return 'Administrador';
        if (role === UserRole.EDITOR) return 'Editor';
        return 'Usuario';
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <div className="flex items-center">
                        <span className="text-white font-display font-bold text-2xl tracking-wide">Cafh</span>
                        <span className="ml-2 text-xs uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Admin</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Multi-tenant Switcher */}
                <div className="px-4 py-4">
                    <div className="bg-slate-800 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-700 transition-colors border border-slate-700">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-cafh-cyan flex items-center justify-center flex-shrink-0 text-cafh-indigo font-bold">C</div>
                            <span className="text-sm font-medium truncate text-white">{CURRENT_TENANT.name}</span>
                        </div>
                        <ChevronDown size={14} />
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                    {ADMIN_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <div
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${isActive
                                    ? 'bg-cafh-indigo text-white shadow-lg shadow-blue-900/40 translate-x-1'
                                    : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-cafh-cyan' : 'opacity-70'} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => {
                            navigate('/');
                            setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white w-full transition-colors"
                    >
                        <Globe size={18} />
                        <span className="text-sm">Ver Sitio Web</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 w-full transition-colors mt-1"
                    >
                        <LogOut size={18} />
                        <span className="text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
                {/* Admin Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800">
                            {ADMIN_NAV_ITEMS.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative p-2 rounded-full hover:bg-slate-100 cursor-pointer transition-colors">
                            <Bell size={20} className="text-slate-500" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                        {/* Profile Dropdown */}
                        <div ref={profileRef} className="relative flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">{currentUser?.name || 'Admin User'}</p>
                                <p className="text-xs text-slate-500">{roleLabel(currentUser?.role)}</p>
                            </div>
                            <button
                                onClick={() => setIsProfileOpen(prev => !prev)}
                                className="w-10 h-10 bg-cafh-light rounded-full flex items-center justify-center text-cafh-indigo border border-slate-200 hover:border-cafh-cyan hover:bg-cafh-cyan/10 transition-all"
                                title="Mi perfil"
                            >
                                <UserIcon size={20} />
                            </button>

                            {/* Dropdown Panel */}
                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in-up">
                                    {/* User info header */}
                                    <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                                        <div className="w-12 h-12 bg-cafh-indigo rounded-xl flex items-center justify-center text-white mb-3">
                                            <UserIcon size={22} />
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm">{currentUser?.name || 'Administrador'}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 truncate">{currentUser?.email || ''}</p>
                                        <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest bg-cafh-indigo/10 text-cafh-indigo px-2 py-0.5 rounded-full">
                                            {roleLabel(currentUser?.role)}
                                        </span>
                                    </div>
                                    {/* Actions */}
                                    <div className="p-2">
                                        <button
                                            onClick={() => { navigate('/'); setIsProfileOpen(false); }}
                                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                                        >
                                            <Globe size={16} className="text-slate-400" />
                                            Ver sitio web
                                        </button>
                                        <button
                                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <KeyRound size={16} className="text-slate-400" />
                                            Cambiar contraseña
                                        </button>
                                        <div className="border-t border-slate-100 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-sm font-bold transition-colors"
                                            >
                                                <LogOut size={16} />
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
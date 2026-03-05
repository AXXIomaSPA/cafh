import React, { useEffect, useState } from 'react';
import { db } from '../storage'; // Now using DB
import { Calendar, Clock, BookOpen, Star, ArrowRight, User, Settings, LogOut, CheckCircle2, Video, ExternalLink, Mic, MicOff, Camera, CameraOff, MonitorUp, MoreVertical, PhoneOff, Copy, Check, Users, Shield, MessageSquare, Image as ImageIcon, Edit3, FileText, Download, List, Info, Play, Feather, X, Heart, Grid, Save } from 'lucide-react';
import { UserActivity, ContentItem, CalendarEvent, User as UserType, UserWizardProfile, BlogPost } from '../types';
import { useNavigate } from 'react-router-dom';
import { ZoomWidget } from './MeetingsMemberView';

// --- MEET LOBBY MODAL (Context & Resources Briefing) ---
const MeetLobbyModal: React.FC<{ isOpen: boolean; onClose: () => void; event: CalendarEvent | null }> = ({ isOpen, onClose, event }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !event) return null;

    const handleCopyLink = () => {
        if (event.meetingUrl) {
            navigator.clipboard.writeText(event.meetingUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleJoin = () => {
        if (event.meetingUrl) window.open(event.meetingUrl, '_blank');
        onClose();
    };

    // Use dynamic data from the event, or fallback to empty arrays
    const resources = event.resources || [];
    const agenda = event.agenda || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md transition-opacity duration-300" onClick={onClose}></div>

            <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up flex flex-col md:flex-row h-auto md:h-[550px]">

                {/* LEFT: Context & Resources (Briefing Area) */}
                <div className="flex-1 bg-slate-50 p-8 flex flex-col border-r border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-cafh-indigo/10 p-2 rounded-lg text-cafh-indigo">
                            <List size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Detalles de la Sesión</h3>
                    </div>

                    <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {/* Agenda Section */}
                        {agenda.length > 0 ? (
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Agenda del Encuentro</h4>
                                <ul className="space-y-4 relative border-l-2 border-slate-200 ml-1.5 pl-6">
                                    {agenda.map((item, idx) => (
                                        <li key={idx} className="relative">
                                            <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-white border-2 border-cafh-cyan"></div>
                                            <span className="text-slate-600 text-sm font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-center text-slate-400 text-sm italic">
                                Agenda no disponible para este evento.
                            </div>
                        )}

                        {/* Resources Section */}
                        {resources.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Material de Apoyo</h4>
                                <div className="space-y-3">
                                    {resources.map((res, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-cafh-indigo/30 transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-cafh-indigo group-hover:text-white transition-colors">
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">{res.title}</p>
                                                    <p className="text-xs text-slate-400">{res.type} {res.size ? `• ${res.size}` : ''}</p>
                                                </div>
                                            </div>
                                            <Download size={16} className="text-slate-300 group-hover:text-cafh-indigo" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Action & Connection */}
                <div className="w-full md:w-[400px] bg-white p-8 flex flex-col relative z-10 shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.05)]">
                    <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                        <ExternalLink size={20} className="rotate-180" />
                    </button>

                    <div className="mt-8 mb-auto">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                            <Video size={32} />
                        </div>

                        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2 leading-tight">{event.title}</h2>

                        <div className="flex flex-col gap-2 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Clock size={16} className="text-cafh-indigo" />
                                <span className="text-sm font-medium">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <User size={16} className="text-cafh-indigo" />
                                <span className="text-sm">Organiza: <strong>Sede Central</strong></span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Shield size={16} className="text-cafh-indigo" />
                                <span className="text-sm">Sala privada para miembros</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mt-8">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                            <Info size={16} className="shrink-0" />
                            Serás redirigido a Google Meet para conectar tu cámara y micrófono.
                        </div>

                        <button
                            onClick={handleJoin}
                            className="w-full py-4 bg-cafh-indigo text-white rounded-xl font-bold text-lg hover:bg-blue-900 transition-all shadow-xl shadow-cafh-indigo/20 flex items-center justify-center gap-2 group"
                        >
                            <span>Ir a la Llamada</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={handleCopyLink}
                            className="w-full py-3 text-slate-500 font-bold text-sm hover:text-cafh-indigo hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            {copied ? 'Enlace copiado' : 'Copiar enlace de invitación'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MemberDashboard: React.FC = () => {
    // State management for DB data
    const [history, setHistory] = useState<UserActivity[]>([]);
    const [recommendedContent, setRecommendedContent] = useState<any[]>([]);
    const [selectedResource, setSelectedResource] = useState<any | null>(null);
    const [nextEvent, setNextEvent] = useState<CalendarEvent | null>(null);
    const [isMeetModalOpen, setIsMeetModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [wizardProfile, setWizardProfile] = useState<UserWizardProfile | null>(null);
    const [recentBlogPosts, setRecentBlogPosts] = useState<BlogPost[]>([]);

    // Header Customization State
    const [isHoveringHeader, setIsHoveringHeader] = useState(false);

    // Tabs & Profile Edit State
    const [activeTab, setActiveTab] = useState<'resumen' | 'historial' | 'perfil'>('resumen');
    const [profileForm, setProfileForm] = useState({ name: '', phone: '', city: '' });
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // 1. Load authenticated user
        const user = db.auth.getCurrentUser();
        setCurrentUser(user);

        // 2. Load wizard profile for this user
        let userWizardProfile: UserWizardProfile | null = null;
        try {
            const raw = localStorage.getItem('cafh_user_wizard_profiles_v1');
            if (raw && user) {
                const allProfiles: UserWizardProfile[] = JSON.parse(raw);
                userWizardProfile = allProfiles.find(p => p.userId === user.id) || allProfiles[allProfiles.length - 1] || null;
            }
        } catch { /* ignore parse errors */ }
        setWizardProfile(userWizardProfile);

        // 3. Determine interests: wizard profile tags > user.interests > defaults
        const userInterests = (
            userWizardProfile?.derivedTags?.length ? userWizardProfile.derivedTags :
                user?.interests?.length ? user.interests :
                    ['Meditación', 'Bienestar']
        );

        // 4. Load and filter content & media by interests
        const contents = db.content.getAll().map(c => ({
            id: `c_${c.id}`, originalId: c.id, title: c.title, type: c.type, tags: c.tags, date: c.publishDate, url: c.imageUrl, source: 'content'
        }));
        const medias = db.media.getAll()
            .filter(m => ['document', 'video', 'audio'].includes(m.type))
            .map((m: any) => ({
                id: `m_${m.id}`, originalId: m.id, title: m.name, type: m.type, tags: m.tags || [], date: m.uploadedAt, url: m.url, source: 'media'
            }));

        const allEvents = db.events.getAll();

        const recommendations = [...contents, ...medias].filter(c =>
            c.tags.some((tag: string) => userInterests.includes(tag))
        ).slice(0, 6); // Limit to 6 recommendations

        // 5. Load real blog posts (latest 2)
        const allBlogPosts = db.blog.getAll();
        setRecentBlogPosts(allBlogPosts.slice(0, 2));

        // 6. Find the next online or hybrid event that has a meeting URL
        const upcomingEvent = allEvents.find(e =>
            (e.type === 'Online' || e.type === 'Híbrido') && e.meetingUrl
        );

        setHistory(db.user.getHistory());
        setRecommendedContent(recommendations);
        setNextEvent(upcomingEvent || null);

        if (user) {
            setProfileForm({
                name: user.name || '',
                phone: user.phone || '',
                city: user.city || ''
            });
        }
    }, []);

    const handleLogout = () => {
        db.auth.logout();
        navigate('/login');
    };

    const handleResourceClick = (res: any) => {
        db.analytics.trackConsumption({
            assetId: res.originalId,
            assetName: res.title,
            assetType: res.type,
            tags: res.tags
        });
        setSelectedResource(res);
    };

    const handleChangeCover = () => {
        const presets = [
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop"
        ];
        const currentCover = currentUser?.coverUrl || presets[0];
        const currentIdx = presets.indexOf(currentCover);
        const nextIdx = (currentIdx + 1) % presets.length;

        const nextImage = presets[nextIdx];
        if (currentUser) {
            const updated = (db.auth as any).updateCurrentUser({ coverUrl: nextImage });
            if (updated) setCurrentUser(updated);
        }
    };

    const handleSaveProfile = () => {
        setIsSaving(true);
        setTimeout(() => {
            if (currentUser) {
                const updated = (db.auth as any).updateCurrentUser({
                    name: profileForm.name,
                    phone: profileForm.phone,
                    city: profileForm.city
                });
                if (updated) setCurrentUser(updated);
            }
            setIsSaving(false);
        }, 600);
    };

    const currentCover = currentUser?.coverUrl || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop";

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Modal Popup Viewer */}
            {selectedResource && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedResource(null)}>
                    <div className="relative w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800">{selectedResource.title}</h3>
                            <button onClick={() => setSelectedResource(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="p-6 bg-slate-50 min-h-[400px] flex flex-col items-center justify-center">
                            {(selectedResource.type === 'video') ? (
                                <video src={selectedResource.url} controls autoPlay className="w-full max-h-[60vh] rounded-xl outline-none bg-black" />
                            ) : (selectedResource.type === 'audio') ? (
                                <div className="bg-white p-8 rounded-2xl shadow-sm text-center w-full max-w-md">
                                    <div className="w-20 h-20 bg-cafh-indigo/10 text-cafh-indigo rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Play fill="currentColor" size={32} />
                                    </div>
                                    <audio src={selectedResource.url} controls autoPlay className="w-full outline-none" />
                                </div>
                            ) : (selectedResource.type === 'document' || selectedResource.type === 'Resource') ? (
                                selectedResource.url && selectedResource.url !== '#' ? (
                                    <iframe src={selectedResource.url} className="w-full h-[60vh] rounded-xl border border-slate-200" title="Document Viewer" />
                                ) : (
                                    <div className="text-center text-slate-500"><BookOpen size={48} className="mx-auto mb-4 opacity-50" /> <p>El documento no tiene un archivo asignado.</p></div>
                                )
                            ) : (
                                <div className="text-center p-12 max-w-lg">
                                    <div className="w-20 h-20 bg-cafh-cyan/10 text-cafh-cyan rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                                        <Feather size={32} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-800 mb-4">{selectedResource.title}</h4>
                                    <p className="text-slate-600">Al simular este artículo, registramos que lo leíste. En producción mostraría el contenido del post.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Dashboard Header - Customizable & Immersive */}
            <div
                className="relative pt-32 pb-32 md:pb-48 px-6 rounded-b-[3rem] shadow-xl overflow-hidden group"
                onMouseEnter={() => setIsHoveringHeader(true)}
                onMouseLeave={() => setIsHoveringHeader(false)}
            >
                {/* Background Layer with Blend Mode */}
                <div className="absolute inset-0 z-0 bg-cafh-indigo">
                    <img
                        src={currentCover}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-40 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient Overlay for Text Readability & Seamless Transition */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cafh-indigo/90 via-cafh-indigo/60 to-slate-50"></div>
                </div>

                {/* Decor Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-cafh-cyan rounded-full blur-[100px] opacity-20 pointer-events-none mix-blend-screen"></div>

                {/* Edit Cover Button */}
                <button
                    onClick={handleChangeCover}
                    className={`absolute top-24 right-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white p-2.5 rounded-full hover:bg-white/20 transition-all duration-300 ${isHoveringHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                    title="Cambiar imagen de portada"
                >
                    <ImageIcon size={18} />
                </button>

                {/* Content */}
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-cafh-indigo shadow-lg shrink-0 border-4 border-white/10 backdrop-blur-sm overflow-hidden">
                                <User size={40} />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-cafh-indigo"></div>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-display font-bold text-white mb-1">
                                Hola, {currentUser?.name?.split(' ')[0] || 'Viajero'}
                            </h1>
                            <p className="text-blue-100 font-light flex items-center gap-2 justify-center md:justify-start">
                                <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                                    {wizardProfile?.profileTypeName || 'Miembro'}
                                </span>
                                <span>desde {currentUser?.joinedDate ? new Date(currentUser.joinedDate).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }) : 'Cafh'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => window.open('https://contribuciones.cafh.cl/login', '_blank')}
                            className="px-5 py-2.5 bg-cafh-peach/90 text-white rounded-full text-sm font-bold hover:bg-orange-500 flex items-center gap-2 transition-colors shadow-lg shadow-cafh-peach/20 backdrop-blur-md"
                        >
                            <Heart size={16} className="fill-current" /> Donar
                        </button>
                        <button className="px-5 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-bold hover:bg-white/20 flex items-center gap-2 transition-colors border border-white/10" onClick={() => setActiveTab('perfil')}>
                            <Settings size={16} /> Ajustes
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-5 py-2.5 bg-cafh-clay/90 text-white rounded-full text-sm font-bold hover:bg-red-600 flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20 backdrop-blur-md"
                        >
                            <LogOut size={16} /> Salir
                        </button>
                    </div>
                </div>
            </div>

            {/* TAB BAR NAVEGACION */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-30 mb-8">
                <div className="flex bg-white rounded-2xl p-2 shadow-lg w-full max-w-sm border border-slate-100 mx-auto md:mx-0">
                    {[
                        { id: 'resumen', label: 'Resumen', icon: Grid },
                        { id: 'historial', label: 'Historial', icon: Clock },
                        { id: 'perfil', label: 'Mi Perfil', icon: User }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-slate-50 text-cafh-indigo shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 relative z-20">
                {activeTab === 'resumen' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN: Main Content */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Personalized Recommendations */}

                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
                                        <Star className="text-cafh-peach fill-current" />
                                        Tu Biblioteca Personalizada
                                    </h2>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">Basado en tus intereses</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {recommendedContent.length > 0 ? recommendedContent.map(item => (
                                        <div key={item.id} onClick={() => handleResourceClick(item)} className="group border border-slate-100 rounded-2xl p-5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 items-start">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'Article' ? 'bg-blue-50 text-blue-600' :
                                                (item.type === 'Resource' || item.type === 'document') ? 'bg-green-50 text-green-600' :
                                                    item.type === 'audio' ? 'bg-purple-50 text-purple-600' :
                                                        'bg-red-50 text-red-600'
                                                }`}>
                                                {item.type === 'Article' ? <Feather size={20} /> : (item.type === 'Resource' || item.type === 'document') ? <Download size={20} /> : item.type === 'audio' ? <Play size={20} /> : <Video size={20} />}
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded-full">{item.type}</span>
                                                <h4 className="font-bold text-slate-700 leading-tight mb-2 mt-2 group-hover:text-cafh-indigo transition-colors">{item.title}</h4>
                                                <span className="text-xs text-slate-400">Lectura / Consumo</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-slate-500 italic">Completa "Comenzar el Viaje" o añade tags a tu perfil para ver recomendaciones.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {activeTab === 'historial' && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 max-w-4xl">
                        <h2 className="text-2xl font-display font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Clock className="text-cafh-turquoise" />
                            Tu Historial Compelto
                        </h2>
                        <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pl-8 py-2">
                            {history.length > 0 ? history.map(activity => (
                                <div key={activity.id} className="relative">
                                    <div className="absolute -left-[41px] top-1 w-6 h-6 bg-white border-4 border-cafh-indigo rounded-full"></div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-lg">{activity.title}</h4>
                                            <span className="text-sm text-slate-500">{activity.type} • {activity.date}</span>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit mt-2 sm:mt-0">
                                            <CheckCircle2 size={12} /> Completado
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-400 italic">No hay registros de actividad todavía.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'perfil' && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-cafh-indigo/10 rounded-2xl flex items-center justify-center text-cafh-indigo">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 font-display">Editar Mi Perfil</h2>
                                <p className="text-sm text-slate-500">Actualiza tus datos y preferencias.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={profileForm.name}
                                    onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cafh-indigo/50 focus:border-cafh-indigo transition-all font-medium text-slate-700"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Teléfono Móvil</label>
                                    <input
                                        type="tel"
                                        value={profileForm.phone}
                                        onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                                        placeholder="+56 9 1234 5678"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cafh-indigo/50 focus:border-cafh-indigo transition-all font-medium text-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Ciudad de Residencia</label>
                                    <input
                                        type="text"
                                        value={profileForm.city}
                                        onChange={e => setProfileForm(f => ({ ...f, city: e.target.value }))}
                                        placeholder="Ej: Santiago, Buenos Aires"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cafh-indigo/50 focus:border-cafh-indigo transition-all font-medium text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs text-slate-400">Los cambios se aplican automáticamente en tu sesión.</span>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="px-6 py-3 bg-cafh-indigo text-white rounded-xl font-bold text-sm shadow-xl shadow-cafh-indigo/20 flex items-center gap-2 hover:bg-blue-800 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? <MoreVertical size={16} className="animate-spin" /> : <Save size={16} />}
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}
            <MeetLobbyModal
                isOpen={isMeetModalOpen}
                onClose={() => setIsMeetModalOpen(false)}
                event={nextEvent}
            />
        </div>
    );
}
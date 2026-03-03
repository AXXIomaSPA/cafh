import React, { useEffect, useState } from 'react';
import { db } from '../storage'; // Now using DB
import { Calendar, Clock, BookOpen, Star, ArrowRight, User, Settings, LogOut, CheckCircle2, Video, ExternalLink, Mic, MicOff, Camera, CameraOff, MonitorUp, MoreVertical, PhoneOff, Copy, Check, Users, Shield, MessageSquare, Image as ImageIcon, Edit3, FileText, Download, List, Info } from 'lucide-react';
import { UserActivity, ContentItem, CalendarEvent } from '../types';
import { useNavigate } from 'react-router-dom';

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
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
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
    const [recommendedContent, setRecommendedContent] = useState<ContentItem[]>([]);
    const [nextEvent, setNextEvent] = useState<CalendarEvent | null>(null);
    const [isMeetModalOpen, setIsMeetModalOpen] = useState(false);
    
    // Header Customization State
    const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop");
    const [isHoveringHeader, setIsHoveringHeader] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Load data from Local Memory
        const userHistory = db.user.getHistory();
        const allContent = db.content.getAll();
        const allEvents = db.events.getAll();
        
        // Simulated logged-in user interests (In a real app, this comes from auth context)
        const userInterests = ['Meditación', 'Bienestar']; 
        
        const recommendations = allContent.filter(c => 
            c.tags.some(tag => userInterests.includes(tag))
        );

        // Find the next online or hybrid event that has a meeting URL
        const upcomingEvent = allEvents.find(e => 
            (e.type === 'Online' || e.type === 'Híbrido') && e.meetingUrl
        );

        setHistory(userHistory);
        setRecommendedContent(recommendations);
        setNextEvent(upcomingEvent || null);
    }, []);

    const handleLogout = () => {
        db.auth.logout();
        navigate('/login');
    };

    const handleChangeCover = () => {
        // In a real app, this would open a file picker
        // For prototype, we cycle through a few preset high-quality images
        const presets = [
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop", // Nature
            "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop", // Light
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop", // Calm
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop"  // Mountain
        ];
        const currentIdx = presets.indexOf(coverImage);
        const nextIdx = (currentIdx + 1) % presets.length;
        setCoverImage(presets[nextIdx]);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Dashboard Header - Customizable & Immersive */}
            <div 
                className="relative pt-32 pb-32 md:pb-48 px-6 rounded-b-[3rem] shadow-xl overflow-hidden group"
                onMouseEnter={() => setIsHoveringHeader(true)}
                onMouseLeave={() => setIsHoveringHeader(false)}
            >
                {/* Background Layer with Blend Mode */}
                <div className="absolute inset-0 z-0 bg-cafh-indigo">
                    <img 
                        src={coverImage} 
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
                            <h1 className="text-4xl font-display font-bold text-white mb-1">Hola, Viajero</h1>
                            <p className="text-blue-100 font-light flex items-center gap-2 justify-center md:justify-start">
                                <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Miembro</span>
                                <span>desde Octubre 2023</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-3">
                        <button className="px-5 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-bold hover:bg-white/20 flex items-center gap-2 transition-colors border border-white/10">
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

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-6 -mt-20 md:-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
                
                {/* LEFT COLUMN: Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Personalized Recommendations (Result of Wizard) */}
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
                                <div key={item.id} className="group border border-slate-100 rounded-2xl p-5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-cafh-light rounded-xl flex items-center justify-center text-cafh-indigo shrink-0">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-cafh-cyan uppercase">{item.type}</span>
                                        <h4 className="font-bold text-slate-700 leading-tight mb-2 group-hover:text-cafh-indigo transition-colors">{item.title}</h4>
                                        <span className="text-xs text-slate-400">Lectura de 5 min</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-500 italic">Completa "Comenzar el Viaje" para ver recomendaciones.</p>
                            )}
                        </div>
                    </div>

                    {/* History Timeline */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-display font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Clock className="text-cafh-turquoise" />
                            Tu Historial
                        </h2>
                        <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pl-8 py-2">
                            {history.map(activity => (
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
                            ))}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Sidebar Tools */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Dynamic Google Meet / Next Event Widget */}
                    <div className="bg-cafh-indigo text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                        
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            {nextEvent ? <Video size={20} className="text-cafh-cyan animate-pulse" /> : <Calendar size={20}/>} 
                            {nextEvent ? 'Sala Virtual' : 'Próximo Evento'}
                        </h3>
                        
                        {nextEvent ? (
                            <div className="animate-fade-in-up">
                                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-3xl font-display font-bold">{nextEvent.day} {nextEvent.month}</div>
                                        <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse">En vivo</span>
                                    </div>
                                    <div className="text-cafh-cyan font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Video size={14}/> {nextEvent.platform || 'Online'}
                                    </div>
                                    <p className="font-medium leading-tight mb-2">{nextEvent.title}</p>
                                    <p className="text-xs text-blue-200">{nextEvent.time}</p>
                                </div>
                                
                                <button 
                                    onClick={() => setIsMeetModalOpen(true)}
                                    className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-base hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 group"
                                >
                                    <Video size={20} className="group-hover:scale-110 transition-transform" /> 
                                    Unirse a la Sala
                                </button>
                                <p className="text-center text-[10px] text-blue-300 mt-3">
                                    Sala de espera habilitada.
                                </p>
                            </div>
                        ) : (
                            // Fallback if no online event found
                            <>
                                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 mb-4">
                                    <p className="text-blue-100 text-sm">No tienes eventos virtuales próximos.</p>
                                </div>
                                <button className="w-full py-3 bg-white text-cafh-indigo rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
                                    Ver Calendario Completo
                                </button>
                            </>
                        )}
                    </div>

                    {/* Blog Feed / News */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Novedades para ti</h3>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="flex gap-4 items-center group cursor-pointer">
                                    <div className="w-16 h-16 bg-slate-200 rounded-xl overflow-hidden shrink-0">
                                        <img src={`https://picsum.photos/seed/${i+100}/200`} alt="Blog" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-700 text-sm leading-tight group-hover:text-cafh-indigo">Reflexión Semanal: El tiempo</h5>
                                        <span className="text-xs text-slate-400">Hace 2 días</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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
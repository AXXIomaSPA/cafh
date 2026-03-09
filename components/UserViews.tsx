import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../storage'; // Now using DB
import { Calendar, Clock, BookOpen, Star, ArrowRight, User, Settings, LogOut, CheckCircle2, Video, ExternalLink, Mic, MicOff, Camera, CameraOff, MonitorUp, MoreVertical, PhoneOff, Copy, Check, Users, Shield, MessageSquare, Send, Loader2, Image as ImageIcon, Edit3, FileText, Download, List, Info, Play, Feather, X, Heart, Grid, Save, Sparkles } from 'lucide-react';
import { UserActivity, ContentItem, CalendarEvent, User as UserType, UserWizardProfile, BlogPost, ChatMessage, ChatThread } from '../types';
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

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
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
        </div>,
        document.body
    );
};

// --- CHAT COMPONENTS ---
import { useRef } from 'react';

const MemberChat: React.FC<{ member: UserType | null }> = ({ member }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!member) return;

        // 1. Get or create thread
        let thread = db.messaging.getThreadByMember(member.id);
        if (!thread) {
            thread = db.messaging.saveThread({
                id: `th_${member.id}`,
                memberId: member.id,
                memberName: member.name || 'Miembro',
                memberAvatar: member.avatarUrl,
                tenantId: member.tenantId,
                lastUpdate: new Date().toISOString(),
                unreadAdmin: 0,
                unreadMember: 0,
                status: 'Open'
            });
        }
        setCurrentThread(thread);

        // 2. Load messages
        const msgs = db.messaging.getMessages(thread.id);
        setMessages(msgs);

        // 3. Mark as read
        if (thread.unreadMember > 0) {
            db.messaging.markAsRead(thread.id, member.role);
        }

        setLoading(false);
    }, [member]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentThread || !member) return;

        const sent = db.messaging.sendMessage({
            threadId: currentThread.id,
            senderId: member.id,
            senderName: member.name || 'Miembro',
            senderRole: member.role,
            text: newMessage.trim(),
            type: 'Text'
        });

        setMessages(prev => [...prev, sent]);
        setNewMessage('');
    };

    if (loading) return (
        <div className="h-[500px] flex items-center justify-center text-slate-400">
            <Loader2 className="animate-spin" size={32} />
        </div>
    );

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 h-[600px] flex flex-col overflow-hidden animate-fade-in-up">
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cafh-indigo rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cafh-indigo/20">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-slate-800">Counselling & Acompañante</h3>
                        <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Soporte en línea
                        </p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Canal Directo</span>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 scroll-smooth"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-4 opacity-60">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm">
                            <MessageSquare size={32} />
                        </div>
                        <p className="text-sm text-slate-500">Inicia una conversación con tu acompañante. Estamos aquí para asistirte en tu camino.</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMember = msg.senderId === member?.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMember ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm ${isMember
                                    ? 'bg-cafh-indigo text-white rounded-tr-none shadow-cafh-indigo/10'
                                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                    }`}>
                                    {!isMember && (
                                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-cafh-indigo">Acompañante Cafh</p>
                                    )}
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    <div className={`mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase opacity-60 ${isMember ? 'justify-end' : 'justify-start'}`}>
                                        <span>{new Date(msg.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                                        {isMember && (
                                            msg.status === 'Read' ? <CheckCircle2 size={10} className="text-cafh-cyan" /> : <Check size={10} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100 flex gap-4">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-cafh-indigo/20 focus:border-cafh-indigo transition-all"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-14 h-14 bg-cafh-indigo text-white rounded-2xl flex items-center justify-center shadow-xl shadow-cafh-indigo/20 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                    <Send size={24} />
                </button>
            </form>
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
    const [activeTab, setActiveTab] = useState<'resumen' | 'historial' | 'perfil' | 'mensajeria'>('resumen');
    const [profileForm, setProfileForm] = useState({ name: '', phone: '', city: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [enrollmentActivity, setEnrollmentActivity] = useState<any | null>(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [enrollSuccess, setEnrollSuccess] = useState(false);

    const navigate = useNavigate();

    // Unified check if user has done the journey or is already profiled (has interests)
    const isProfiled = !!wizardProfile || (currentUser?.interests && currentUser.interests.length > 0);

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
                // Resilient match: by ID or by Email (if ID was lost or regenerated)
                userWizardProfile = allProfiles.find(p => p.userId === user.id || p.wizardAnswers?.registered_email === user.email) || null;
            }
        } catch { /* ignore parse errors */ }
        setWizardProfile(userWizardProfile);

        // 3. Determine interests: wizard profile tags > user.interests > defaults
        const userInterests = (
            userWizardProfile?.derivedTags?.length ? userWizardProfile.derivedTags :
                user?.interests?.length ? user.interests :
                    [] // No default interests to avoid showing content to users without journey
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

        const featuredActivities = db.activities.getFeatured().map((a: any) => ({
            id: `act_${a.id}`,
            originalId: a.id,
            title: a.title,
            type: 'Event',
            tags: a.tags || [],
            date: a.startDate,
            url: a.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
            source: 'activity'
        }));

        const recommendations = (userWizardProfile || (user && user.interests && user.interests.length > 0)) ? [...contents, ...medias].filter(c =>
            c.tags.some((tag: string) => userInterests.includes(tag))
        ).slice(0, 6) : [];

        // 5. Load real blog posts and upcoming Presencial events (for "Novedades para ti")
        const allBlogPosts = db.blog.getAll();
        const allEvents = db.events.getAll();

        const upcomingPresencial = allEvents
            .filter(e => e.type === 'Presencial')
            .map(e => ({
                id: `evt_${e.id}`,
                title: `Evento Presencial: ${e.title}`,
                excerpt: `Ubicación: ${e.location}`,
                author: 'Cafh',
                date: e.date,
                imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
                tags: ['Evento']
            })) as any[];

        // Activities from the Activities Module (Featured)
        const activityNews = db.activities.getFeatured().map(a => ({
            id: `news_act_${a.id}`,
            title: a.title,
            imageUrl: a.imageUrl || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop',
            date: a.startDate,
            author: a.modality,
            tags: a.tags
        }));

        const combinedNews = [...activityNews, ...allBlogPosts, ...upcomingPresencial].slice(0, 3);
        setRecentBlogPosts(combinedNews as any);

        // 6. Find the next online or hybrid event that has a meeting URL (merging legacy and new activities)
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const newActs = db.activities.getAll().filter(a => a.status === 'Publicado' && (a.modality === 'Virtual' || a.modality === 'Híbrida') && a.zoomUrl);
        const mappedNewActs = newActs.map(a => {
            const d = new Date(a.startDate + 'T12:00:00');
            return {
                id: a.id,
                title: a.title,
                date: a.startDate,
                day: d.getDate().toString(),
                month: d.toLocaleDateString('es-CL', { month: 'short' }).toUpperCase(),
                time: `${a.startTime} – ${a.endTime}`,
                type: a.modality as any,
                meetingUrl: a.zoomUrl,
                location: 'Zoom / Online',
                color: 'bg-blue-600'
            };
        });

        const combinedEvents = [...mappedNewActs, ...allEvents];

        const upcomingEvent = combinedEvents
            .filter(e => {
                if ((e.type !== 'Online' && e.type !== 'Híbrido' && e.type !== 'Virtual' && e.type !== 'Híbrida') || !e.meetingUrl) return false;
                const eventDate = new Date(`${e.date}T00:00:00`);
                return isNaN(eventDate.getTime()) || eventDate >= now;
            })
            .sort((a, b) => {
                const da = new Date(`${a.date}T00:00:00`).getTime();
                const db = new Date(`${b.date}T00:00:00`).getTime();
                if (isNaN(da) && isNaN(db)) return 0;
                if (isNaN(da)) return 1;
                if (isNaN(db)) return -1;
                return da - db;
            })[0];

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
    }, [wizardProfile?.userId, currentUser]);

    const handleNewsClick = (post: any) => {
        if (post.id.startsWith('news_act_')) {
            const realId = post.id.replace('news_act_', '');
            const activity = db.activities.getById(realId);
            if (activity) {
                setEnrollmentActivity(activity);
                setEnrollSuccess(false);
            }
        }
    };

    const handleConfirmEnrollment = () => {
        if (!enrollmentActivity || !currentUser) return;
        setIsEnrolling(true);
        setTimeout(() => {
            db.gamification.recordParticipation({
                userId: currentUser.id,
                userEmail: currentUser.email,
                userName: currentUser.name,
                userType: 'Miembro',
                userTags: currentUser.interests || [],
                eventId: enrollmentActivity.id,
                eventTitle: enrollmentActivity.title,
                participatedAt: new Date().toISOString(),
                status: 'Inscrito',
                feedbackSubmitted: false,
                feedbackBlocksNext: false
            });
            setIsEnrolling(false);
            setEnrollSuccess(true);
            setHistory(db.user.getHistory());
        }, 1000);
    };

    const handleLogout = () => {
        db.auth.logout();
        navigate('/login');
    };

    const handleResourceClick = (res: any) => {
        if (res.source === 'activity' || res.type === 'Event') {
            navigate('/activities');
            return;
        }
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
            {/* Modal de Espera para Cuentas Pendientes */}
            {currentUser?.status === 'Pending' && createPortal(
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white/20 text-center relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cafh-cyan rounded-full mix-blend-screen opacity-20 blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cafh-peach rounded-full mix-blend-screen opacity-20 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-4xl font-sans font-bold text-white tracking-widest mb-8">Cafh</h2>
                            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 border border-white/10 shadow-lg">
                                <Sparkles size={36} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">¡Gracias por registrarte!</h3>
                            <p className="text-blue-50 text-base md:text-lg font-light leading-relaxed mb-8">
                                Hemos recibido tus datos. Nuestro equipo está confirmando tu identidad y membresía en la comunidad.
                                <br /><br />
                                <strong className="font-bold">Te enviaremos un correo electrónico</strong> cuando tu cuenta esté validada y lista para acceder a la Zona de Miembros.
                            </p>
                            <button onClick={handleLogout} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-all text-sm tracking-wide border border-white/20 flex items-center gap-2">
                                <LogOut size={16} /> Cerrar sesión y Volver
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal Popup Viewer */}
            {selectedResource && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedResource(null)}>
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
                </div>,
                document.body
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

                    <div className="flex flex-wrap justify-center gap-5">
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
                <div className="flex bg-white rounded-2xl p-2 shadow-lg w-full max-w-2xl border border-slate-100 mx-auto md:mx-0">
                    {[
                        { id: 'resumen', label: 'Resumen', icon: Grid },
                        { id: 'historial', label: 'Historial', icon: Clock },
                        { id: 'mensajeria', label: 'Mensajería', icon: MessageSquare },
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: Main Content based on Tab */}
                    <div className="lg:col-span-8 space-y-8">
                        {activeTab === 'resumen' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full">
                                {/* Journey Banner - Shown only if no profile */}
                                {!isProfiled && (
                                    <div className="mb-10 p-1 relative overflow-hidden group rounded-[2rem] animate-fade-in-up">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cafh-indigo to-blue-900 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-cafh-cyan/20 blur-3xl -mr-16 -mt-16"></div>
                                        <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-8 text-white text-center md:text-left">
                                            <div className="flex-1">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-white/20">
                                                    <Sparkles size={14} className="text-cafh-cyan" />
                                                    Personalización
                                                </div>
                                                <h3 className="text-3xl font-display font-bold mb-2">Comienza tu Viaje de Autoconocimiento</h3>
                                                <p className="text-blue-100/70 text-sm max-w-md leading-relaxed">
                                                    Al completar tu perfil, prepararemos una experiencia personalizada con contenidos, actividades y guías exclusivas basadas en tu momento actual.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => navigate('/?wizard=open')}
                                                className="px-8 py-4 bg-cafh-cyan text-cafh-indigo rounded-2xl font-bold hover:bg-white hover:scale-105 transition-all shadow-xl shadow-cafh-cyan/20 shrink-0 flex items-center gap-2 group/btn"
                                            >
                                                <span>Iniciar mi Viaje</span>
                                                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
                                        <Star className="text-cafh-peach fill-current" />
                                        Tu Biblioteca Personalizada
                                    </h2>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">
                                        {isProfiled ? 'Basado en tu perfil' : 'Contenidos destacados'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {recommendedContent.length > 0 ? recommendedContent.map(item => (
                                        <div key={item.id} onClick={() => handleResourceClick(item)} className="group border border-slate-100 rounded-2xl p-5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 items-start">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'Article' ? 'bg-blue-50 text-blue-600' :
                                                (item.type === 'Resource' || item.type === 'document') ? 'bg-green-50 text-green-600' :
                                                    item.type === 'audio' ? 'bg-purple-50 text-purple-600' :
                                                        item.type === 'Event' ? 'bg-orange-50 text-orange-600' :
                                                            'bg-red-50 text-red-600'
                                                }`}>
                                                {item.type === 'Article' ? <Feather size={20} /> : (item.type === 'Resource' || item.type === 'document') ? <Download size={20} /> : item.type === 'audio' ? <Play size={20} /> : item.type === 'Event' ? <Calendar size={20} /> : <Video size={20} />}
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded-full">{item.type}</span>
                                                <h4 className="font-bold text-slate-700 leading-tight mb-2 mt-2 group-hover:text-cafh-indigo transition-colors">{item.title}</h4>
                                                <span className="text-xs text-slate-400">Lectura / Consumo</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-1 md:col-span-2 py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm">
                                                <Sparkles size={30} className="text-cafh-cyan/50" />
                                            </div>
                                            <p className="text-slate-500 font-medium">No hay contenidos hasta que realices tu viaje</p>
                                            <p className="text-slate-400 text-sm mt-2">Personaliza tu experiencia completando el asistente.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'historial' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full">
                                <h2 className="text-2xl font-display font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Clock className="text-cafh-turquoise" />
                                    Tu Historial Completo
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

                        {activeTab === 'mensajeria' && (
                            <MemberChat member={currentUser} />
                        )}

                        {activeTab === 'perfil' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full relative overflow-hidden">
                                {/* Profile Badge Overlay - Only if wizard completed */}
                                {isProfiled && (
                                    <div className="absolute top-8 right-8 flex flex-col items-center animate-fade-in-up">
                                        <div className="w-16 h-16 bg-cafh-light rounded-[1.2rem] flex items-center justify-center text-3xl shadow-sm border border-slate-100 mb-2">
                                            {wizardProfile?.profileTypeName === 'Contemplativo' ? '🌿' :
                                                wizardProfile?.profileTypeName === 'Comunitario' ? '🤝' :
                                                    wizardProfile?.profileTypeName === 'Explorador' ? '📚' :
                                                        wizardProfile?.profileTypeName === 'Buscador Profundo' ? '🏔️' : '✨'}
                                        </div>
                                        <span className="text-[10px] font-bold text-cafh-indigo uppercase tracking-wider bg-cafh-indigo/10 px-2 py-0.5 rounded-full">Mi Perfil</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-cafh-indigo/10 rounded-2xl flex items-center justify-center text-cafh-indigo">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800 font-display">
                                            {wizardProfile ? wizardProfile.profileTypeName : isProfiled ? 'Miembro Perfilado' : 'Mi Información'}
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            {wizardProfile ? 'Perfil basado en tu Viaje de Autoconocimiento' : isProfiled ? 'Perfil basado en tus intereses previos' : 'Aún no has definido tu perfil.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Action button if no profile */}
                                    {!isProfiled && (
                                        <div className="p-5 bg-cafh-peach/10 border border-cafh-peach/20 rounded-2xl flex items-center justify-between gap-4">
                                            <p className="text-sm text-cafh-peach font-medium">Define tu perfil para una mejor experiencia.</p>
                                            <button
                                                onClick={() => navigate('/?wizard=open')}
                                                className="px-4 py-2 bg-cafh-peach text-white rounded-xl text-xs font-bold shadow-sm"
                                            >
                                                Comenzar Viaje
                                            </button>
                                        </div>
                                    )}
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
                                        <span className="text-xs text-slate-400">Datos vinculados a tu cuenta de acceso y CRM.</span>
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

                    {/* RIGHT COLUMN: Sidebar Tools (Always Visible) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Zoom Widget */}
                        <ZoomWidget
                            event={nextEvent}
                            userId={currentUser?.id || ''}
                            userName={currentUser?.name || 'Miembro'}
                        />

                        {/* News Feed */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Sparkles className="text-cafh-peach" size={18} />
                                Novedades para ti
                            </h3>
                            <div className="space-y-4">
                                {recentBlogPosts.length > 0 ? recentBlogPosts.map(post => (
                                    <div key={post.id}
                                        onClick={() => handleNewsClick(post)}
                                        className="flex gap-4 items-center group cursor-pointer border-b border-slate-50 pb-4 last:border-0 last:pb-0"
                                    >
                                        <div className="w-16 h-16 bg-slate-200 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-700 text-sm leading-tight group-hover:text-cafh-indigo line-clamp-2 transition-colors">{post.title}</h5>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{post.date} • {post.author}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-slate-400 text-sm italic">No hay novedades recientes para mostrar.</p>
                                )}
                            </div>
                        </div>

                        {/* Community Link / Quick Action */}
                        <div className="p-6 bg-gradient-to-br from-cafh-indigo to-blue-900 rounded-3xl text-white shadow-xl shadow-blue-900/10">
                            <h4 className="font-bold mb-2">Comunidad Cafh</h4>
                            <p className="text-xs text-blue-100/70 leading-relaxed mb-4">¿Tienes dudas o quieres contactar con tu acompañante? Estamos para asistirte.</p>
                            <button
                                onClick={() => setActiveTab('mensajeria')}
                                className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all"
                            >
                                ENVIAR MENSAJE
                            </button>
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

            {/* ENROLLMENT MODAL */}
            {enrollmentActivity && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEnrollmentActivity(null)} />
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 animate-fade-in-up">
                        <button onClick={() => setEnrollmentActivity(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20} /></button>

                        {!enrollSuccess ? (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-cafh-indigo/10 text-cafh-indigo rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Calendar size={32} />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">Inscribirse en Actividad</h3>
                                <p className="text-slate-500 mb-6 text-sm">{enrollmentActivity.title}</p>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left mb-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                        <Clock size={14} className="text-cafh-indigo" />
                                        <span>Detalles</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">{enrollmentActivity.startDate} · {enrollmentActivity.startTime}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{enrollmentActivity.modality} • {enrollmentActivity.category}</p>
                                </div>

                                <button
                                    onClick={handleConfirmEnrollment}
                                    disabled={isEnrolling}
                                    className="w-full py-4 bg-cafh-indigo text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-cafh-indigo/20 flex items-center justify-center gap-2"
                                >
                                    {isEnrolling ? <MoreVertical size={20} className="animate-spin" /> : 'Confirmar Inscripción'}
                                </button>
                                <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest">Se agregará a tu historial y ranking de puntos</p>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} strokeWidth={3} />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">¡Ya estás inscrito!</h3>
                                <p className="text-slate-500 mb-8 text-sm">La actividad ha sido añadida a tu historial. ¡Te esperamos!</p>
                                <button
                                    onClick={() => setEnrollmentActivity(null)}
                                    className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm"
                                >
                                    Volver al Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ChevronRight, Settings, Globe2, Bell, Lock, Users, Database, Compass, Tag, Package, Star, Sliders, CheckCircle2, AlertCircle, Film, Image as ImageIcon, Palette, History, ArrowRight, Globe } from 'lucide-react';
import { db, safeSetItem, KEYS } from '../storage';
import type { WizardQuestion, WizardOptionEditable, ProfileType, ProfileKitItem, SiteSettings, AdminUser, UserRole, WizardSplashConfig } from '../types';

// ─── DEFAULTS ────────────────────────────────────────────────
const DEFAULT_QUESTIONS: WizardQuestion[] = [
    {
        id: 'q1', order: 1, isActive: true, question: '¿Qué estás buscando en este momento de tu vida?', options: [
            { id: 'q1o1', label: 'Paz mental y reducción de estrés', value: 'peace', profileTags: ['Meditación', 'Bienestar'] },
            { id: 'q1o2', label: 'Sentido y propósito', value: 'purpose', profileTags: ['Mística', 'Filosofía'] },
            { id: 'q1o3', label: 'Comunidad y conexión', value: 'community', profileTags: ['Grupos', 'Voluntariado'] },
        ]
    },
    {
        id: 'q2', order: 2, isActive: true, question: '¿Cuánto tiempo puedes dedicar a tu desarrollo?', options: [
            { id: 'q2o1', label: 'Unos minutos al día', value: 'short', profileTags: ['Lecturas Breves', 'Podcast'] },
            { id: 'q2o2', label: 'Una hora a la semana', value: 'medium', profileTags: ['Reuniones', 'Cursos'] },
            { id: 'q2o3', label: 'Quiero ir a retiros', profileTags: ['Retiros'], value: 'long' },
        ]
    },
    {
        id: 'q3', order: 3, isActive: true, question: '¿Qué formato resuena más contigo?', options: [
            { id: 'q3o1', label: 'Leer y reflexionar en soledad', value: 'read', profileTags: ['Biblioteca', 'Blog'] },
            { id: 'q3o2', label: 'Escuchar y cerrar los ojos', value: 'listen', profileTags: ['Meditación Guiada', 'Podcast'] },
            { id: 'q3o3', label: 'Conversar con otros', value: 'talk', profileTags: ['Grupos', 'Diálogos'] },
        ]
    },
];

const DEFAULT_PROFILES: ProfileType[] = [
    { id: 'p1', name: 'Contemplativo', description: 'Busca paz interior y práctica meditativa.', emoji: '🌿', color: '#4f46e5', contentTags: ['Meditación', 'Bienestar', 'Podcast'], kitItems: [], crmTag: 'perfil-contemplativo' },
    { id: 'p2', name: 'Comunitario', description: 'Busca conexión, grupos y voluntariado.', emoji: '🤝', color: '#059669', contentTags: ['Grupos', 'Voluntariado', 'Diálogos'], kitItems: [], crmTag: 'perfil-comunitario' },
    { id: 'p3', name: 'Explorador', description: 'Busca conocimiento, lecturas y filosofía.', emoji: '📚', color: '#d97706', contentTags: ['Biblioteca', 'Blog', 'Filosofía', 'Mística'], kitItems: [], crmTag: 'perfil-explorador' },
    { id: 'p4', name: 'Buscador Profundo', description: 'Busca retiros y práctica intensa.', emoji: '🏔️', color: '#7c3aed', contentTags: ['Retiros', 'Mística', 'Estudio'], kitItems: [], crmTag: 'perfil-profundo' },
];

const DEFAULT_SETTINGS: SiteSettings = {
    siteName: 'Cafh Chile', siteDescription: 'Escuela de espiritualidad y desarrollo interior.', siteUrl: 'https://cafh.cl',
    logoUrl: '', faviconUrl: '', primaryColor: '#1e2f6b', accentColor: '#00d4d4', timezone: 'America/Santiago', language: 'es', maintenanceMode: false,
    socialLinks: { instagram: '', facebook: '', youtube: '', whatsapp: '', twitter: '' },
    seoTitle: 'Cafh Chile', seoDescription: 'Escuela de espiritualidad y desenvolvimiento interior.', ogImageUrl: '', gaId: '', gtmId: '', metaPixelId: '',
    notificationEmail: 'admin@cafh.cl', notifyOnSubscribe: true, notifyOnBounce: true, notifyOnAutomationFail: true, weeklyDigest: false,
};

const LS_QUESTIONS = 'cafh_journey_questions_v1';
const LS_PROFILES = 'cafh_journey_profiles_v1';
const LS_SETTINGS = 'cafh_site_settings_v1';

function loadLS<T>(key: string, def: T): T { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; } }
function saveLS(key: string, val: any) { safeSetItem(key, val); }

// ─── JOURNEY VIEW ─────────────────────────────────────────────
type JTab = 'questions' | 'profiles' | 'splash';

const LS_WIZARD_CONFIG = 'cafh_wizard_config_v1';

const DEFAULT_SPLASH: WizardSplashConfig = {
    title: '¡Bienvenido a tu camino!',
    message: 'Tu espacio personalizado está listo. Estamos preparando todo para ti...',
    bgColor: '#1e2f6b',
    bgType: 'color',
    bgImageUrl: '',
    bgVideoUrl: '',
    textColor: '#ffffff',
    durationSeconds: 4,
    redirectUrl: '/member/dashboard',
};

export const JourneyView: React.FC = () => {
    const [tab, setTab] = useState<JTab>('questions');
    const [questions, setQuestions] = useState<WizardQuestion[]>(() => loadLS(LS_QUESTIONS, DEFAULT_QUESTIONS));
    const [profiles, setProfiles] = useState<ProfileType[]>(() => loadLS(LS_PROFILES, DEFAULT_PROFILES));
    const [splashConfig, setSplashConfig] = useState<WizardSplashConfig>(() => {
        try {
            const raw = localStorage.getItem(LS_WIZARD_CONFIG);
            return raw ? { ...DEFAULT_SPLASH, ...JSON.parse(raw).splash } : DEFAULT_SPLASH;
        } catch { return DEFAULT_SPLASH; }
    });

    const [editQ, setEditQ] = useState<WizardQuestion | null>(null);
    const [editP, setEditP] = useState<ProfileType | null>(null);
    const [saved, setSaved] = useState(false);

    const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    const saveQuestions = (q: WizardQuestion[]) => { setQuestions(q); saveLS(LS_QUESTIONS, q); flash(); };
    const saveProfiles = (p: ProfileType[]) => { setProfiles(p); saveLS(LS_PROFILES, p); flash(); };
    const saveSplash = (cfg: WizardSplashConfig) => {
        setSplashConfig(cfg);
        saveLS(LS_WIZARD_CONFIG, { splash: cfg, isActive: true });
        flash();
    };

    const deleteQuestion = (id: string) => saveQuestions(questions.filter(q => q.id !== id));
    const deleteProfile = (id: string) => saveProfiles(profiles.filter(p => p.id !== id));

    const saveQuestion = (q: WizardQuestion) => {
        const exists = questions.find(x => x.id === q.id);
        saveQuestions(exists ? questions.map(x => x.id === q.id ? q : x) : [...questions, q]);
        setEditQ(null);
    };

    const saveProfile = (p: ProfileType) => {
        const exists = profiles.find(x => x.id === p.id);
        saveProfiles(exists ? profiles.map(x => x.id === p.id ? p : x) : [...profiles, p]);
        setEditP(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Compass size={24} className="text-cafh-indigo" /> Viaje Cafh</h2>
                    <p className="text-slate-500 mt-1">Diseña el flujo de incorporación y los perfiles de usuario.</p>
                </div>
                {saved && <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl"><CheckCircle2 size={16} /> Guardado</span>}
            </div>

            <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 w-fit shadow-sm">
                {([['questions', '📋 Preguntas del Wizard'], ['profiles', '🧬 Tipos de Perfil'], ['splash', '🎬 Splash Screen']] as [JTab, string][]).map(([t, l]) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t ? 'bg-cafh-indigo text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-800'}`}>{l}</button>
                ))}
            </div>

            {tab === 'questions' && (
                <div className="space-y-4">
                    {questions.sort((a, b) => a.order - b.order).map(q => (
                        <div key={q.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pregunta {q.order}</p>
                                    <h4 className="font-bold text-slate-800 text-lg">{q.question}</h4>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {q.options.map(o => (
                                            <div key={o.id} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
                                                <span className="font-bold text-slate-700">{o.label}</span>
                                                <span className="text-slate-400 ml-2">→ {o.profileTags.join(', ')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditQ(q)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500"><Edit size={16} /></button>
                                    <button onClick={() => deleteQuestion(q.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-400"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setEditQ({ id: `q${Date.now()}`, order: questions.length + 1, question: '', isActive: true, options: [] })}
                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-cafh-indigo hover:text-cafh-indigo transition-colors font-bold text-sm">
                        + Agregar Pregunta
                    </button>
                </div>
            )}

            {tab === 'profiles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profiles.map(p => (
                        <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: p.color + '20' }}>{p.emoji}</div>
                                    <div>
                                        <h4 className="font-bold text-slate-800" style={{ color: p.color }}>{p.name}</h4>
                                        <p className="text-xs text-slate-500">{p.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditP(p)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500"><Edit size={16} /></button>
                                    <button onClick={() => deleteProfile(p.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-400"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {p.contentTags.map(t => <span key={t} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-600">{t}</span>)}
                            </div>
                            <p className="text-xs text-slate-400 mt-3">CRM Tag: <strong className="text-slate-600">{p.crmTag}</strong></p>
                        </div>
                    ))}
                    <button onClick={() => setEditP({ id: `p${Date.now()}`, name: '', description: '', emoji: '✨', color: '#4f46e5', contentTags: [], kitItems: [], crmTag: '' })}
                        className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-slate-400 hover:border-cafh-indigo hover:text-cafh-indigo transition-colors font-bold text-sm flex items-center justify-center">
                        + Nuevo Tipo de Perfil
                    </button>
                </div>
            )}

            {tab === 'splash' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Film size={18} className="text-cafh-indigo" /> Configuración del Splash</h3>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Tipo de Fondo</label>
                            <div className="flex gap-2">
                                {(['color', 'image', 'video'] as const).map(type => (
                                    <button key={type} onClick={() => saveSplash({ ...splashConfig, bgType: type })}
                                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all capitalize ${splashConfig.bgType === type ? 'border-cafh-indigo bg-cafh-indigo/10 text-cafh-indigo' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}>
                                        {type === 'color' ? '🎨 Color' : type === 'image' ? '🖼️ Imagen' : '🎬 Video'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {splashConfig.bgType === 'color' && (
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Color de Fondo</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={splashConfig.bgColor}
                                        onChange={e => saveSplash({ ...splashConfig, bgColor: e.target.value })}
                                        className="w-12 h-10 rounded-xl border border-slate-200 cursor-pointer p-1" />
                                    <span className="text-sm font-mono text-slate-500">{splashConfig.bgColor}</span>
                                </div>
                            </div>
                        )}
                        {splashConfig.bgType === 'image' && (
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">URL de Imagen de Fondo</label>
                                <input type="url" value={splashConfig.bgImageUrl || ''}
                                    onChange={e => saveSplash({ ...splashConfig, bgImageUrl: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm font-mono" />
                            </div>
                        )}
                        {splashConfig.bgType === 'video' && (
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">URL de Video de Fondo (MP4)</label>
                                <input type="url" value={splashConfig.bgVideoUrl || ''}
                                    onChange={e => saveSplash({ ...splashConfig, bgVideoUrl: e.target.value })}
                                    placeholder="https://cdn.example.com/video.mp4"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm font-mono" />
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Color de Texto</label>
                            <div className="flex gap-3">
                                {['#ffffff', '#1e2f6b', '#f0f4ff', '#ffd700'].map(c => (
                                    <button key={c} onClick={() => saveSplash({ ...splashConfig, textColor: c })}
                                        style={{ backgroundColor: c, border: splashConfig.textColor === c ? '3px solid #6366f1' : '2px solid #e2e8f0' }}
                                        className="w-9 h-9 rounded-xl shadow-sm transition-transform hover:scale-110" />
                                ))}
                                <input type="color" value={splashConfig.textColor}
                                    onChange={e => saveSplash({ ...splashConfig, textColor: e.target.value })}
                                    className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-transparent" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Título del Splash</label>
                            <input type="text" value={splashConfig.title}
                                onChange={e => saveSplash({ ...splashConfig, title: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm font-medium" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Mensaje de Bienvenida</label>
                            <textarea value={splashConfig.message} rows={3}
                                onChange={e => saveSplash({ ...splashConfig, message: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm resize-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                                Duración: <strong className="text-cafh-indigo">{splashConfig.durationSeconds}s</strong>
                            </label>
                            <input type="range" min={2} max={10} step={1} value={splashConfig.durationSeconds}
                                onChange={e => saveSplash({ ...splashConfig, durationSeconds: Number(e.target.value) })}
                                className="w-full accent-cafh-indigo" />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Preview en vivo</p>
                        <div
                            className="relative rounded-2xl overflow-hidden aspect-[9/16] md:aspect-video shadow-xl border border-slate-200 flex flex-col items-center justify-center text-center p-8"
                            style={{
                                backgroundColor: splashConfig.bgType === 'color' ? splashConfig.bgColor : '#000',
                                backgroundImage: (splashConfig.bgType === 'image' && splashConfig.bgImageUrl) ? `url(${splashConfig.bgImageUrl})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {splashConfig.bgType === 'video' && splashConfig.bgVideoUrl && (
                                <video src={splashConfig.bgVideoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-70"></video>
                            )}
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="relative z-10" style={{ color: splashConfig.textColor }}>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{ backgroundColor: splashConfig.textColor + '22', border: `2px solid ${splashConfig.textColor}` }}>
                                    ✨
                                </div>
                                <h4 className="text-xl font-bold mb-2">{splashConfig.title || '¡Bienvenido!'}</h4>
                                <p className="text-sm opacity-80 leading-relaxed max-w-xs">{splashConfig.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editQ && <QuestionEditor q={editQ} onSave={saveQuestion} onClose={() => setEditQ(null)} />}
            {editP && <ProfileEditor p={editP} onSave={saveProfile} onClose={() => setEditP(null)} />}
        </div>
    );
};

const QuestionEditor: React.FC<{ q: WizardQuestion; onSave: (q: WizardQuestion) => void; onClose: () => void }> = ({ q, onSave, onClose }) => {
    const [data, setData] = useState<WizardQuestion>(q);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    useEffect(() => {
        const mTags = db.media.getAll().flatMap((m: any) => m.tags || []);
        const cTags = db.content.getAll().flatMap((c: any) => c.tags || []);
        const defaultTags = ['Meditación', 'Bienestar', 'Mística', 'Filosofía', 'Grupos', 'Voluntariado', 'Lecturas Breves', 'Podcast', 'Reuniones', 'Cursos', 'Retiros', 'Biblioteca', 'Blog', 'Meditación Guiada', 'Diálogos', 'Estudio'];
        setAvailableTags(Array.from(new Set([...mTags, ...cTags, ...defaultTags])).sort());
    }, []);
    const addOption = () => setData(d => ({ ...d, options: [...d.options, { id: `o${Date.now()}`, label: '', value: `opt${d.options.length + 1}`, profileTags: [] }] }));
    const updOption = (id: string, field: keyof WizardOptionEditable, val: any) => setData(d => ({ ...d, options: d.options.map(o => o.id === id ? { ...o, [field]: val } : o) }));
    const delOption = (id: string) => setData(d => ({ ...d, options: d.options.filter(o => o.id !== id) }));
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Editor de Pregunta</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Pregunta *</label>
                        <input value={data.question} onChange={e => setData(d => ({ ...d, question: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                    </div>
                    {data.options.map(o => (
                        <div key={o.id} className="bg-slate-50 rounded-xl p-3 space-y-2">
                            <div className="flex gap-2">
                                <input value={o.label} onChange={e => updOption(o.id, 'label', e.target.value)} placeholder="Texto" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                                <button onClick={() => delOption(o.id)} className="p-2 text-red-400"><Trash2 size={14} /></button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {availableTags.map(tag => {
                                    const isSelected = o.profileTags.includes(tag);
                                    return (
                                        <button key={tag} onClick={() => {
                                            const nextTags = isSelected ? o.profileTags.filter(t => t !== tag) : [...o.profileTags, tag];
                                            updOption(o.id, 'profileTags', nextTags);
                                        }} className={`px-2 py-1 rounded-md text-[10px] font-bold ${isSelected ? 'bg-cafh-indigo text-white' : 'bg-white text-slate-500'}`}>{tag}</button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    <button onClick={addOption} className="text-xs font-bold text-cafh-indigo">+ Agregar opción</button>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl">Cancelar</button>
                    <button onClick={() => onSave(data)} className="flex-[2] py-3 bg-cafh-indigo text-white rounded-xl font-bold">Guardar</button>
                </div>
            </div>
        </div>
    );
};

const ProfileEditor: React.FC<{ p: ProfileType; onSave: (p: ProfileType) => void; onClose: () => void }> = ({ p, onSave, onClose }) => {
    const [data, setData] = useState<ProfileType>(p);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    useEffect(() => {
        const mTags = db.media.getAll().flatMap((m: any) => m.tags || []);
        const cTags = db.content.getAll().flatMap((c: any) => c.tags || []);
        const defaultTags = ['Meditación', 'Bienestar', 'Mística', 'Filosofía', 'Grupos', 'Voluntariado', 'Lecturas Breves', 'Podcast', 'Reuniones', 'Cursos', 'Retiros', 'Biblioteca', 'Blog', 'Meditación Guiada', 'Diálogos', 'Estudio'];
        setAvailableTags(Array.from(new Set([...mTags, ...cTags, ...defaultTags])).sort());
    }, []);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold">Perfil</h3><button onClick={onClose}><X /></button></div>
                <div className="space-y-4">
                    <input value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} placeholder="Nombre" className="w-full px-4 py-3 bg-slate-50 border rounded-xl" />
                    <input value={data.emoji} onChange={e => setData(d => ({ ...d, emoji: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-center" />
                    <textarea value={data.description} onChange={e => setData(d => ({ ...d, description: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 border rounded-xl" />
                    <input type="color" value={data.color} onChange={e => setData(d => ({ ...d, color: e.target.value }))} className="w-full h-10" />
                    <div className="flex flex-wrap gap-1.5">
                        {availableTags.map(tag => {
                            const isSelected = data.contentTags.includes(tag);
                            return (
                                <button key={tag} onClick={() => {
                                    const nextTags = isSelected ? data.contentTags.filter(t => t !== tag) : [...data.contentTags, tag];
                                    setData(d => ({ ...d, contentTags: nextTags }));
                                }} className={`px-2 py-1.5 rounded-lg text-xs font-bold ${isSelected ? 'bg-cafh-indigo text-white' : 'bg-slate-50 text-slate-500'}`}>{tag}</button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 border rounded-xl">Cancelar</button>
                    <button onClick={() => onSave(data)} className="flex-[2] py-3 bg-cafh-indigo text-white rounded-xl font-bold">Guardar</button>
                </div>
            </div>
        </div>
    );
};

export const SettingsView: React.FC = () => {
    const [tab, setTab] = useState<STab>('general');
    const [settings, setSettings] = useState<SiteSettings>(() => loadLS(LS_SETTINGS, DEFAULT_SETTINGS));
    const [smtp, setSmtp] = useState(() => { try { const s = localStorage.getItem('cafh_smtp_config_v1'); return s ? JSON.parse(s) : { host: '', port: '587', secure: false, user: '', pass: '', fromEmail: '', fromName: '' }; } catch { return {}; } });
    const [saved, setSaved] = useState(false);
    const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
    const save = () => { saveLS(LS_SETTINGS, settings); saveLS('cafh_smtp_config_v1', smtp); flash(); };
    const set = (k: keyof SiteSettings, v: any) => setSettings(s => ({ ...s, [k]: v }));
    const setSocial = (k: string, v: string) => setSettings(s => ({ ...s, socialLinks: { ...s.socialLinks, [k]: v } }));

    const tabs: [STab, string, React.ElementType][] = [
        ['general', 'General', Settings],
        ['social', 'Social & SEO', Globe2],
        ['smtp', 'Email SMTP', Sliders],
        ['admins', 'Administradores', Users],
        ['notifications', 'Notificaciones', Bell],
        ['data', 'Datos & Export', Database],
        ['history', 'Histórico Global', History],
    ];

    const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
            {children}
        </div>
    );

    const Input = ({ value, onChange, placeholder = '', type = 'text', mono = false }: any) => (
        <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm ${mono ? 'font-mono' : 'font-medium'}`} />
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Settings size={24} className="text-cafh-indigo" /> Configuración</h2>
                </div>
                <div className="flex items-center gap-3">
                    {saved && <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl">Guardado</span>}
                    <button onClick={save} className="px-5 py-2.5 bg-cafh-indigo text-white rounded-xl font-bold text-sm">Guardar Cambios</button>
                </div>
            </div>

            <div className="flex gap-2 flex-wrap bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm w-fit">
                {tabs.map(([t, l, Icon]) => (
                    <button key={t} onClick={() => setTab(t)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold ${tab === t ? 'bg-cafh-indigo text-white shadow-lg' : 'text-slate-500'}`}>
                        <Icon size={14} /> {l}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 space-y-6">
                {tab === 'general' && (
                    <div className="grid grid-cols-2 gap-5">
                        <Field label="Nombre"><Input value={settings.siteName} onChange={(v: string) => set('siteName', v)} /></Field>
                        <Field label="URL"><Input value={settings.siteUrl} onChange={(v: string) => set('siteUrl', v)} mono /></Field>
                        <div className="col-span-2"><Field label="Descripción"><Input value={settings.siteDescription} onChange={(v: string) => set('siteDescription', v)} /></Field></div>
                    </div>
                )}

                {tab === 'social' && (
                    <div className="grid grid-cols-2 gap-5">
                        <Field label="Instagram"><Input value={settings.socialLinks.instagram} onChange={(v: string) => setSocial('instagram', v)} /></Field>
                        <Field label="Facebook"><Input value={settings.socialLinks.facebook} onChange={(v: string) => setSocial('facebook', v)} /></Field>
                    </div>
                )}

                {tab === 'smtp' && (
                    <div className="grid grid-cols-2 gap-5">
                        <Field label="Host"><Input value={smtp.host} onChange={(v: string) => setSmtp((s: any) => ({ ...s, host: v }))} mono /></Field>
                        <Field label="Puerto"><Input value={smtp.port} onChange={(v: string) => setSmtp((s: any) => ({ ...s, port: v }))} mono /></Field>
                        <Field label="Email"><Input value={smtp.user} onChange={(v: string) => setSmtp((s: any) => ({ ...s, user: v }))} mono /></Field>
                        <Field label="Pass"><Input value={smtp.pass} onChange={(v: string) => setSmtp((s: any) => ({ ...s, pass: v }))} type="password" /></Field>
                    </div>
                )}

                {tab === 'admins' && (
                    <div className="space-y-3">
                        <p className="text-sm text-slate-500">Administradores registrados en el sistema.</p>
                        <div className="p-4 bg-slate-50 border rounded-2xl flex justify-between items-center">
                            <span className="font-bold">admin@cafh.cl</span>
                            <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full">Super Admin</span>
                        </div>
                    </div>
                )}

                {tab === 'notifications' && (
                    <div className="space-y-4">
                        <Field label="Email de notificación"><Input value={settings.notificationEmail} onChange={(v: string) => set('notificationEmail', v)} mono /></Field>
                    </div>
                )}

                {tab === 'data' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">Datos & Respaldo</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => {
                                const keys = Object.keys(localStorage).filter(k => k.startsWith('cafh_'));
                                const data: any = {};
                                keys.forEach(k => { try { data[k] = JSON.parse(localStorage.getItem(k) || ''); } catch { } });
                                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a'); a.href = url; a.download = `cafh-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
                            }} className="p-6 bg-cafh-indigo text-white rounded-2xl font-bold flex items-center gap-3">
                                <Database size={24} /> Exportar toda la base de datos
                            </button>
                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                                <p className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-2"><Database size={16} /> Almacenamiento usado</p>
                                <p className="text-3xl font-extrabold text-cafh-indigo">{db.system.getStorageUsage().totalKB} KB</p>
                            </div>

                            <div className="col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mt-2">
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/30">
                                    <div className="flex items-center gap-2">
                                        <Globe size={18} className="text-emerald-600" />
                                        <h4 className="font-bold text-slate-800">Cloud Sync & Regla Superior</h4>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-full">
                                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">URL del JSON Externo</label>
                                            <div className="flex gap-2">
                                                <input id="remote_url_input" type="text" className="flex-1 px-4 py-2 bg-slate-50 border rounded-xl text-sm" defaultValue={db.system.getRemoteUrl()} onBlur={(e) => db.system.setRemoteUrl(e.target.value)} />
                                                <button onClick={() => {
                                                    const detected = "https://raw.githubusercontent.com/AXXIomaSPA/cafh/feature/unification-and-dashboard-refactor/external_db.json";
                                                    const input = document.getElementById('remote_url_input') as HTMLInputElement;
                                                    if (input) { input.value = detected; db.system.setRemoteUrl(detected); alert('URL Aplicada.'); }
                                                }} className="px-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase">⚡ Sugerir</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">GitHub Token</label>
                                            <input type="password" placeholder="ghp_xxxx" className="w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm" onChange={(e) => localStorage.setItem('cafh_github_token', e.target.value)} />
                                        </div>
                                        <div className="col-span-full pt-4 border-t flex items-center justify-between">
                                            <button onClick={async () => {
                                                const res = await (db.system as any).syncRemote('merge');
                                                if (res.status === 'success') alert(`Sincronización exitosa. Cambios: ${res.changes}`);
                                                else alert(`Error: ${res.message}`);
                                            }} className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg">🚀 Iniciar Sincronización</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'history' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">Historial Global</h3>
                        </div>
                        <div className="mt-6 space-y-4 max-h-[500px] overflow-y-auto">
                            {db.system.getHistory().length === 0 ? (
                                <div className="p-16 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <History className="mx-auto text-slate-300 mb-4" size={56} />
                                    <p className="text-slate-500 font-bold">Sin registros</p>
                                </div>
                            ) : (
                                db.system.getHistory().map((log: any) => (
                                    <div key={log.id} className="bg-white border rounded-3xl p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">{log.section}</span>
                                                    <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-800">{log.details}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{log.userName}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

type STab = 'general' | 'social' | 'admins' | 'smtp' | 'notifications' | 'data' | 'history';

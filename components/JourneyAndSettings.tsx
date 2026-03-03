import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ChevronRight, Settings, Globe2, Bell, Lock, Users, Database, Compass, Tag, Package, Star, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../storage';
import type { WizardQuestion, WizardOptionEditable, ProfileType, ProfileKitItem, SiteSettings, AdminUser, UserRole } from '../types';

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
            { id: 'q2o3', label: 'Quiero ir a retiros', value: 'long', profileTags: ['Retiros'] },
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
function saveLS(key: string, val: any) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { } }

// ─── JOURNEY VIEW ─────────────────────────────────────────────
type JTab = 'questions' | 'profiles';

export const JourneyView: React.FC = () => {
    const [tab, setTab] = useState<JTab>('questions');
    const [questions, setQuestions] = useState<WizardQuestion[]>(() => loadLS(LS_QUESTIONS, DEFAULT_QUESTIONS));
    const [profiles, setProfiles] = useState<ProfileType[]>(() => loadLS(LS_PROFILES, DEFAULT_PROFILES));

    // Question editing state
    const [editQ, setEditQ] = useState<WizardQuestion | null>(null);
    const [editP, setEditP] = useState<ProfileType | null>(null);
    const [saved, setSaved] = useState(false);

    const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    const saveQuestions = (q: WizardQuestion[]) => { setQuestions(q); saveLS(LS_QUESTIONS, q); flash(); };
    const saveProfiles = (p: ProfileType[]) => { setProfiles(p); saveLS(LS_PROFILES, p); flash(); };

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

            {/* Tabs */}
            <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 w-fit shadow-sm">
                {([['questions', '📋 Preguntas del Wizard'], ['profiles', '🧬 Tipos de Perfil']] as [JTab, string][]).map(([t, l]) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t ? 'bg-cafh-indigo text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-800'}`}>{l}</button>
                ))}
            </div>

            {/* Questions */}
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

            {/* Profiles */}
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

            {/* Question Editor Modal */}
            {editQ && <QuestionEditor q={editQ} onSave={saveQuestion} onClose={() => setEditQ(null)} />}
            {editP && <ProfileEditor p={editP} onSave={saveProfile} onClose={() => setEditP(null)} />}
        </div>
    );
};

// ─── QUESTION EDITOR ─────────────────────────────────────────
const QuestionEditor: React.FC<{ q: WizardQuestion; onSave: (q: WizardQuestion) => void; onClose: () => void }> = ({ q, onSave, onClose }) => {
    const [data, setData] = useState<WizardQuestion>(q);
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
                        <input value={data.question} onChange={e => setData(d => ({ ...d, question: e.target.value }))} placeholder="¿Qué estás buscando?" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm font-medium" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Opciones</label>
                        <div className="space-y-3">
                            {data.options.map(o => (
                                <div key={o.id} className="bg-slate-50 rounded-xl p-3 space-y-2">
                                    <div className="flex gap-2">
                                        <input value={o.label} onChange={e => updOption(o.id, 'label', e.target.value)} placeholder="Texto de la opción" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cafh-indigo" />
                                        <button onClick={() => delOption(o.id)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                    </div>
                                    <input value={o.profileTags.join(', ')} onChange={e => updOption(o.id, 'profileTags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} placeholder="Tags: Meditación, Paz, Bienestar" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-cafh-indigo text-slate-600" />
                                </div>
                            ))}
                        </div>
                        <button onClick={addOption} className="mt-2 text-xs font-bold text-cafh-indigo hover:underline">+ Agregar opción</button>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors">Cancelar</button>
                    <button onClick={() => onSave(data)} disabled={!data.question} className="flex-[2] py-3 bg-cafh-indigo text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-indigo-100 disabled:opacity-40">Guardar</button>
                </div>
            </div>
        </div>
    );
};

// ─── PROFILE EDITOR ──────────────────────────────────────────
const ProfileEditor: React.FC<{ p: ProfileType; onSave: (p: ProfileType) => void; onClose: () => void }> = ({ p, onSave, onClose }) => {
    const [data, setData] = useState<ProfileType>(p);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Tipo de Perfil</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Nombre *</label>
                            <input value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} placeholder="Contemplativo" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Emoji</label>
                            <input value={data.emoji} onChange={e => setData(d => ({ ...d, emoji: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm text-center text-xl" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Descripción</label>
                        <input value={data.description} onChange={e => setData(d => ({ ...d, description: e.target.value }))} placeholder="Busca paz interior..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={data.color} onChange={e => setData(d => ({ ...d, color: e.target.value }))} className="w-12 h-10 rounded-xl border border-slate-200 cursor-pointer p-1" />
                            <span className="text-sm font-mono text-slate-500">{data.color}</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Tags de Contenido (separados por coma)</label>
                        <input value={data.contentTags.join(', ')} onChange={e => setData(d => ({ ...d, contentTags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} placeholder="Meditación, Paz, Bienestar" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm" />
                        <p className="text-xs text-slate-400 mt-1">Los contenidos con estos tags aparecerán en el dashboard del usuario</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Tag CRM Automático</label>
                        <input value={data.crmTag} onChange={e => setData(d => ({ ...d, crmTag: e.target.value }))} placeholder="perfil-contemplativo" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm font-mono" />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors">Cancelar</button>
                    <button onClick={() => onSave(data)} disabled={!data.name} className="flex-[2] py-3 bg-cafh-indigo text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg disabled:opacity-40">Guardar Perfil</button>
                </div>
            </div>
        </div>
    );
};

// ─── SETTINGS VIEW ───────────────────────────────────────────
type STab = 'general' | 'social' | 'admins' | 'smtp' | 'notifications' | 'data';

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
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Settings size={24} className="text-cafh-indigo" /> Configuración del Sitio</h2>
                    <p className="text-slate-500 mt-1">Panel de control completo de la plataforma.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl"><CheckCircle2 size={16} /> Guardado</span>}
                    <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 bg-cafh-indigo text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-all shadow-lg shadow-indigo-100">
                        <Settings size={16} /> Guardar Cambios
                    </button>
                </div>
            </div>

            <div className="flex gap-2 flex-wrap bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm w-fit">
                {tabs.map(([t, l, Icon]) => (
                    <button key={t} onClick={() => setTab(t)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? 'bg-cafh-indigo text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-800'}`}>
                        <Icon size={14} /> {l}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 space-y-6">
                {tab === 'general' && <>
                    <h3 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">General & Branding</h3>
                    <div className="grid grid-cols-2 gap-5">
                        <Field label="Nombre del sitio"><Input value={settings.siteName} onChange={(v: string) => set('siteName', v)} /></Field>
                        <Field label="URL del sitio"><Input value={settings.siteUrl} onChange={(v: string) => set('siteUrl', v)} placeholder="https://cafh.cl" mono /></Field>
                        <div className="col-span-2"><Field label="Descripción"><Input value={settings.siteDescription} onChange={(v: string) => set('siteDescription', v)} /></Field></div>
                        <Field label="Color Principal">
                            <div className="flex items-center gap-3">
                                <input type="color" value={settings.primaryColor} onChange={e => set('primaryColor', e.target.value)} className="w-12 h-10 rounded-xl border border-slate-200 cursor-pointer p-1" />
                                <span className="text-sm font-mono text-slate-500">{settings.primaryColor}</span>
                            </div>
                        </Field>
                        <Field label="Color Acento">
                            <div className="flex items-center gap-3">
                                <input type="color" value={settings.accentColor} onChange={e => set('accentColor', e.target.value)} className="w-12 h-10 rounded-xl border border-slate-200 cursor-pointer p-1" />
                                <span className="text-sm font-mono text-slate-500">{settings.accentColor}</span>
                            </div>
                        </Field>
                        <Field label="Zona Horaria">
                            <select value={settings.timezone} onChange={e => set('timezone', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm">
                                <option value="America/Santiago">América/Santiago (UTC-3/4)</option>
                                <option value="America/Buenos_Aires">América/Buenos Aires (UTC-3)</option>
                                <option value="America/Mexico_City">América/México (UTC-6)</option>
                                <option value="Europe/Madrid">Europa/Madrid (UTC+1/2)</option>
                            </select>
                        </Field>
                        <Field label="Modo Mantenimiento">
                            <button onClick={() => set('maintenanceMode', !settings.maintenanceMode)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm border-2 transition-all ${settings.maintenanceMode ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                                {settings.maintenanceMode ? '🔴 Activado' : '🟢 Desactivado'}
                            </button>
                        </Field>
                    </div>
                </>}

                {tab === 'social' && <>
                    <h3 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">Redes Sociales & SEO</h3>
                    <div className="grid grid-cols-2 gap-5">
                        <Field label="Instagram"><Input value={settings.socialLinks.instagram} onChange={(v: string) => setSocial('instagram', v)} placeholder="https://instagram.com/cafhchile" /></Field>
                        <Field label="Facebook"><Input value={settings.socialLinks.facebook} onChange={(v: string) => setSocial('facebook', v)} placeholder="https://facebook.com/cafhchile" /></Field>
                        <Field label="YouTube"><Input value={settings.socialLinks.youtube} onChange={(v: string) => setSocial('youtube', v)} placeholder="https://youtube.com/@cafh" /></Field>
                        <Field label="WhatsApp"><Input value={settings.socialLinks.whatsapp} onChange={(v: string) => setSocial('whatsapp', v)} placeholder="+56912345678" /></Field>
                        <div className="col-span-2 pt-4 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-600 mb-4">Meta & SEO Global</h4>
                        </div>
                        <Field label="Título SEO"><Input value={settings.seoTitle} onChange={(v: string) => set('seoTitle', v)} /></Field>
                        <Field label="Google Analytics ID (G-XXXXXX)"><Input value={settings.gaId} onChange={(v: string) => set('gaId', v)} placeholder="G-XXXXXXXXXX" mono /></Field>
                        <div className="col-span-2"><Field label="Descripción SEO (150 chars max)"><Input value={settings.seoDescription} onChange={(v: string) => set('seoDescription', v)} /></Field></div>
                        <Field label="Google Tag Manager ID"><Input value={settings.gtmId} onChange={(v: string) => set('gtmId', v)} placeholder="GTM-XXXXXXX" mono /></Field>
                        <Field label="Meta Pixel ID"><Input value={settings.metaPixelId} onChange={(v: string) => set('metaPixelId', v)} placeholder="XXXXXXXXXXXXXXXXXX" mono /></Field>
                    </div>
                </>}

                {tab === 'smtp' && <>
                    <h3 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">Configuración SMTP — cPanel</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700 font-medium mb-4">
                        ℹ️ Los emails se envían a través del servidor cPanel. Configurá las credenciales SMTP de tu hosting.
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <Field label="Host SMTP"><Input value={smtp.host} onChange={(v: string) => setSmtp((s: any) => ({ ...s, host: v }))} placeholder="mail.tudominio.cl" mono /></Field>
                        <Field label="Puerto"><Input value={smtp.port} onChange={(v: string) => setSmtp((s: any) => ({ ...s, port: v }))} placeholder="587" mono /></Field>
                        <Field label="Usuario"><Input value={smtp.user} onChange={(v: string) => setSmtp((s: any) => ({ ...s, user: v }))} placeholder="noreply@cafh.cl" mono /></Field>
                        <Field label="Contraseña"><Input value={smtp.pass} onChange={(v: string) => setSmtp((s: any) => ({ ...s, pass: v }))} type="password" placeholder="••••••••" /></Field>
                        <Field label="From Email"><Input value={smtp.fromEmail} onChange={(v: string) => setSmtp((s: any) => ({ ...s, fromEmail: v }))} placeholder="noreply@cafh.cl" mono /></Field>
                        <Field label="From Name"><Input value={smtp.fromName} onChange={(v: string) => setSmtp((s: any) => ({ ...s, fromName: v }))} placeholder="Cafh Chile" /></Field>
                        <Field label="TLS / SSL">
                            <button onClick={() => setSmtp((s: any) => ({ ...s, secure: !s.secure }))}
                                className={`px-4 py-3 rounded-xl font-bold text-sm border-2 transition-all ${smtp.secure ? 'border-emerald-300 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                                {smtp.secure ? '🔒 TLS Activado' : '🔓 TLS Desactivado'}
                            </button>
                        </Field>
                    </div>
                </>}

                {tab === 'admins' && <>
                    <h3 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">Administradores del Sistema</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'Administrador Principal', email: 'admin@cafh.cl', role: 'Super Admin', active: true, last: 'Hoy' },
                            { name: 'Editor Contenidos', email: 'editor@cafh.cl', role: 'Editor', active: true, last: 'Aye' },
                        ].map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-cafh-indigo text-white flex items-center justify-center font-bold text-sm">{u.name[0]}</div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                                        <p className="text-xs text-slate-400">{u.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold px-2.5 py-1 bg-cafh-indigo/10 text-cafh-indigo rounded-full">{u.role}</span>
                                    <span className="text-xs text-slate-400">Último acceso: {u.last}</span>
                                    <span className={`w-2 h-2 rounded-full ${u.active ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-cafh-indigo hover:text-cafh-indigo transition-colors font-bold text-sm">
                            + Invitar Administrador
                        </button>
                    </div>
                </>}

                {tab === 'notifications' && <>
                    <h3 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">Notificaciones del Sistema</h3>
                    <div className="space-y-4">
                        <Field label="Email de notificaciones internas"><Input value={settings.notificationEmail} onChange={(v: string) => set('notificationEmail', v)} placeholder="admin@cafh.cl" mono /></Field>
                        <div className="space-y-3 pt-2">
                            {([
                                ['notifyOnSubscribe', '📨 Notificar cuando alguien se suscribe'],
                                ['notifyOnBounce', '⚠️ Notificar cuando hay un rebote de email'],
                                ['notifyOnAutomationFail', '🔴 Notificar cuando una automatización falla'],
                                ['weeklyDigest', '📊 Resumen semanal automático por email'],
                            ] as [keyof SiteSettings, string][]).map(([k, label]) => (
                                <div key={k} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <span className="text-sm font-medium text-slate-700">{label}</span>
                                    <button onClick={() => set(k, !settings[k])}
                                        className={`w-12 h-6 rounded-full transition-all relative ${settings[k] ? 'bg-cafh-indigo' : 'bg-slate-200'}`}>
                                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings[k] ? 'left-6' : 'left-0.5'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>}

                {tab === 'data' && <>
                    <h3 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">Datos & Respaldo</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => {
                            const keys = Object.keys(localStorage).filter(k => k.startsWith('cafh_'));
                            const data: any = {};
                            keys.forEach(k => { try { data[k] = JSON.parse(localStorage.getItem(k) || ''); } catch { } });
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a'); a.href = url; a.download = `cafh-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
                        }} className="p-6 bg-cafh-indigo text-white rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-indigo-100 flex items-center gap-3">
                            <Database size={24} /> Exportar toda la base de datos
                        </button>
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                            <p className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-2"><Database size={16} /> Almacenamiento usado</p>
                            <p className="text-3xl font-extrabold text-cafh-indigo">{(JSON.stringify(localStorage).length / 1024).toFixed(0)} KB</p>
                            <p className="text-xs text-slate-400 mt-1">de ~5 MB disponibles en localStorage</p>
                        </div>
                        <div className="col-span-2 bg-red-50 border border-red-200 rounded-2xl p-5">
                            <p className="text-sm font-bold text-red-700 mb-1">⚠️ Zona de Peligro</p>
                            <p className="text-xs text-red-500 mb-3">Estas acciones son irreversibles. Úsalas solo en desarrollo.</p>
                            <button onClick={() => { if (confirm('¿Limpiar logs de email? Esta acción es irreversible.')) { localStorage.removeItem('cafh_email_logs_v1'); alert('Logs eliminados.'); } }}
                                className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold text-xs hover:bg-red-200 transition-colors">
                                Limpiar Email Logs
                            </button>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    );
};

import React, { useState, useEffect, useCallback } from 'react';
import {
    Video, Plus, Edit, Trash2, Save, X, Calendar, Clock,
    User, Users, Link2, Star, Award, ChevronUp, ChevronDown,
    GripVertical, FileText, Music, Image as ImageIcon, Film,
    Search, Download, CheckCircle2, AlertCircle, BarChart2,
    Settings, MessageSquare, List, Trophy, Medal, Sparkles,
    ExternalLink, Eye, ArrowLeft, RefreshCw, BookOpen, Mic
} from 'lucide-react';
import { db } from '../storage';
import {
    CalendarEvent, MeetingAgendaItem, MeetingMediaRef, ZoomWidgetConfig,
    FeedbackQuestion, FeedbackResponse, MemberBadge, BadgeType, ParticipationRecord,
    Contact, MediaAsset
} from '../types';

// ============================================================
// ZOOM LOGO SVG (oficial, colores correctos)
// ============================================================
const ZoomLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#2D8CFF" />
        <path d="M6 14C6 11.79 7.79 10 10 10H22C24.21 10 26 11.79 26 14V26C26 28.21 24.21 30 22 30H10C7.79 30 6 28.21 6 26V14Z" fill="white" />
        <path d="M28 16L34 12V28L28 24V16Z" fill="white" />
    </svg>
);

// ============================================================
// BADGE CONFIG
// ============================================================
const BADGE_CONFIG: Record<BadgeType, { emoji: string; label: string; color: string; points: number }> = {
    estrella: { emoji: '⭐', label: 'Estrella', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', points: 20 },
    medalla_bronce: { emoji: '🥉', label: 'Bronce', color: 'bg-orange-50 text-orange-700 border-orange-200', points: 30 },
    medalla_plata: { emoji: '🥈', label: 'Plata', color: 'bg-slate-50 text-slate-700 border-slate-200', points: 50 },
    medalla_oro: { emoji: '🥇', label: 'Oro', color: 'bg-amber-50 text-amber-700 border-amber-200', points: 80 },
    especial: { emoji: '🏆', label: 'Especial', color: 'bg-purple-50 text-purple-700 border-purple-200', points: 100 },
};

// ============================================================
// SHARED UI PRIMITIVES
// ============================================================
const TabBar: React.FC<{
    tabs: { id: string; label: string; icon: React.ReactNode }[];
    active: string;
    onChange: (id: string) => void;
}> = ({ tabs, active, onChange }) => (
    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
            <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${active === t.id
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                {t.icon}
                {t.label}
            </button>
        ))}
    </div>
);

const SectionCard: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }> = ({
    title, subtitle, action, children, className = ''
}) => (
    <div className={`bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden ${className}`}>
        <div className="px-7 py-5 border-b border-slate-50 flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
        <div className="p-7">{children}</div>
    </div>
);

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
        <input
            {...props}
            className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cafh-indigo/30 focus:border-cafh-indigo transition-all ${props.className || ''}`}
        />
    </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
        <select
            {...props}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cafh-indigo/30 focus:border-cafh-indigo transition-all"
        >
            {children}
        </select>
    </div>
);

// ============================================================
// TAB 1: MEETINGS CRUD
// ============================================================
const MeetingsTab: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaSearch, setMediaSearch] = useState('');

    const emptyForm = (): Partial<CalendarEvent> => ({
        title: '', date: '', time: '', location: 'Online',
        type: 'Online', color: '#4f46e5', platform: 'Zoom',
        meetingUrl: '', eventStatus: 'Programada',
        organizerContactId: '', agendaItems: [], mediaRefs: [],
    });
    const [form, setForm] = useState<Partial<CalendarEvent>>(emptyForm());

    useEffect(() => {
        setEvents(db.meetings.getAll().filter(e => e.platform === 'Zoom' || e.type === 'Online'));
        setContacts(db.crm.getAll());
        setMediaAssets(db.media.getAll());
    }, []);

    const refresh = () => setEvents(db.meetings.getAll().filter(e => e.platform === 'Zoom' || e.type === 'Online'));

    const openNew = () => { setForm(emptyForm()); setEditingEvent(null); setShowForm(true); };
    const openEdit = (ev: CalendarEvent) => { setForm({ ...ev }); setEditingEvent(ev); setShowForm(true); };

    const handleSave = () => {
        if (!form.title || !form.date) return;
        const dateObj = new Date(form.date + 'T12:00:00');
        const payload: CalendarEvent = {
            id: editingEvent?.id || `ev_${Date.now()}`,
            title: form.title || '',
            date: form.date || '',
            day: dateObj.getDate().toString(),
            month: dateObj.toLocaleDateString('es-CL', { month: 'short' }),
            time: form.time || '',
            location: 'Online',
            type: 'Online',
            color: '#4f46e5',
            platform: 'Zoom',
            meetingUrl: form.meetingUrl || '',
            eventStatus: form.eventStatus || 'Programada',
            organizerContactId: form.organizerContactId,
            agendaItems: form.agendaItems || [],
            mediaRefs: form.mediaRefs || [],
        };
        db.meetings.save(payload);
        refresh();
        setShowForm(false);
    };

    // Agenda management
    const addAgendaItem = () => {
        const items = form.agendaItems || [];
        setForm(prev => ({ ...prev, agendaItems: [...items, { id: `ag_${Date.now()}`, order: items.length + 1, title: '', durationMinutes: 15 }] }));
    };
    const updateAgendaItem = (idx: number, field: keyof MeetingAgendaItem, value: any) => {
        const items = [...(form.agendaItems || [])];
        items[idx] = { ...items[idx], [field]: value };
        setForm(prev => ({ ...prev, agendaItems: items }));
    };
    const removeAgendaItem = (idx: number) => {
        const items = (form.agendaItems || []).filter((_, i) => i !== idx);
        setForm(prev => ({ ...prev, agendaItems: items }));
    };
    const moveAgendaItem = (idx: number, dir: 'up' | 'down') => {
        const items = [...(form.agendaItems || [])];
        const swap = dir === 'up' ? idx - 1 : idx + 1;
        if (swap < 0 || swap >= items.length) return;
        [items[idx], items[swap]] = [items[swap], items[idx]];
        setForm(prev => ({ ...prev, agendaItems: items }));
    };

    // Media ref
    const addMediaRef = (asset: MediaAsset) => {
        const refs = form.mediaRefs || [];
        if (refs.some(r => r.mediaAssetId === asset.id)) return;
        setForm(prev => ({ ...prev, mediaRefs: [...refs, { mediaAssetId: asset.id, label: asset.name }] }));
        setShowMediaPicker(false);
    };
    const removeMediaRef = (assetId: string) => {
        setForm(prev => ({ ...prev, mediaRefs: (prev.mediaRefs || []).filter(r => r.mediaAssetId !== assetId) }));
    };
    const getAssetIcon = (type?: string) => {
        if (type === 'document') return <FileText size={14} />;
        if (type === 'audio') return <Music size={14} />;
        if (type === 'video') return <Film size={14} />;
        return <ImageIcon size={14} />;
    };

    const filteredMedia = mediaAssets.filter(a =>
        a.name.toLowerCase().includes(mediaSearch.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(mediaSearch.toLowerCase()))
    );

    const statusColors: Record<string, string> = {
        'Programada': 'bg-blue-50 text-blue-700',
        'En curso': 'bg-emerald-50 text-emerald-700',
        'Finalizada': 'bg-slate-100 text-slate-500',
    };

    return (
        <div className="space-y-6">
            {!showForm ? (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Reuniones Virtuales Zoom</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Gestiona las sesiones virtuales de la comunidad.</p>
                        </div>
                        <button onClick={openNew} className="flex items-center gap-2 bg-cafh-indigo text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20">
                            <Plus size={16} /> Nueva Reunión
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {events.length === 0 ? (
                            <div className="bg-white rounded-[2rem] border border-slate-100 py-16 text-center">
                                <Video size={40} className="text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 text-sm font-medium">No hay reuniones creadas aún.</p>
                                <button onClick={openNew} className="mt-4 text-cafh-indigo text-sm font-bold hover:underline">Crear la primera reunión →</button>
                            </div>
                        ) : events.map(ev => {
                            const organizer = contacts.find(c => c.id === ev.organizerContactId);
                            return (
                                <div key={ev.id} className="bg-white rounded-[1.5rem] border border-slate-100 p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <ZoomLogo size={28} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-bold text-slate-800 truncate">{ev.title}</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[ev.eventStatus || 'Programada']}`}>
                                                {ev.eventStatus || 'Programada'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-400">
                                            <span className="flex items-center gap-1"><Calendar size={11} /> {ev.date}</span>
                                            <span className="flex items-center gap-1"><Clock size={11} /> {ev.time}</span>
                                            {organizer && <span className="flex items-center gap-1"><User size={11} /> {organizer.name}</span>}
                                            {ev.agendaItems?.length ? <span className="flex items-center gap-1"><List size={11} /> {ev.agendaItems.length} puntos de agenda</span> : null}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {ev.meetingUrl && (
                                            <a href={ev.meetingUrl} target="_blank" rel="noopener noreferrer"
                                                className="p-2 text-slate-400 hover:text-cafh-indigo transition-colors" title="Abrir Zoom">
                                                <ExternalLink size={15} />
                                            </a>
                                        )}
                                        <button onClick={() => openEdit(ev)} className="p-2 text-slate-400 hover:text-cafh-indigo transition-colors"><Edit size={15} /></button>
                                        <button onClick={() => { db.meetings.delete(ev.id); refresh(); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                /* ── FORM ── */
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                            <ArrowLeft size={20} className="text-slate-500" />
                        </button>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{editingEvent ? 'Editar Reunión' : 'Nueva Reunión Zoom'}</h3>
                            <p className="text-sm text-slate-500">Configura todos los detalles de la sesión.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ─ Left column: basic info ─ */}
                        <div className="lg:col-span-2 space-y-5">
                            <SectionCard title="Información General">
                                <div className="space-y-4">
                                    <InputField label="Título de la sesión" value={form.title || ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Ej: Encuentro semanal de meditación" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField label="Fecha" type="date" value={form.date || ''} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                                        <InputField label="Hora" type="time" value={form.time || ''} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
                                    </div>
                                    <SelectField label="Estado" value={form.eventStatus || 'Programada'} onChange={e => setForm(p => ({ ...p, eventStatus: e.target.value as any }))}>
                                        <option value="Programada">Programada</option>
                                        <option value="En curso">En curso</option>
                                        <option value="Finalizada">Finalizada</option>
                                    </SelectField>
                                    <SelectField label="Organizador (desde CRM)" value={form.organizerContactId || ''} onChange={e => setForm(p => ({ ...p, organizerContactId: e.target.value }))}>
                                        <option value="">Sin organizador</option>
                                        {contacts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
                                    </SelectField>
                                    <InputField label="Link de Zoom (pegar manualmente)" value={form.meetingUrl || ''} onChange={e => setForm(p => ({ ...p, meetingUrl: e.target.value }))} placeholder="https://zoom.us/j/..." />
                                </div>
                            </SectionCard>

                            {/* ─ Agenda ─ */}
                            <SectionCard title="Agenda de la Sesión" subtitle="Orden y duración de cada punto" action={
                                <button onClick={addAgendaItem} className="flex items-center gap-1.5 text-xs font-bold text-cafh-indigo hover:text-blue-800 transition-colors">
                                    <Plus size={13} /> Agregar punto
                                </button>
                            }>
                                {(form.agendaItems || []).length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-6">Sin puntos de agenda. Agrega el primero.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {(form.agendaItems || []).map((item, idx) => (
                                            <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                                                <div className="text-slate-300"><GripVertical size={16} /></div>
                                                <span className="text-xs font-bold text-slate-400 w-5 shrink-0">{idx + 1}.</span>
                                                <input
                                                    value={item.title}
                                                    onChange={e => updateAgendaItem(idx, 'title', e.target.value)}
                                                    placeholder="Título del punto"
                                                    className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 focus:outline-none"
                                                />
                                                <input
                                                    type="number"
                                                    value={item.durationMinutes}
                                                    onChange={e => updateAgendaItem(idx, 'durationMinutes', parseInt(e.target.value) || 0)}
                                                    className="w-16 text-center bg-white border border-slate-200 rounded-lg text-xs px-2 py-1 focus:outline-none"
                                                    min={1}
                                                />
                                                <span className="text-xs text-slate-400 shrink-0">min</span>
                                                <div className="flex flex-col gap-0.5">
                                                    <button onClick={() => moveAgendaItem(idx, 'up')} disabled={idx === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronUp size={12} /></button>
                                                    <button onClick={() => moveAgendaItem(idx, 'down')} disabled={idx === (form.agendaItems || []).length - 1} className="text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronDown size={12} /></button>
                                                </div>
                                                <button onClick={() => removeAgendaItem(idx)} className="text-slate-300 hover:text-red-400 transition-colors"><X size={14} /></button>
                                            </div>
                                        ))}
                                        <div className="text-right text-xs text-slate-400 pt-1">
                                            Total: <strong>{(form.agendaItems || []).reduce((a, b) => a + b.durationMinutes, 0)} min</strong>
                                        </div>
                                    </div>
                                )}
                            </SectionCard>

                            {/* ─ Material de apoyo ─ */}
                            <SectionCard title="Material de Apoyo" subtitle="Referencias a la Biblioteca de Medios (solo lectura)" action={
                                <button onClick={() => { setMediaSearch(''); setShowMediaPicker(true); }} className="flex items-center gap-1.5 text-xs font-bold text-cafh-indigo hover:text-blue-800">
                                    <Plus size={13} /> Vincular archivo
                                </button>
                            }>
                                {(form.mediaRefs || []).length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-4">Sin material adjunto.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {(form.mediaRefs || []).map(ref => {
                                            const asset = mediaAssets.find(a => a.id === ref.mediaAssetId);
                                            return (
                                                <div key={ref.mediaAssetId} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100 text-slate-400">
                                                        {getAssetIcon(asset?.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-700 truncate">{ref.label || asset?.name || ref.mediaAssetId}</p>
                                                        <p className="text-xs text-slate-400">{asset?.type} · {asset?.size}</p>
                                                    </div>
                                                    <button onClick={() => removeMediaRef(ref.mediaAssetId)} className="text-slate-300 hover:text-red-400"><X size={14} /></button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </SectionCard>
                        </div>

                        {/* ─ Right column: widget config ─ */}
                        <div className="space-y-5">
                            <SectionCard title="Widget en Perfil del Miembro" subtitle="Cómo se ve en el dashboard del miembro">
                                <div className="space-y-4">
                                    {/* Preview */}
                                    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700">
                                        <div className="flex items-center gap-3 mb-3">
                                            <ZoomLogo size={24} />
                                            <div>
                                                <p className="text-white text-xs font-bold">{form.title || 'Título de la sesión'}</p>
                                                <p className="text-slate-400 text-[10px]">{form.time || '--:--'} · {form.date || 'Sin fecha'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-emerald-500/10 rounded-xl p-2.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                            <span className="text-emerald-400 text-xs font-bold">Sala disponible</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 text-center">Vista previa del widget en el perfil del miembro</p>
                                </div>
                            </SectionCard>

                            <div className="flex gap-3">
                                <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
                                    Cancelar
                                </button>
                                <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 bg-cafh-indigo text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20">
                                    <Save size={15} /> Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Media Picker Modal ── */}
            {showMediaPicker && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-800">Biblioteca de Medios</h4>
                                <p className="text-xs text-slate-400">Solo lectura — selecciona un archivo para vincular</p>
                            </div>
                            <button onClick={() => setShowMediaPicker(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"><X size={18} /></button>
                        </div>
                        <div className="px-7 py-3 border-b border-slate-50">
                            <div className="relative">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={mediaSearch}
                                    onChange={e => setMediaSearch(e.target.value)}
                                    placeholder="Buscar por nombre o etiqueta..."
                                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cafh-indigo/30"
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto p-7 space-y-2">
                            {filteredMedia.length === 0 ? (
                                <p className="text-center text-slate-400 text-sm py-8">Sin resultados.</p>
                            ) : filteredMedia.map(asset => (
                                <div
                                    key={asset.id}
                                    onClick={() => addMediaRef(asset)}
                                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all duration-150 ${(form.mediaRefs || []).some(r => r.mediaAssetId === asset.id)
                                            ? 'border-cafh-indigo bg-blue-50'
                                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                        {getAssetIcon(asset.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-700 truncate">{asset.name}</p>
                                        <p className="text-xs text-slate-400">{asset.type} · {asset.size}</p>
                                    </div>
                                    {(form.mediaRefs || []).some(r => r.mediaAssetId === asset.id) && (
                                        <CheckCircle2 size={16} className="text-cafh-indigo shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================
// TAB 2: FEEDBACK QUESTIONNAIRE EDITOR (style: "El Viaje de Cafh")
// ============================================================
const FeedbackTab: React.FC = () => {
    const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
    const [saved, setSaved] = useState(false);

    useEffect(() => { setQuestions(db.feedback.getQuestions()); }, []);

    const handleSave = () => {
        db.feedback.saveQuestions(questions);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const addQuestion = (type: FeedbackQuestion['type']) => {
        const newQ: FeedbackQuestion = {
            id: `fq_${Date.now()}`,
            order: questions.length + 1,
            text: '',
            type,
            options: type === 'multiple_choice' ? ['Opción A', 'Opción B'] : undefined,
            isActive: true,
        };
        setQuestions(prev => [...prev, newQ]);
    };

    const updateQuestion = (idx: number, updates: Partial<FeedbackQuestion>) => {
        setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, ...updates } : q));
    };

    const removeQuestion = (idx: number) => setQuestions(prev => prev.filter((_, i) => i !== idx));
    const moveQuestion = (idx: number, dir: 'up' | 'down') => {
        const arr = [...questions];
        const swap = dir === 'up' ? idx - 1 : idx + 1;
        if (swap < 0 || swap >= arr.length) return;
        [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
        setQuestions(arr);
    };

    const typeConfig = {
        rating: { label: 'Escala de valoración (⭐)', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Star size={13} /> },
        multiple_choice: { label: 'Opción múltiple', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <List size={13} /> },
        text: { label: 'Texto libre', color: 'bg-green-50 text-green-700 border-green-200', icon: <MessageSquare size={13} /> },
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Cuestionario Post-Sesión</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Este cuestionario es <strong>obligatorio</strong> para el miembro tras cada actividad. <br />Sin responder, no puede unirse a futuras reuniones.</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-cafh-indigo text-white hover:bg-blue-800 shadow-lg shadow-blue-900/20'}`}
                >
                    {saved ? <><CheckCircle2 size={15} /> Guardado</> : <><Save size={15} /> Guardar cambios</>}
                </button>
            </div>

            {/* Add question buttons */}
            <div className="bg-gradient-to-br from-cafh-indigo/5 to-blue-50 rounded-[1.5rem] p-5 border border-cafh-indigo/10">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Agregar pregunta</p>
                <div className="flex flex-wrap gap-3">
                    {(Object.entries(typeConfig) as [FeedbackQuestion['type'], typeof typeConfig[keyof typeof typeConfig]][]).map(([type, cfg]) => (
                        <button
                            key={type}
                            onClick={() => addQuestion(type)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all hover:scale-105 ${cfg.color}`}
                        >
                            {cfg.icon} {cfg.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Question list */}
            {questions.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-slate-100 py-16 text-center">
                    <MessageSquare size={40} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Sin preguntas. Agrega la primera arriba.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.map((q, idx) => {
                        const cfg = typeConfig[q.type];
                        return (
                            <div key={q.id} className={`bg-white rounded-[1.5rem] border shadow-sm overflow-hidden transition-all ${q.isActive ? 'border-slate-100' : 'border-slate-100 opacity-50'}`}>
                                <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100">
                                    <div className="text-slate-300"><GripVertical size={16} /></div>
                                    <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${cfg.color}`}>
                                        {cfg.icon} {cfg.label}
                                    </span>
                                    <div className="flex-1" />
                                    {/* Toggle active */}
                                    <button
                                        onClick={() => updateQuestion(idx, { isActive: !q.isActive })}
                                        className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${q.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        {q.isActive ? 'Activa' : 'Inactiva'}
                                    </button>
                                    <div className="flex gap-1">
                                        <button onClick={() => moveQuestion(idx, 'up')} disabled={idx === 0} className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronUp size={14} /></button>
                                        <button onClick={() => moveQuestion(idx, 'down')} disabled={idx === questions.length - 1} className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronDown size={14} /></button>
                                    </div>
                                    <button onClick={() => removeQuestion(idx)} className="p-1 text-slate-300 hover:text-red-400"><X size={14} /></button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Texto de la pregunta</label>
                                        <input
                                            value={q.text}
                                            onChange={e => updateQuestion(idx, { text: e.target.value })}
                                            placeholder="Escribe la pregunta aquí..."
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cafh-indigo/30"
                                        />
                                    </div>
                                    {q.type === 'rating' && (
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map(n => (
                                                <div key={n} className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500 text-lg">{'⭐'}</div>
                                            ))}
                                            <span className="text-xs text-slate-400 ml-2">Escala 1–5 estrellas</span>
                                        </div>
                                    )}
                                    {q.type === 'multiple_choice' && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Opciones</p>
                                            {(q.options || []).map((opt, oi) => (
                                                <div key={oi} className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0"></div>
                                                    <input
                                                        value={opt}
                                                        onChange={e => {
                                                            const opts = [...(q.options || [])];
                                                            opts[oi] = e.target.value;
                                                            updateQuestion(idx, { options: opts });
                                                        }}
                                                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-cafh-indigo/30"
                                                    />
                                                    <button onClick={() => updateQuestion(idx, { options: (q.options || []).filter((_, i) => i !== oi) })}
                                                        className="text-slate-300 hover:text-red-400"><X size={12} /></button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => updateQuestion(idx, { options: [...(q.options || []), 'Nueva opción'] })}
                                                className="flex items-center gap-1.5 text-xs text-cafh-indigo font-bold hover:underline"
                                            >
                                                <Plus size={12} /> Agregar opción
                                            </button>
                                        </div>
                                    )}
                                    {q.type === 'text' && (
                                        <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-300 italic">
                                            Campo de texto libre (el miembro escribe aquí su respuesta)
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ============================================================
// TAB 3: FEEDBACK RESPONSES
// ============================================================
const ResponsesTab: React.FC = () => {
    const [responses, setResponses] = useState<FeedbackResponse[]>([]);
    const [selected, setSelected] = useState<FeedbackResponse | null>(null);
    const [page, setPage] = useState(0);
    const PER_PAGE = 10;

    useEffect(() => { setResponses(db.feedback.getResponses()); }, []);

    const paginated = responses.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
    const totalPages = Math.ceil(responses.length / PER_PAGE);

    const avgRating = responses.length > 0
        ? (responses.reduce((s, r) => s + r.overallRating, 0) / responses.length).toFixed(1)
        : '—';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Evaluaciones Recibidas</h3>
                    <p className="text-sm text-slate-500">{responses.length} respuestas · Valoración promedio: <strong>{avgRating} ⭐</strong></p>
                </div>
                <button onClick={() => setResponses(db.feedback.getResponses())} className="p-2 text-slate-400 hover:text-cafh-indigo rounded-xl hover:bg-slate-100 transition-colors" title="Actualizar">
                    <RefreshCw size={16} />
                </button>
            </div>

            {responses.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-slate-100 py-16 text-center">
                    <BarChart2 size={40} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Sin evaluaciones recibidas aún.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
                    <div className="divide-y divide-slate-50">
                        {paginated.map(r => (
                            <div key={r.id} className="px-7 py-4 flex items-center gap-4 hover:bg-slate-50/70 cursor-pointer transition-colors" onClick={() => setSelected(r)}>
                                <div className="w-9 h-9 bg-cafh-indigo/10 rounded-xl flex items-center justify-center text-cafh-indigo font-bold text-sm shrink-0">
                                    {r.userName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800">{r.userName}</p>
                                    <p className="text-xs text-slate-400">Evento: {r.eventId} · {new Date(r.submittedAt).toLocaleDateString('es-CL')}</p>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {'⭐'.repeat(Math.round(r.overallRating))}
                                    <span className="text-xs font-bold text-slate-600 ml-1">{r.overallRating.toFixed(1)}</span>
                                </div>
                                <Eye size={14} className="text-slate-300" />
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="px-7 py-4 border-t border-slate-50 flex items-center justify-between">
                            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="text-sm font-bold text-slate-500 hover:text-cafh-indigo disabled:opacity-30">← Anterior</button>
                            <span className="text-xs text-slate-400">{page + 1} / {totalPages}</span>
                            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="text-sm font-bold text-slate-500 hover:text-cafh-indigo disabled:opacity-30">Siguiente →</button>
                        </div>
                    )}
                </div>
            )}

            {/* Response detail modal */}
            {selected && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-slate-800">{selected.userName}</p>
                                <p className="text-xs text-slate-400">{new Date(selected.submittedAt).toLocaleString('es-CL')}</p>
                            </div>
                            <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><X size={18} /></button>
                        </div>
                        <div className="overflow-y-auto p-7 space-y-5">
                            <div className="flex items-center gap-2 bg-yellow-50 rounded-xl p-4">
                                <span className="text-2xl">⭐</span>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Valoración general</p>
                                    <p className="text-2xl font-extrabold text-slate-800">{selected.overallRating.toFixed(1)} / 5</p>
                                </div>
                            </div>
                            {selected.answers.map(ans => (
                                <div key={ans.questionId}>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{ans.questionText}</p>
                                    <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-700">
                                        {typeof ans.value === 'number' ? '⭐'.repeat(ans.value) : ans.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================
// TAB 4: GAMIFICATION
// ============================================================
const GamificationTab: React.FC = () => {
    const [badges, setBadges] = useState<MemberBadge[]>([]);
    const [ranking, setRanking] = useState<ReturnType<typeof db.gamification.getRanking>>([]);
    const [showAward, setShowAward] = useState(false);
    const [awardForm, setAwardForm] = useState({ userId: '', type: 'estrella' as BadgeType, label: '', reason: '' });
    const currentUser = db.auth.getCurrentUser();

    const refresh = () => {
        setBadges(db.gamification.getBadges());
        setRanking(db.gamification.getRanking());
    };
    useEffect(() => { refresh(); }, []);

    const handleAward = () => {
        if (!awardForm.userId || !awardForm.label) return;
        db.gamification.awardBadge({
            userId: awardForm.userId,
            type: awardForm.type,
            label: awardForm.label,
            reason: awardForm.reason,
            awardedAt: new Date().toISOString(),
            awardedBy: currentUser?.id || 'admin',
        });
        setShowAward(false);
        setAwardForm({ userId: '', type: 'estrella', label: '', reason: '' });
        refresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Gamificación & Ranking</h3>
                    <p className="text-sm text-slate-500">Asigna reconocimientos y visualiza la participación de la comunidad.</p>
                </div>
                <button onClick={() => setShowAward(true)} className="flex items-center gap-2 bg-cafh-indigo text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20">
                    <Award size={16} /> Otorgar Reconocimiento
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ranking */}
                <SectionCard title="Ranking de Participación" subtitle="Ordenado por puntos acumulados">
                    {ranking.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">Sin datos de participación aún.</p>
                    ) : (
                        <div className="space-y-3">
                            {ranking.slice(0, 10).map((entry, i) => (
                                <div key={entry.userId} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-600' :
                                            i === 1 ? 'bg-slate-100 text-slate-600' :
                                                i === 2 ? 'bg-orange-100 text-orange-600' :
                                                    'bg-slate-50 text-slate-400'
                                        }`}>
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-700 truncate">{entry.userName}</p>
                                        <p className="text-xs text-slate-400">{entry.participations} actividades · {entry.badges} reconocimientos</p>
                                    </div>
                                    <span className="text-sm font-extrabold text-cafh-indigo shrink-0">{entry.points} pts</span>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>

                {/* Recent badges */}
                <SectionCard title="Reconocimientos Otorgados" subtitle="Historial de medallas y estrellas">
                    {badges.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">Sin reconocimientos otorgados aún.</p>
                    ) : (
                        <div className="space-y-3">
                            {badges.slice(0, 8).map(badge => {
                                const cfg = BADGE_CONFIG[badge.type];
                                return (
                                    <div key={badge.id} className="flex items-center gap-3">
                                        <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                                            {cfg.emoji} {cfg.label}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-slate-700 truncate">{badge.label}</p>
                                            <p className="text-[10px] text-slate-400">Para: {badge.userId}</p>
                                        </div>
                                        <button onClick={() => { db.gamification.removeBadge(badge.id); refresh(); }} className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded-lg">
                                            <X size={12} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </SectionCard>
            </div>

            {/* Award modal */}
            {showAward && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h4 className="font-bold text-slate-800">Otorgar Reconocimiento</h4>
                            <button onClick={() => setShowAward(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"><X size={18} /></button>
                        </div>
                        <div className="p-7 space-y-4">
                            <InputField label="ID del Miembro" value={awardForm.userId} onChange={e => setAwardForm(p => ({ ...p, userId: e.target.value }))} placeholder="u_member" />
                            <SelectField label="Tipo de reconocimiento" value={awardForm.type} onChange={e => setAwardForm(p => ({ ...p, type: e.target.value as BadgeType }))}>
                                {(Object.entries(BADGE_CONFIG) as [BadgeType, typeof BADGE_CONFIG[keyof typeof BADGE_CONFIG]][]).map(([type, cfg]) => (
                                    <option key={type} value={type}>{cfg.emoji} {cfg.label} (+{cfg.points} pts)</option>
                                ))}
                            </SelectField>
                            <InputField label="Nombre del reconocimiento" value={awardForm.label} onChange={e => setAwardForm(p => ({ ...p, label: e.target.value }))} placeholder="Ej: Participación Destacada" />
                            <InputField label="Motivo (opcional)" value={awardForm.reason} onChange={e => setAwardForm(p => ({ ...p, reason: e.target.value }))} placeholder="Describe el motivo..." />
                        </div>
                        <div className="px-7 pb-7 flex gap-3">
                            <button onClick={() => setShowAward(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancelar</button>
                            <button onClick={handleAward} className="flex-1 flex items-center justify-center gap-2 bg-cafh-indigo text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 shadow-lg shadow-blue-900/20">
                                <Award size={15} /> Otorgar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================
// MEETINGS ADMIN VIEW — MAIN EXPORT
// ============================================================
export const MeetingsAdminView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('meetings');

    const tabs = [
        { id: 'meetings', label: 'Reuniones', icon: <Video size={15} /> },
        { id: 'feedback', label: 'Cuestionario', icon: <MessageSquare size={15} /> },
        { id: 'responses', label: 'Respuestas', icon: <BarChart2 size={15} /> },
        { id: 'gamification', label: 'Gamificación', icon: <Award size={15} /> },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <ZoomLogo size={22} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Sala de Reuniones</h2>
                    </div>
                    <p className="text-slate-500 ml-13">Gestiona sesiones Zoom, cuestionarios de feedback y gamificación.</p>
                </div>
            </div>

            <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />

            <div>
                {activeTab === 'meetings' && <MeetingsTab />}
                {activeTab === 'feedback' && <FeedbackTab />}
                {activeTab === 'responses' && <ResponsesTab />}
                {activeTab === 'gamification' && <GamificationTab />}
            </div>
        </div>
    );
};

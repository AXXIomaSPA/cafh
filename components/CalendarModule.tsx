/**
 * CalendarModule.tsx — Módulo 2: Calendario de Actividades
 * Panel de Administración — 100% aditivo, no modifica nada existente.
 *
 * Tabs:
 *   1. Actividades   — CRUD completo de ActivityEvent
 *   2. Categorías    — gestión de categorías con color e ícono
 *   3. Envío Masivo  — selector de actividad + segmento CRM
 *   4. Analytics     — métricas y ranking de participación
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    CalendarDays, Plus, Edit2, Trash2, X, Save, ChevronDown,
    BarChart3, Send, Tag, Globe, MapPin, Video, Filter,
    Users, Star, TrendingUp, Eye, Clock, CheckCircle2,
    AlertTriangle, Image as ImageIcon, Search, ArrowRight,
    Layers, Palette, FileText, ExternalLink, Copy, Archive,
    ToggleLeft, ToggleRight, Sparkles, ChevronLeft, ChevronRight,
    List, Grid as GridIcon
} from 'lucide-react';
import { db } from '../storage';
import { ActivityEvent, ActivityCategory, User, UserRole, Contact, GlobalLocation } from '../types';
import { RichTextEditor } from './AdminViews';

// ─── Palette helpers ─────────────────────────────────────────
const MODALITY_CFG = {
    Virtual: { icon: <Video size={12} />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    Presencial: { icon: <MapPin size={12} />, color: 'bg-green-100 text-green-700 border-green-200' },
    Híbrida: { icon: <Globe size={12} />, color: 'bg-purple-100 text-purple-700 border-purple-200' },
};
const STATUS_CFG = {
    Borrador: { color: 'bg-slate-100 text-slate-500 border-slate-200' },
    Publicado: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    Archivado: { color: 'bg-orange-100 text-orange-700 border-orange-200' },
};

// ─── Shared UI ────────────────────────────────────────────────
const SCard: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }> = ({ title, subtitle, action, children }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
                <p className="font-bold text-slate-800">{title}</p>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const SField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
        {children}
    </div>
);

const input = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cafh-indigo/20 focus:border-cafh-indigo transition-all bg-white";
const select = input + " cursor-pointer";

const TabBar: React.FC<{ tabs: { id: string; label: string; icon: React.ReactNode }[]; active: string; onChange: (id: string) => void }> = ({ tabs, active, onChange }) => (
    <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map(t => (
            <button key={t.id} onClick={() => onChange(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${active === t.id ? 'bg-white text-cafh-indigo shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {t.icon}{t.label}
            </button>
        ))}
    </div>
);

// ─── Empty ActivityEvent form ─────────────────────────────────
const emptyEvent = (): Omit<ActivityEvent, 'id' | 'createdAt' | 'updatedAt'> => ({
    title: '',
    description: '',
    category: '',
    tags: [],
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    startTime: '19:00',
    endTime: '21:00',
    modality: 'Virtual',
    organizerContactId: undefined,
    locationId: undefined,
    status: 'Borrador',
    imageUrl: '',
    featuredInDashboard: false,
    zoomUrl: '',
    linkedMeetingId: undefined,
    recurrence: { frequency: 'none', interval: 1, daysOfWeek: [], endType: 'never' },
});

// ══════════════════════════════════════════════════════════════
// TAB 1 — ACTIVIDADES (CRUD)
// ══════════════════════════════════════════════════════════════
const ActividadesTab: React.FC = () => {
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [cats, setCats] = useState<ActivityCategory[]>([]);
    const [locs, setLocs] = useState<GlobalLocation[]>([]);
    const [adminUsers, setAdminUsers] = useState<User[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<ActivityEvent | null>(null);
    const [form, setForm] = useState(emptyEvent());
    const [tagInput, setTagInput] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [saved, setSaved] = useState(false);

    const load = useCallback(() => {
        setEvents(db.activities.getAll());
        setCats(db.activities.getCategories());
        setLocs(db.locations.getAll());
        // Organizadores = solo usuarios con rol admin del sistema
        const allUsers: User[] = (db.auth as any).getAllUsers();
        const admins = allUsers.filter(u => u.role === UserRole.ADMIN || u.role === UserRole.SUPER_ADMIN);
        setAdminUsers(admins);
    }, []);

    useEffect(() => { load(); }, [load]);

    const openNew = () => { setEditing(null); setForm(emptyEvent()); setTagInput(''); setShowForm(true); };
    const openEdit = (ev: ActivityEvent) => {
        setEditing(ev);
        // Garantizar que todos los campos del formulario existan, especialmente recurrence
        setForm({
            ...emptyEvent(),
            ...ev,
            recurrence: ev.recurrence || emptyEvent().recurrence
        });
        setTagInput('');
        setShowForm(true);
    };

    const handleSave = () => {
        if (!form.title.trim()) {
            alert('Por favor, ingresa al menos un título para la actividad.');
            return;
        }

        try {
            if (editing) {
                db.activities.save({ ...editing, ...form });
            } else {
                db.activities.create(form);
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            setShowForm(false);
            load();
        } catch (err) {
            console.error("Error al guardar actividad:", err);
            alert('Hubo un error al guardar la actividad. Revisa la consola para más detalles.');
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Eliminar esta actividad?')) { db.activities.delete(id); load(); }
    };

    const handleToggleStatus = (ev: ActivityEvent) => {
        const next = ev.status === 'Publicado' ? 'Borrador' : 'Publicado';
        db.activities.save({ ...ev, status: next });
        load();
    };

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t] }));
        setTagInput('');
    };

    const filtered = events
        .filter(e => filterStatus === 'all' || e.status === filterStatus)
        .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar actividades..." className={input + " pl-9"} />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={select + " w-40"}>
                    <option value="all">Todos los estados</option>
                    <option value="Borrador">Borrador</option>
                    <option value="Publicado">Publicado</option>
                    <option value="Archivado">Archivado</option>
                </select>
                <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-cafh-indigo text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-md shadow-blue-900/15">
                    <Plus size={16} /> Nueva Actividad
                </button>
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Sin actividades</p>
                        <p className="text-sm">Crea la primera usando el botón superior</p>
                    </div>
                ) : filtered.map(ev => {
                    const cat = cats.find(c => c.id === ev.category);
                    const mod = MODALITY_CFG[ev.modality] || MODALITY_CFG.Virtual;
                    const st = STATUS_CFG[ev.status] || STATUS_CFG.Borrador;
                    return (
                        <div key={ev.id} className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm transition-all p-5 flex gap-4 items-start">
                            {/* Color dot from category */}
                            <div className="w-2 self-stretch rounded-full shrink-0" style={{ backgroundColor: cat?.color || '#4f46e5' }} />
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-800 text-sm">{ev.title}</h4>
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.color}`}>{ev.status}</span>
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${mod.color}`}>{mod.icon}{ev.modality}</span>
                                    {ev.featuredInDashboard && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"><Sparkles size={9} />Destacado</span>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <CalendarDays size={12} className="text-slate-300" />
                                        {ev.startDate} · {ev.startTime}
                                    </p>
                                    {ev.recurrence && ev.recurrence.frequency !== 'none' && (
                                        <p className="text-[10px] font-bold text-cafh-indigo bg-indigo-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-indigo-100/50">
                                            <Clock size={10} />
                                            {ev.recurrence.frequency === 'daily' ? 'Diario' :
                                                ev.recurrence.frequency === 'weekly' ? `Cada ${ev.recurrence.daysOfWeek?.map(d => ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'][d]).join(', ')}` :
                                                    ev.recurrence.frequency === 'monthly' ? 'Mensual' : ''}
                                            {ev.recurrence.endType === 'never' ? ' (Permanente)' : ` (Hasta ${ev.recurrence.endDate})`}
                                        </p>
                                    )}
                                </div>
                                {ev.tags.length > 0 && (
                                    <div className="flex gap-1 flex-wrap mt-2">
                                        {ev.tags.map(t => <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>)}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button onClick={() => handleToggleStatus(ev)} title={ev.status === 'Publicado' ? 'Despublicar' : 'Publicar'}
                                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-cafh-indigo transition-colors">
                                    {ev.status === 'Publicado' ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} />}
                                </button>
                                <button onClick={() => openEdit(ev)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-cafh-indigo transition-colors"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(ev.id)} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
                        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800">{editing ? 'Editar Actividad' : 'Nueva Actividad'}</h3>
                            <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><X size={18} /></button>
                        </div>
                        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-5">
                            <SField label="Título *">
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={input} placeholder="Nombre de la actividad" />
                            </SField>
                            <div className="grid grid-cols-2 gap-4">
                                <SField label="Fecha inicio">
                                    <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={input} />
                                </SField>
                                <SField label="Fecha fin">
                                    <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={input} />
                                </SField>
                                <SField label="Hora inicio">
                                    <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className={input} />
                                </SField>
                                <SField label="Hora fin">
                                    <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className={input} />
                                </SField>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <SField label="Modalidad">
                                    <select value={form.modality} onChange={e => setForm(f => ({ ...f, modality: e.target.value as any, locationId: e.target.value === 'Virtual' ? undefined : f.locationId }))} className={select}>
                                        <option>Virtual</option>
                                        <option>Presencial</option>
                                        <option>Híbrida</option>
                                    </select>
                                </SField>
                                <SField label="Categoría">
                                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={select}>
                                        <option value="">Sin categoría</option>
                                        {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </SField>
                            </div>

                            {(form.modality === 'Presencial' || form.modality === 'Híbrida') && (
                                <SField label="Sede de la Actividad">
                                    <select
                                        value={form.locationId || ''}
                                        onChange={e => setForm(f => ({ ...f, locationId: e.target.value || undefined }))}
                                        className={select}
                                    >
                                        <option value="">Seleccionar sede...</option>
                                        {locs.map(l => <option key={l.id} value={l.id}>{l.name} — {l.city}, {l.country}</option>)}
                                    </select>
                                    {locs.length === 0 && (
                                        <p className="text-[10px] text-amber-600 mt-1 font-bold">No hay sedes creadas. Ve al módulo de Sedes Globales para añadir una.</p>
                                    )}
                                </SField>
                            )}

                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock size={16} className="text-cafh-indigo" />
                                    <p className="text-sm font-bold text-slate-700">Configuración de Recurrencia</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <SField label="Frecuencia">
                                        <select
                                            value={form.recurrence?.frequency || 'none'}
                                            onChange={e => {
                                                const freq = e.target.value as any;
                                                let days = form.recurrence?.daysOfWeek || [];
                                                if (freq === 'weekly' && days.length === 0) {
                                                    const d = new Date(form.startDate + 'T12:00:00');
                                                    days = [d.getDay()];
                                                }
                                                setForm(f => ({
                                                    ...f,
                                                    recurrence: {
                                                        ...(f.recurrence || emptyEvent().recurrence),
                                                        frequency: freq,
                                                        daysOfWeek: days
                                                    }
                                                }));
                                            }}
                                            className={select}
                                        >
                                            <option value="none">Sin repetición</option>
                                            <option value="daily">Diaria</option>
                                            <option value="weekly">Semanal</option>
                                            <option value="monthly">Mensual</option>
                                        </select>
                                    </SField>
                                    {form.recurrence?.frequency && form.recurrence.frequency !== 'none' && (
                                        <SField label="Finaliza">
                                            <select
                                                value={form.recurrence?.endType || 'never'}
                                                onChange={e => setForm(f => ({
                                                    ...f,
                                                    recurrence: {
                                                        ...(f.recurrence || emptyEvent().recurrence),
                                                        endType: e.target.value as any
                                                    }
                                                }))}
                                                className={select}
                                            >
                                                <option value="never">Nunca (Permanente)</option>
                                                <option value="date">En una fecha</option>
                                            </select>
                                        </SField>
                                    )}
                                </div>

                                {form.recurrence?.frequency === 'weekly' && (
                                    <SField label="Repetir estos días">
                                        <div className="flex flex-wrap gap-2">
                                            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((label, i) => {
                                                const isActive = form.recurrence?.daysOfWeek?.includes(i);
                                                return (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => {
                                                            const current = form.recurrence?.daysOfWeek || [];
                                                            const next = isActive ? current.filter(d => d !== i) : [...current, i];
                                                            setForm(f => ({
                                                                ...f,
                                                                recurrence: {
                                                                    ...(f.recurrence || emptyEvent().recurrence),
                                                                    daysOfWeek: next
                                                                }
                                                            }));
                                                        }}
                                                        className={`w-8 h-8 rounded-lg text-[10px] font-bold border transition-all ${isActive ? 'bg-cafh-indigo text-white border-cafh-indigo shadow-sm shadow-indigo-100' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                                                            }`}
                                                    >
                                                        {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </SField>
                                )}

                                {form.recurrence?.frequency && form.recurrence.frequency !== 'none' && (
                                    <div className="text-xs font-medium text-cafh-indigo/80 bg-cafh-indigo/5 p-3 rounded-xl border border-cafh-indigo/10 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cafh-indigo animate-pulse" />
                                        Se repetirá {form.recurrence.frequency === 'daily' ? 'diariamente' :
                                            form.recurrence.frequency === 'weekly' ? `cada semana el ${form.recurrence.daysOfWeek?.map(d => ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][d]).join(', ')}` :
                                                'cada mes'} a las {form.startTime} hrs.
                                    </div>
                                )}

                                {form.recurrence?.frequency !== 'none' && form.recurrence?.endType === 'date' && (
                                    <SField label="Fecha de finalización">
                                        <input
                                            type="date"
                                            value={form.recurrence?.endDate || ''}
                                            onChange={e => setForm(f => ({ ...f, recurrence: { ...(f.recurrence || emptyEvent().recurrence), endDate: e.target.value } }))}
                                            className={input}
                                        />
                                    </SField>
                                )}
                            </div>
                            {form.modality === 'Virtual' || form.modality === 'Híbrida' ? (
                                <SField label="URL de Zoom">
                                    <input value={form.zoomUrl || ''} onChange={e => setForm(f => ({ ...f, zoomUrl: e.target.value }))} className={input} placeholder="https://zoom.us/j/..." />
                                </SField>
                            ) : null}
                            <SField label="Organizador">
                                <select value={form.organizerContactId || ''} onChange={e => setForm(f => ({ ...f, organizerContactId: e.target.value || undefined }))} className={select}>
                                    <option value="">Sin organizador asignado</option>
                                    {adminUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                                </select>
                            </SField>
                            <SField label="Descripción de la Actividad">
                                <RichTextEditor
                                    value={form.description}
                                    onChange={val => setForm(f => ({ ...f, description: val }))}
                                    placeholder="Detalles sobre el contenido del encuentro, requisitos, facilitadores..."
                                />
                            </SField>
                            <SField label="Tags">
                                <div className="flex gap-2 mb-2">
                                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className={input + " flex-1"} placeholder="Agregar tag y presionar Enter" />
                                    <button onClick={addTag} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors">+</button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {form.tags.map(t => (
                                        <span key={t} className="flex items-center gap-1 text-xs bg-cafh-indigo/10 text-cafh-indigo px-2.5 py-1 rounded-full font-medium">
                                            {t}
                                            <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))} className="text-cafh-indigo/60 hover:text-cafh-indigo ml-0.5"><X size={10} /></button>
                                        </span>
                                    ))}
                                </div>
                            </SField>
                            <div className="grid grid-cols-2 gap-4">
                                <SField label="Estado">
                                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))} className={select}>
                                        <option>Borrador</option>
                                        <option>Publicado</option>
                                        <option>Archivado</option>
                                    </select>
                                </SField>
                                <SField label="URL de imagen">
                                    <input value={form.imageUrl || ''} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className={input} placeholder="https://..." />
                                </SField>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 cursor-pointer" onClick={() => setForm(f => ({ ...f, featuredInDashboard: !f.featuredInDashboard }))}>
                                {form.featuredInDashboard ? <ToggleRight size={22} className="text-amber-600" /> : <ToggleLeft size={22} className="text-slate-400" />}
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Destacar en "Novedades para Ti"</p>
                                    <p className="text-xs text-slate-400">Aparece en el dashboard del miembro ordenado por fecha</p>
                                </div>
                            </div>
                            {form.modality === 'Virtual' && form.zoomUrl && (
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-center gap-2">
                                    <Video size={13} /> Al guardar, se sincronizará automáticamente como evento en el Calendario
                                </div>
                            )}
                        </div>
                        <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/60">
                            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-100 transition-colors">Cancelar</button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-cafh-indigo text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-md shadow-blue-900/15">
                                <Save size={15} /> {editing ? 'Guardar cambios' : 'Crear actividad'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ══════════════════════════════════════════════════════════════
// TAB 2 — CATEGORÍAS
// ══════════════════════════════════════════════════════════════
const CategoriasTab: React.FC = () => {
    const [cats, setCats] = useState<ActivityCategory[]>([]);
    const [editIdx, setEditIdx] = useState<number | null>(null);
    const [form, setForm] = useState<Omit<ActivityCategory, 'id'>>({ name: '', color: '#4f46e5', icon: 'Calendar' });

    const load = () => setCats(db.activities.getCategories());
    useEffect(() => { load(); }, []);

    const save = () => {
        if (!form.name.trim()) return;
        if (editIdx !== null) {
            const updated = cats.map((c, i) => i === editIdx ? { ...c, ...form } : c);
            db.activities.saveCategories(updated);
        } else {
            const newCat: ActivityCategory = { ...form, id: `cat_${Date.now()}` };
            db.activities.saveCategories([...cats, newCat]);
        }
        setEditIdx(null);
        setForm({ name: '', color: '#4f46e5', icon: 'Calendar' });
        load();
    };

    const remove = (id: string) => {
        db.activities.saveCategories(cats.filter(c => c.id !== id));
        load();
    };

    const editCat = (idx: number) => {
        setEditIdx(idx);
        setForm({ name: cats[idx].name, color: cats[idx].color, icon: cats[idx].icon });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SCard title={editIdx !== null ? 'Editar Categoría' : 'Nueva Categoría'} subtitle="Organiza tus actividades por tipo">
                <div className="space-y-4">
                    <SField label="Nombre">
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={input} placeholder="Meditación, Retiro, Charla..." />
                    </SField>
                    <SField label="Color">
                        <div className="flex items-center gap-3">
                            <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5" />
                            <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className={input + " font-mono"} />
                        </div>
                    </SField>
                    <div className="flex gap-3 pt-2">
                        {editIdx !== null && (
                            <button onClick={() => { setEditIdx(null); setForm({ name: '', color: '#4f46e5', icon: 'Calendar' }); }}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 transition-colors">Cancelar</button>
                        )}
                        <button onClick={save} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-cafh-indigo text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors">
                            <Save size={14} /> {editIdx !== null ? 'Guardar' : 'Crear categoría'}
                        </button>
                    </div>
                </div>
            </SCard>

            <SCard title="Categorías existentes" subtitle={`${cats.length} categorías configuradas`}>
                {cats.length === 0 ? (
                    <p className="text-slate-400 text-sm italic text-center py-8">Sin categorías. Crea la primera.</p>
                ) : (
                    <div className="space-y-2">
                        {cats.map((cat, idx) => (
                            <div key={cat.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="w-5 h-5 rounded-full shrink-0 border border-white shadow-sm" style={{ backgroundColor: cat.color }} />
                                <span className="flex-1 text-sm font-medium text-slate-700">{cat.name}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => editCat(idx)} className="p-1.5 text-slate-400 hover:text-cafh-indigo hover:bg-white rounded-lg transition-colors"><Edit2 size={13} /></button>
                                    <button onClick={() => remove(cat.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"><Trash2 size={13} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </SCard>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════
// TAB 3 — ENVÍO MASIVO
// ══════════════════════════════════════════════════════════════
const EnvioMasivoTab: React.FC = () => {
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [sent, setSent] = useState(false);

    useEffect(() => {
        setEvents(db.activities.getAll().filter(e => e.status === 'Publicado'));
        setContacts(db.crm.getAll());
    }, []);

    const chosenEvent = events.find(e => e.id === selectedEvent);

    const handleSend = () => {
        if (!selectedEvent || !subject) return;
        // Simulate send via db.email if available, otherwise just record
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <SCard title="Configurar envío" subtitle="Notifica a la comunidad sobre una actividad">
                    <div className="space-y-5">
                        <SField label="Actividad a comunicar">
                            <select value={selectedEvent} onChange={e => {
                                setSelectedEvent(e.target.value);
                                const ev = events.find(ev => ev.id === e.target.value);
                                if (ev) { setSubject(`Te invitamos: ${ev.title}`); setBody(`Hola,\n\nTe invitamos a participar en "${ev.title}" el ${ev.startDate} a las ${ev.startTime} hrs.\n\n¡Te esperamos!`); }
                            }} className={select}>
                                <option value="">Seleccionar actividad publicada...</option>
                                {events.map(e => <option key={e.id} value={e.id}>{e.title} — {e.startDate}</option>)}
                            </select>
                        </SField>
                        <SField label="Asunto del correo">
                            <input value={subject} onChange={e => setSubject(e.target.value)} className={input} placeholder="Asunto del email..." />
                        </SField>
                        <SField label="Mensaje">
                            <textarea value={body} onChange={e => setBody(e.target.value)} rows={6} className={input + " resize-none"} placeholder="Cuerpo del mensaje..." />
                        </SField>
                        <button onClick={handleSend} disabled={!selectedEvent || !subject}
                            className="flex items-center gap-2 px-5 py-2.5 bg-cafh-indigo text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-md shadow-blue-900/15 disabled:opacity-40">
                            {sent ? <CheckCircle2 size={15} className="text-emerald-300" /> : <Send size={15} />}
                            {sent ? `Enviado a ${contacts.length} contactos` : `Enviar a toda la comunidad (${contacts.length})`}
                        </button>
                    </div>
                </SCard>
            </div>
            <div className="space-y-4">
                <SCard title="Vista previa" subtitle="Cómo verán el email">
                    {chosenEvent ? (
                        <div className="space-y-3 text-sm">
                            {chosenEvent.imageUrl && <img src={chosenEvent.imageUrl} alt="" className="w-full h-28 object-cover rounded-xl" />}
                            <p className="font-bold text-slate-800">{chosenEvent.title}</p>
                            <div className="flex gap-2 text-xs">
                                <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{chosenEvent.startDate}</span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{chosenEvent.startTime}</span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{chosenEvent.modality}</span>
                            </div>
                            <p className="text-slate-500 text-xs line-clamp-3">{chosenEvent.description}</p>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm italic text-center py-8">Selecciona una actividad</p>
                    )}
                </SCard>
                <SCard title="Destinatarios" subtitle="Todos los contactos del CRM">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-cafh-indigo">{contacts.length}</p>
                        <p className="text-xs text-slate-400 mt-1">contactos activos</p>
                    </div>
                </SCard>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════
// TAB 4 — ANALYTICS
// ══════════════════════════════════════════════════════════════
const AnalyticsTab: React.FC = () => {
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [ranking, setRanking] = useState<{ userId: string; userName: string; points: number; badges: number; participations: number }[]>([]);
    const [responses, setResponses] = useState<any[]>([]);

    useEffect(() => {
        setEvents(db.activities.getAll());
        setRanking(db.gamification.getRanking());
        setResponses(db.feedback.getResponses());
    }, []);

    const published = events.filter(e => e.status === 'Publicado').length;
    const virtual = events.filter(e => e.modality === 'Virtual').length;
    const avgRating = responses.length > 0
        ? (responses.reduce((s, r) => s + (r.overallRating || 0), 0) / responses.length).toFixed(1)
        : '—';

    const kpis = [
        { label: 'Actividades publicadas', value: published, icon: <CheckCircle2 size={18} className="text-emerald-500" />, bg: 'bg-emerald-50' },
        { label: 'Sesiones virtuales', value: virtual, icon: <Video size={18} className="text-blue-500" />, bg: 'bg-blue-50' },
        { label: 'Valoración promedio', value: avgRating + ' ⭐', icon: <Star size={18} className="text-amber-500" />, bg: 'bg-amber-50' },
        { label: 'Evaluaciones recibidas', value: responses.length, icon: <FileText size={18} className="text-purple-500" />, bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${k.bg}`}>{k.icon}</div>
                        <div>
                            <p className="text-xl font-bold text-slate-800">{k.value}</p>
                            <p className="text-xs text-slate-400">{k.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ranking de participación */}
                <SCard title="Ranking de Participación" subtitle="Miembros con más puntos acumulados">
                    {ranking.length === 0 ? (
                        <p className="text-slate-400 text-sm italic text-center py-8">Sin datos de participación aún.</p>
                    ) : (
                        <div className="space-y-3">
                            {ranking.slice(0, 8).map((r, i) => (
                                <div key={r.userId} className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 truncate">{r.userName}</p>
                                        <p className="text-xs text-slate-400">{r.participations} participaciones · {r.badges} badges</p>
                                    </div>
                                    <span className="font-bold text-cafh-indigo text-sm">{r.points} pts</span>
                                </div>
                            ))}
                        </div>
                    )}
                </SCard>

                {/* Actividades por modalidad */}
                <SCard title="Actividades por modalidad" subtitle="Distribución de formato">
                    {events.length === 0 ? (
                        <p className="text-slate-400 text-sm italic text-center py-8">Sin actividades creadas.</p>
                    ) : (
                        <div className="space-y-4">
                            {(['Virtual', 'Presencial', 'Híbrida'] as const).map(mod => {
                                const count = events.filter(e => e.modality === mod).length;
                                const pct = events.length > 0 ? Math.round((count / events.length) * 100) : 0;
                                const cfg = MODALITY_CFG[mod];
                                return (
                                    <div key={mod}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.icon}{mod}</span>
                                            <span className="text-sm font-bold text-slate-700">{count} <span className="text-slate-400 font-normal text-xs">({pct}%)</span></span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full">
                                            <div className="h-full bg-cafh-indigo rounded-full transition-all" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </SCard>
            </div>

            {/* Últimas evaluaciones */}
            {responses.length > 0 && (
                <SCard title="Últimas evaluaciones recibidas" subtitle="Feedback post-sesión de los miembros">
                    <div className="space-y-3">
                        {responses.slice(0, 5).map((r: any) => (
                            <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">{r.userName}</p>
                                    <p className="text-xs text-slate-400">{new Date(r.submittedAt).toLocaleString('es-CL')}</p>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                                    {'⭐'.repeat(Math.round(r.overallRating || 0))}
                                    <span className="text-slate-600 font-normal text-xs ml-1">{(r.overallRating || 0).toFixed(1)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </SCard>
            )}
        </div>
    );
};

// ══════════════════════════════════════════════════════════════
// CALENDARIO TAB — Vistas Día / Semana / Mes
// ══════════════════════════════════════════════════════════════
const WEEKDAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const evColor = (ev: ActivityEvent, cats: ActivityCategory[]): string => {
    const cat = cats.find(c => c.id === ev.category);
    return cat?.color || '#4f46e5';
};

// ══════════════════════════════════════════════════════════════
// TAB 5 — PARTICIPANTES
// ══════════════════════════════════════════════════════════════
const ParticipantesTab: React.FC = () => {
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [participants, setParticipants] = useState<import('../types').ParticipationRecord[]>([]);

    useEffect(() => {
        const allEvents = db.activities.getAll().filter(e => e.status !== 'Borrador');
        setEvents(allEvents);
        if (allEvents.length > 0 && !selectedEventId) {
            setSelectedEventId(allEvents[0].id);
        }
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            setParticipants(db.gamification.getByActivity(selectedEventId));
        }
    }, [selectedEventId]);

    return (
        <div className="space-y-6">
            <SCard title="Listado de Participantes por Actividad" subtitle="Gestiona y conoce a los inscritos en cada evento">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar: Activity list */}
                    <div className="w-full md:w-72 border-r border-slate-50 pr-6 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Seleccionar Actividad</label>
                        {events.length > 0 ? events.map(ev => (
                            <div
                                key={ev.id}
                                onClick={() => setSelectedEventId(ev.id)}
                                className={`p-3 rounded-xl cursor-pointer transition-all border ${selectedEventId === ev.id
                                    ? 'bg-cafh-indigo/5 border-cafh-indigo/20 text-cafh-indigo'
                                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                                    }`}
                            >
                                <p className="text-sm font-bold truncate">{ev.title}</p>
                                <p className="text-[10px] opacity-60 mt-0.5">{ev.startDate} · {ev.modality}</p>
                            </div>
                        )) : (
                            <p className="text-xs text-slate-400 italic p-4">No hay actividades publicadas.</p>
                        )}
                    </div>

                    {/* Main: Participants table */}
                    <div className="flex-1 min-w-0">
                        {selectedEventId ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-700">Participantes ({participants.length})</h4>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                            Miembros: {participants.filter(p => p.userType === 'Miembro').length}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                                            Visitantes: {participants.filter(p => p.userType === 'Visitante').length}
                                        </div>
                                    </div>
                                </div>

                                {participants.length > 0 ? (
                                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Identificación</th>
                                                    <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Tipo</th>
                                                    <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Etiquetas</th>
                                                    <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Fecha</th>
                                                    <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {participants.map(p => (
                                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <p className="font-bold text-slate-800">{p.userName}</p>
                                                            <p className="text-[11px] text-slate-400">{p.userEmail}</p>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${p.userType === 'Miembro' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                                                }`}>
                                                                {p.userType}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex flex-wrap gap-1">
                                                                {p.userTags && p.userTags.length > 0 ? p.userTags.map(t => (
                                                                    <span key={t} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{t}</span>
                                                                )) : <span className="text-[9px] text-slate-300 italic">Sin etiquetas</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-500 text-xs">
                                                            {new Date(p.participatedAt).toLocaleDateString('es-CL')}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                                {p.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
                                        <Users size={32} className="mx-auto mb-3 text-slate-200" />
                                        <p className="text-slate-400 text-sm">Aún no hay inscritos en esta actividad.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <Users size={48} className="mx-auto mb-4 text-slate-100" />
                                <p className="text-slate-400">Selecciona una actividad para ver sus participantes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </SCard>
        </div>
    );
};

const checkIfEventOccursOn = (event: ActivityEvent, dateStr: string): boolean => {
    // Normalizar fechas (usamos mediodía para evitar saltos de zona horaria)
    const targetDate = new Date(dateStr + 'T12:00:00');
    const startOfBaseEvent = new Date(event.startDate + 'T00:00:00');

    // Si la fecha es anterior al inicio de la actividad, no ocurre
    if (targetDate < startOfBaseEvent) return false;

    // Si hay fecha de fin de recurrencia y ya pasó
    if (event.recurrence?.frequency && event.recurrence.frequency !== 'none' && event.recurrence.endType === 'date' && event.recurrence.endDate) {
        if (dateStr > event.recurrence.endDate) return false;
    }

    // Caso 1: Sin recurrencia (evento único o de varios días seguidos)
    if (!event.recurrence || event.recurrence.frequency === 'none') {
        return dateStr >= event.startDate && dateStr <= event.endDate;
    }

    // Caso 2: Diaria
    if (event.recurrence.frequency === 'daily') {
        const diffTime = targetDate.getTime() - startOfBaseEvent.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const interval = event.recurrence.interval || 1;
        return diffDays % interval === 0;
    }

    // Caso 3: Semanal
    if (event.recurrence.frequency === 'weekly') {
        const dayOfWeek = targetDate.getDay(); // 0: Dom, 1: Lun...
        return event.recurrence.daysOfWeek?.includes(dayOfWeek) || false;
    }

    // Caso 4: Mensual
    if (event.recurrence.frequency === 'monthly') {
        // Se repite el mismo día del mes que la fecha de inicio
        return targetDate.getDate() === startOfBaseEvent.getDate();
    }

    return false;
};

const CalendarioTab: React.FC = () => {
    const [view, setView] = useState<'dia' | 'semana' | 'mes'>('mes');
    const [cursor, setCursor] = useState(new Date());
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [cats, setCats] = useState<ActivityCategory[]>([]);
    const [selected, setSelected] = useState<ActivityEvent | null>(null);

    useEffect(() => {
        setEvents(db.activities.getAll().filter(e => e.status !== 'Archivado'));
        setCats(db.activities.getCategories());
    }, []);

    const isoDate = (d: Date) => d.toISOString().slice(0, 10);
    const eventsOn = (ds: string) => events.filter(e => checkIfEventOccursOn(e, ds));

    const nav = (dir: number) => {
        const d = new Date(cursor);
        if (view === 'dia') d.setDate(d.getDate() + dir);
        else if (view === 'semana') d.setDate(d.getDate() + dir * 7);
        else d.setMonth(d.getMonth() + dir);
        setCursor(d);
    };

    const heading = () => {
        if (view === 'dia') return cursor.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        if (view === 'semana') {
            const s = new Date(cursor); s.setDate(s.getDate() - s.getDay());
            const e = new Date(s); e.setDate(e.getDate() + 6);
            return `${s.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })} – ${e.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        }
        return `${MONTHS_ES[cursor.getMonth()]} ${cursor.getFullYear()}`;
    };

    // Vista Día
    const DiaView = () => {
        const ds = isoDate(cursor);
        const todayEvs = eventsOn(ds);
        const hours = Array.from({ length: 14 }, (_, i) => i + 7);
        return (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-700 capitalize">{cursor.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                {todayEvs.length === 0 ? (
                    <p className="text-slate-400 text-sm italic text-center py-12">Sin eventos este día</p>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {todayEvs.map(ev => (
                            <div key={ev.id} onClick={() => setSelected(ev)}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors">
                                <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: evColor(ev, cats) }} />
                                <div className="text-xs font-mono text-slate-400 shrink-0 w-24">{ev.startTime}–{ev.endTime}</div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800 text-sm">{ev.title}</p>
                                    <p className="text-xs text-slate-400">{ev.modality}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CFG[ev.status]?.color || ''
                                    }`}>{ev.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Vista Semana
    const SemanaView = () => {
        const weekStart = new Date(cursor);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(weekStart); d.setDate(d.getDate() + i); return d;
        });
        const today = isoDate(new Date());
        return (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-100">
                    {days.map(d => {
                        const ds = isoDate(d);
                        const isToday = ds === today;
                        return (
                            <div key={ds} className={`p-3 text-center border-r last:border-r-0 border-slate-100 ${isToday ? 'bg-cafh-indigo/5' : ''}`}>
                                <p className="text-[11px] text-slate-400 font-bold uppercase">{WEEKDAYS_ES[d.getDay()]}</p>
                                <p className={`text-lg font-bold mt-0.5 ${isToday ? 'text-cafh-indigo' : 'text-slate-700'}`}>{d.getDate()}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="grid grid-cols-7 min-h-[260px]">
                    {days.map(d => {
                        const ds = isoDate(d);
                        const dayEvs = eventsOn(ds);
                        return (
                            <div key={ds} className="border-r last:border-r-0 border-slate-50 p-1.5 space-y-1">
                                {dayEvs.map(ev => (
                                    <div key={ev.id} onClick={() => setSelected(ev)}
                                        className="rounded-lg px-2 py-1 text-white text-[10px] font-semibold cursor-pointer hover:opacity-90 truncate"
                                        style={{ backgroundColor: evColor(ev, cats) }}>
                                        {ev.startTime} {ev.title}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Vista Mes
    const MesView = () => {
        const year = cursor.getFullYear();
        const month = cursor.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = isoDate(new Date());
        const cells: (number | null)[] = [
            ...Array(firstDay).fill(null),
            ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
        ];
        while (cells.length % 7 !== 0) cells.push(null);
        return (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                    {WEEKDAYS_ES.map(w => (
                        <div key={w} className="py-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">{w}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {cells.map((day, idx) => {
                        if (!day) return <div key={`e_${idx}`} className="border-r border-b border-slate-50 h-24 bg-slate-50/40" />;
                        const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayEvs = eventsOn(ds);
                        const isToday = ds === today;
                        return (
                            <div key={ds} className={`border-r border-b border-slate-100 h-24 p-1.5 flex flex-col ${idx % 7 === 6 ? 'border-r-0' : ''
                                }`}>
                                <span className={`text-xs font-bold self-start mb-1 w-6 h-6 flex items-center justify-center rounded-full shrink-0 ${isToday ? 'bg-cafh-indigo text-white' : 'text-slate-500'
                                    }`}>{day}</span>
                                <div className="space-y-0.5 overflow-hidden flex-1 min-h-0">
                                    {dayEvs.slice(0, 3).map(ev => (
                                        <div key={ev.id} onClick={() => setSelected(ev)}
                                            className="rounded px-1.5 py-0.5 text-white text-[9px] font-semibold cursor-pointer hover:opacity-90 truncate"
                                            style={{ backgroundColor: evColor(ev, cats) }}>
                                            {ev.title}
                                        </div>
                                    ))}
                                    {dayEvs.length > 3 && <p className="text-[9px] text-slate-400 pl-0.5">+{dayEvs.length - 3} más</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Barra de navegación del calendario */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => nav(-1)} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => setCursor(new Date())} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                        Hoy
                    </button>
                    <button onClick={() => nav(1)} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                        <ChevronRight size={16} />
                    </button>
                    <h3 className="text-base font-bold text-slate-800 ml-2 capitalize">{heading()}</h3>
                </div>
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                    {(['dia', 'semana', 'mes'] as const).map(v => (
                        <button key={v} onClick={() => setView(v)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === v ? 'bg-white text-cafh-indigo shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}>
                            {v === 'dia' ? 'Día' : v === 'semana' ? 'Semana' : 'Mes'}
                        </button>
                    ))}
                </div>
            </div>

            {view === 'dia' && <DiaView />}
            {view === 'semana' && <SemanaView />}
            {view === 'mes' && <MesView />}

            {/* Panel de detalle del evento */}
            {selected && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
                    <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8">
                        <button onClick={() => setSelected(null)} className="absolute top-5 right-5 p-2 text-slate-400 hover:bg-slate-100 rounded-xl"><X size={16} /></button>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: evColor(selected, cats) }} />
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${MODALITY_CFG[selected.modality]?.color || ''
                                }`}>{selected.modality}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CFG[selected.status]?.color || ''
                                }`}>{selected.status}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{selected.title}</h3>
                        <p className="text-xs text-slate-400 mb-4">{selected.startDate} · {selected.startTime} – {selected.endTime}</p>
                        {selected.description && <p className="text-sm text-slate-500 leading-relaxed mb-4">{selected.description}</p>}
                        {selected.zoomUrl && (
                            <a href={selected.zoomUrl} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-cafh-indigo hover:underline">
                                <Video size={14} /> Unirse a sesión Zoom
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ══════════════════════════════════════════════════════════════
// MAIN — CalendarAdminView
// ══════════════════════════════════════════════════════════════
const TABS = [
    { id: 'calendario', label: 'Calendario', icon: <CalendarDays size={14} /> },
    { id: 'actividades', label: 'Actividades', icon: <GridIcon size={14} /> },
    { id: 'participantes', label: 'Participantes', icon: <Users size={14} /> },
    { id: 'categorias', label: 'Categorías', icon: <Tag size={14} /> },
    { id: 'envio', label: 'Envío Masivo', icon: <Send size={14} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={14} /> },
];

export const CalendarAdminView: React.FC = () => {
    const [tab, setTab] = useState('calendario');

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cafh-indigo/10 rounded-xl">
                        <CalendarDays size={24} className="text-cafh-indigo" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Calendario de Actividades</h1>
                        <p className="text-sm text-slate-400">Gestiona eventos, categorías, envíos y analítica.</p>
                    </div>
                </div>
            </div>

            <TabBar tabs={TABS} active={tab} onChange={setTab} />

            {tab === 'calendario' && <CalendarioTab />}
            {tab === 'actividades' && <ActividadesTab />}
            {tab === 'participantes' && <ParticipantesTab />}
            {tab === 'categorias' && <CategoriasTab />}
            {tab === 'envio' && <EnvioMasivoTab />}
            {tab === 'analytics' && <AnalyticsTab />}
        </div>
    );
};

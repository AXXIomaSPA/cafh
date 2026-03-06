import React, { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart as ReBarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
    MOCK_CONTACTS, MOCK_AUTOMATIONS, MOCK_CONTENT, MOCK_EVENTS,
    MOCK_EMAIL_LOGS, MOCK_EMAIL_METRICS
} from '../constants';
import {
    MoreHorizontal, Filter, Plus, Mail, ArrowUpRight, CheckCircle2,
    AlertCircle, Clock, FileText, Calendar as CalendarIcon, MapPin,
    X, Send, Phone, Globe, User, Users, Shield, BarChart2, RefreshCw,
    ChevronRight, ExternalLink, Trash2, Download, Search as SearchIcon,
    Grid, List, Film, Music, Image as ImageIcon, File, Instagram, Youtube,
    Layout, Type, Image, Layers, Video, Sparkles, Edit, ArrowLeft,
    GripVertical, ArrowUp, ArrowDown, Compass, BookOpen, TrendingUp,
    Hash, Activity, Play, MousePointer, ChevronDown, ChevronUp, Database, UploadCloud, Settings, Eye, Target, Percent, Zap, Pause,
    Globe2, Lock, Bell, Tag, LogIn, Save, AlertTriangle, Sliders, Package, Star, Link2, Facebook, Twitter, Heart, Sun, Cloud, Anchor, Feather, Coffee, Book, Headphones, Mic, LogOut, Check, ChevronLeft, Minus, Info, Settings2, Trash, Copy, Table2, FolderOpen, Columns
} from 'lucide-react';

const LUCIDE_ICONS: Record<string, any> = {
    MoreHorizontal, Filter, Plus, Mail, ArrowUpRight, CheckCircle2,
    AlertCircle, Clock, FileText, Calendar: CalendarIcon, MapPin,
    X, Send, Phone, Globe, User, Users, Shield, BarChart2, RefreshCw,
    ChevronRight, ExternalLink, Trash2, Download, Search: SearchIcon,
    Grid, List, Film, Music, ImageIcon, File, Instagram, Youtube,
    Layout, Type, Image, Layers, Video, Sparkles, Edit, ArrowLeft,
    GripVertical, ArrowUp, ArrowDown, Compass, BookOpen, TrendingUp,
    Hash, Activity, Play, MousePointer, ChevronDown, ChevronUp, Database, UploadCloud, Settings, Eye, Target, Percent, Zap, Pause,
    Globe2, Lock, Bell, Tag, LogIn, Save, AlertTriangle, Sliders, Package, Star, Link2, Facebook, Twitter, Heart, Sun, Cloud, Anchor, Feather, Coffee, Book, Headphones, Mic, LogOut, Check, ChevronLeft, Minus, Info, Settings2, Trash, Copy, Table2, FolderOpen, Columns
};

const DynamicIcon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 20, className }) => {
    if (name?.startsWith('http') || name?.startsWith('/')) {
        return <img src={name} alt="icon" style={{ width: size, height: size, objectFit: 'contain' }} className={className} />;
    }
    const Icon = LUCIDE_ICONS[name] || Globe;
    return <Icon size={size} className={className} />;
};

const AssetPickerModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelect: (val: string, type?: string) => void;
    title?: string;
    description?: string;
    allowedTabs?: ('system' | 'media')[];
    initialTab?: 'system' | 'media';
    allowedMediaTypes?: ('image' | 'video' | 'document' | 'audio')[];
}> = ({ isOpen, onClose, onSelect, title, description, allowedTabs = ['system', 'media'], initialTab = 'system', allowedMediaTypes = ['image', 'video'] }) => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'system' | 'media' | 'external'>(initialTab as any || 'system');
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
    const [externalUrl, setExternalUrl] = useState('');
    const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab as any || 'system');
            setSearch('');
            setExternalUrl('');
            setMediaType(allowedMediaTypes.includes('image') ? 'image' : 'video');
        }
    }, [isOpen, initialTab, allowedMediaTypes.join(',')]);

    useEffect(() => {
        if (isOpen && activeTab === 'media') {
            setMediaAssets(db.media.search(search, mediaType));
        }
    }, [isOpen, activeTab, mediaType, search]);

    if (!isOpen) return null;

    const filteredIcons = Object.keys(LUCIDE_ICONS).filter(name =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 text-slate-800">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl h-[80vh] relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="p-8 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold">{title || 'Selector de Activos'}</h3>
                        <p className="text-slate-500 text-sm">{description || 'Selecciona el contenido adecuado para esta sección.'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="px-8 pt-4 flex gap-4 border-b border-slate-100">
                    {allowedTabs.includes('system') && (
                        <button
                            onClick={() => setActiveTab('system')}
                            className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'system' ? 'border-cafh-indigo text-cafh-indigo' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            Iconos del Sistema
                        </button>
                    )}
                    {allowedTabs.includes('media') && (
                        <button
                            onClick={() => setActiveTab('media')}
                            className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'media' ? 'border-cafh-indigo text-cafh-indigo' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            Biblioteca de Medios
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('external')}
                        className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'external' ? 'border-cafh-indigo text-cafh-indigo' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        URL Externa
                    </button>
                </div>

                <div className="p-6 pb-2 space-y-4">
                    {activeTab !== 'external' && (
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Buscar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm transition-all"
                            />
                        </div>
                    )}
                    {activeTab === 'media' && (
                        <div className="flex gap-2">
                            {allowedMediaTypes.includes('image') && (
                                <button
                                    onClick={() => setMediaType('image')}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mediaType === 'image' ? 'bg-cafh-indigo text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                >
                                    Imágenes
                                </button>
                            )}
                            {allowedMediaTypes.includes('video') && (
                                <button
                                    onClick={() => setMediaType('video')}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mediaType === 'video' ? 'bg-cafh-indigo text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                >
                                    Videos
                                </button>
                            )}
                            {allowedMediaTypes.includes('document') && (
                                <button
                                    onClick={() => setMediaType('image')} // Map to document if needed, reusing image for simplicity here
                                    className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-400"
                                >
                                    Documentos
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-2 custom-scrollbar">
                    {activeTab === 'external' ? (
                        <div className="space-y-6 flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
                            <div className="w-20 h-20 bg-cafh-indigo/5 rounded-full flex items-center justify-center text-cafh-indigo mb-2">
                                <Link2 size={32} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold">Vincular Recurso Externo</h4>
                                <p className="text-slate-500 text-sm">Pega la URL directa de la imagen o video (mp4, webm, etc.)</p>
                            </div>
                            <div className="w-full space-y-4">
                                <input
                                    type="url"
                                    placeholder="https://ejemplo.com/video.mp4"
                                    value={externalUrl}
                                    onChange={(e) => setExternalUrl(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-cafh-indigo outline-none transition-all"
                                />
                                <button
                                    disabled={!externalUrl}
                                    onClick={() => {
                                        onSelect(externalUrl, externalUrl.toLowerCase().includes('video') || ['.mp4', '.webm', '.ogg', '.3gp', '.mov'].some(ext => externalUrl.toLowerCase().endsWith(ext)) ? 'video' : 'image');
                                        onClose();
                                    }}
                                    className="w-full py-4 bg-cafh-indigo text-white rounded-full font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all"
                                >
                                    Confirmar y Seleccionar
                                </button>
                            </div>
                        </div>
                    ) : activeTab === 'system' ? (
                        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
                            {filteredIcons.map(name => {
                                const Icon = LUCIDE_ICONS[name];
                                return (
                                    <button
                                        key={name}
                                        onClick={() => {
                                            onSelect(name, 'icon');
                                            onClose();
                                        }}
                                        className="aspect-square flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-cafh-indigo/5 hover:text-cafh-indigo group transition-all"
                                        title={name}
                                    >
                                        <div className="w-10 h-10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                            <Icon size={24} />
                                        </div>
                                        <span className="text-[8px] font-bold uppercase tracking-tighter truncate w-full text-center text-slate-400 group-hover:text-cafh-indigo">{name}</span>
                                    </button>
                                );
                            })}
                            {filteredIcons.length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-400 italic">No se encontraron iconos.</div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                            {mediaAssets.map(asset => (
                                <button
                                    key={asset.id}
                                    onClick={() => {
                                        onSelect(asset.url, asset.type);
                                        onClose();
                                    }}
                                    className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden group relative hover:border-cafh-indigo hover:shadow-lg transition-all"
                                >
                                    {asset.type === 'video' ? (
                                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                            <Video className="text-white/20" size={32} />
                                            <video src={asset.url} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                        </div>
                                    ) : (
                                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    )}
                                    <div className="absolute inset-0 bg-cafh-indigo/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                        <p className="text-[8px] bg-white px-1.5 py-0.5 rounded font-bold text-slate-800 truncate w-full">{asset.name}</p>
                                    </div>
                                </button>
                            ))}
                            <label className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-cafh-indigo hover:text-cafh-indigo transition-all font-bold text-[10px] cursor-pointer hover:bg-slate-50">
                                <Plus size={24} className="mb-1" />
                                SUBIR RECURSO
                                <input
                                    type="file"
                                    className="hidden"
                                    accept={allowedMediaTypes.map(t => {
                                        if (t === 'image') return 'image/*,image/webp,image/avif,image/svg+xml';
                                        if (t === 'video') return 'video/*,video/webm,video/ogg,application/ogg,video/3gpp,audio/3gpp,.3gp';
                                        return '*/*';
                                    }).join(',')}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const isVideo = file.type.startsWith('video') || file.type.includes('ogg') || file.type.includes('3gp') || file.name.toLowerCase().endsWith('.3gp');
                                            const uploadedType = isVideo ? 'video' : file.type.startsWith('image') ? 'image' : 'document';

                                            // Lógica de resguardo anti-ruptura para la memoria local. 
                                            // Archivos pequeños se guardan nativamente, videos o assets pesados utilizan Blob temporal.
                                            const canSafelyPersist = file.size <= 500 * 1024 && !isVideo; // Limite 500kb max en Base64

                                            const finalizeUploadAndSave = (url: string) => {
                                                const newAsset = {
                                                    name: file.name,
                                                    type: uploadedType as 'image' | 'video' | 'document' | 'audio',
                                                    url: url,
                                                    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                                                    tags: ['upload local']
                                                };

                                                try {
                                                    db.media.add(newAsset); // Mock DB persistence
                                                } catch (err) {
                                                    console.warn('Local Storage limit protection bypassed');
                                                }
                                                // Responde al flujo natural de selección visual
                                                onSelect(url, uploadedType);
                                                onClose();
                                            };

                                            if (canSafelyPersist) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => finalizeUploadAndSave(event.target?.result as string);
                                                reader.readAsDataURL(file);
                                            } else {
                                                finalizeUploadAndSave(URL.createObjectURL(file));
                                            }
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PagePickerModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelect: (slug: string) => void;
    pages: CustomPage[];
}> = ({ isOpen, onClose, onSelect, pages }) => {
    const [search, setSearch] = useState('');

    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Globe size={20} className="text-cafh-indigo" />
                            Seleccionar Página Interna
                        </h3>
                        <p className="text-xs text-slate-500">Selecciona una de tus páginas personalizadas para el enlace.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="relative mb-6">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por título o ruta..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-cafh-indigo transition-all font-medium text-sm"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <button
                            onClick={() => { onSelect('/'); onClose(); }}
                            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-cafh-indigo/5 border border-transparent hover:border-cafh-indigo/20 rounded-2xl transition-all group"
                        >
                            <div className="text-left">
                                <p className="font-bold text-slate-800 text-sm group-hover:text-cafh-indigo">Página de Inicio</p>
                                <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">ruta: /</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-cafh-indigo" />
                        </button>

                        {pages.map(p => (
                            <button
                                key={p.id}
                                onClick={() => { onSelect(`/${p.slug}`); onClose(); }}
                                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-cafh-indigo/5 border border-transparent hover:border-cafh-indigo/20 rounded-2xl transition-all group"
                            >
                                <div className="text-left">
                                    <p className="font-bold text-slate-800 text-sm group-hover:text-cafh-indigo">{p.title}</p>
                                    <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">ruta: /{p.slug}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${p.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {p.status === 'Published' ? 'Activo' : 'Borrador'}
                                    </span>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-cafh-indigo" />
                                </div>
                            </button>
                        ))}

                        {pages.length === 0 && (
                            <div className="py-12 text-center text-slate-400">No hay otras páginas creadas aún.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

import { db } from '../storage';
import { AutomationFlowBuilder } from './AutomationFlowBuilder';
export { JourneyView, SettingsView } from './JourneyAndSettings';

import {
    Contact, ContactList, EmailLog, EmailMetrics, MediaAsset,
    HomeConfig, ChangeLog, MegaMenuItem, CustomPage, PageSection, SMTPConfig, Campaign,
    AutomationRule, AutomationExecution, AutomationNode, AutomationNodeType,
    SendEmailNode, WaitNode, ConditionNode, UpdateTagNode, MoveToListNode,
    WizardQuestion, WizardOptionEditable, ProfileType, ProfileKitItem,
    WizardConfig, UserWizardProfile, ContentCatalogItem, SiteSettings, AdminUser, UserRole
} from '../types';

// --- DASHBOARD ---

export const DashboardView: React.FC = () => {
    const contacts = useMemo(() => db.crm.getAll(), []);
    const emailLogs = useMemo(() => db.emails.getLogs(), []);
    const allContent = useMemo(() => db.content.getAll(), []);

    // --- KPI calculations (Live Data) ---
    const totalContacts = contacts.length;
    const subscribedContacts = contacts.filter(c => c.status === 'Subscribed').length;
    const pendingCount = contacts.filter(c => c.status === 'Pending' || c.status === 'new').length;
    const totalEmailsSent = emailLogs.length;
    const openedEmails = emailLogs.filter(l => l.status === 'Opened' || l.status === 'Clicked').length;
    const openRate = totalEmailsSent > 0 ? Math.round((openedEmails / totalEmailsSent) * 100) : 0;
    const effectivenessRate = totalContacts > 0 ? Math.round((subscribedContacts / totalContacts) * 100) : 0;

    // --- Recent activity from real email logs ---
    const recentActivity = emailLogs.slice(0, 8).map(log => {
        const contact = contacts.find(c => c.id === log.contactId);
        return { log, contactName: contact?.name || 'Contacto' };
    });

    // --- Top content by views ---
    const topContent = [...allContent].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

    // --- Email history chart from metrics ---
    const emailMetrics = db.emails.getMetrics();
    const emailHistoryChart = emailMetrics?.history?.map(h => ({
        date: h.date.slice(5), // "MM-DD"
        Enviados: h.sent,
        Abiertos: h.opened,
    })) || [];

    // --- Contact growth chart (simulate monthly from createdAt) ---
    const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const contactsByMonth = Array(12).fill(0);
    contacts.forEach(c => {
        if (c.createdAt) {
            const m = new Date(c.createdAt).getMonth();
            contactsByMonth[m]++;
        }
    });
    const contactGrowthChart = monthLabels.map((name, i) => ({ name, Contactos: contactsByMonth[i] }));

    const statusIcon = (status: string) => {
        if (status === 'Opened' || status === 'Clicked') return { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50' };
        if (status === 'Bounced' || status === 'Failed') return { icon: AlertCircle, color: 'text-red-500 bg-red-50' };
        return { icon: Mail, color: 'text-cafh-indigo/80 bg-cafh-indigo/5' };
    };

    const kpis = [
        {
            label: 'Cuentas Pendientes',
            value: pendingCount.toLocaleString(),
            sub: 'Aceptación de Admin requerida',
            icon: AlertTriangle,
            gradient: 'from-amber-500 to-orange-600',
            ring: 'ring-amber-200',
            textColor: 'text-white'
        },
        {
            label: 'Total Contactos CRM',
            value: totalContacts.toLocaleString(),
            sub: `${subscribedContacts} suscritos activos`,
            icon: Users,
            gradient: 'from-cafh-indigo to-blue-700',
            ring: 'ring-blue-100',
            textColor: 'text-white'
        },
        {
            label: 'Emails Enviados',
            value: totalEmailsSent.toLocaleString(),
            sub: `${openedEmails} abiertos (${openRate}%)`,
            icon: Send,
            gradient: 'from-emerald-500 to-teal-600',
            ring: 'ring-emerald-100',
            textColor: 'text-white'
        },
        {
            label: 'Tasa de Apertura',
            value: `${openRate}%`,
            sub: 'De todos los correos enviados',
            icon: BarChart2,
            gradient: 'from-purple-500 to-violet-600',
            ring: 'ring-purple-100',
            textColor: 'text-white'
        },
        {
            label: 'Tasa de Efectividad',
            value: `${effectivenessRate}%`,
            sub: `Suscriptos / Total inscritos`,
            icon: Activity,
            gradient: 'from-cafh-clay to-rose-700',
            ring: 'ring-rose-100',
            textColor: 'text-white'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Panel de Control</h2>
                <p className="text-slate-500 mt-1">Datos en tiempo real desde el CRM y módulos de contenido.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {kpis.map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={i} className={`relative overflow-hidden rounded-[1.75rem] p-6 bg-gradient-to-br ${kpi.gradient} shadow-xl ring-4 ${kpi.ring}`}>
                            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10"></div>
                            <div className="relative z-10">
                                <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                    <Icon size={22} className="text-white" />
                                </div>
                                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
                                <p className="text-3xl font-extrabold text-white tracking-tight mb-1">{kpi.value}</p>
                                <p className="text-white/60 text-xs">{kpi.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Email History Chart */}
                <div className="lg:col-span-3 bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Actividad de Emails</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Enviados vs Abiertos (últimos 7 días)</p>
                        </div>
                        <div className="flex gap-3 text-xs font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 text-cafh-indigo"><span className="w-2 h-2 rounded-full bg-cafh-indigo"></span>Enviados</span>
                            <span className="flex items-center gap-1.5 text-emerald-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Abiertos</span>
                        </div>
                    </div>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={emailHistoryChart}>
                                <defs>
                                    <linearGradient id="dbColorSent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1A428A" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#1A428A" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="dbColorOpen" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)' }} />
                                <Area type="monotone" dataKey="Enviados" stroke="#1A428A" fill="url(#dbColorSent)" strokeWidth={3} dot={false} />
                                <Area type="monotone" dataKey="Abiertos" stroke="#10b981" fill="url(#dbColorOpen)" strokeWidth={3} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Contact Growth */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Crecimiento de Contactos</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Por mes (año actual)</p>
                    </div>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={contactGrowthChart}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)' }} />
                                <Bar dataKey="Contactos" fill="#1A428A" radius={[6, 6, 0, 0]} />
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Recent Activity Feed (REAL DATA) */}
                <div className="lg:col-span-3 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-7 py-5 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Actividad Reciente</h3>
                            <p className="text-xs text-slate-400">Últimos registros de comunicación</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{emailLogs.length} total</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentActivity.length === 0 ? (
                            <div className="py-10 text-center text-slate-400 text-sm">Sin actividad registrada aún.</div>
                        ) : recentActivity.map(({ log, contactName }) => {
                            const { icon: StatusIcon, color } = statusIcon(log.status);
                            return (
                                <div key={log.id} className="flex items-center gap-4 px-7 py-4 hover:bg-slate-50/70 transition-colors">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                                        <StatusIcon size={15} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{log.subject}</p>
                                        <p className="text-xs text-slate-500">{contactName} · <span className="font-mono">{log.campaignName}</span></p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${log.status === 'Opened' || log.status === 'Clicked' ? 'bg-emerald-50 text-emerald-600' : log.status === 'Bounced' ? 'bg-red-50 text-red-600' : 'bg-cafh-indigo/5 text-cafh-indigo'}`}>
                                            {log.status}
                                        </span>
                                        <p className="text-[10px] text-slate-400 mt-1 font-mono">{log.sentAt}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Content */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-7 py-5 border-b border-slate-50">
                        <h3 className="text-lg font-bold text-slate-800">Contenido Más Visto</h3>
                        <p className="text-xs text-slate-400">Top artículos, recursos y páginas</p>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {topContent.length === 0 ? (
                            <p className="py-10 text-center text-xs text-slate-400">Sin datos de contenido.</p>
                        ) : topContent.map((item, i) => {
                            const maxViews = topContent[0]?.views || 1;
                            const pct = Math.round(((item.views || 0) / maxViews) * 100);
                            return (
                                <div key={item.id} className="px-7 py-4 hover:bg-slate-50/70 transition-colors">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-[10px] font-bold text-slate-400 w-4 shrink-0">#{i + 1}</span>
                                            <p className="text-sm font-bold text-slate-700 truncate">{item.title}</p>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 shrink-0 ml-2">{(item.views || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-6">
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-cafh-indigo/60 rounded-full transition-all duration-700" style={{ width: `${pct}%` }}></div>
                                        </div>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${item.type === 'Article' ? 'bg-cafh-indigo/5 text-cafh-indigo' : item.type === 'Resource' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'}`}>{item.type}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- CRM & CONTACTS MODULE ---

const ContactOffCanvas: React.FC<{
    contact: Contact | null;
    isOpen: boolean;
    onClose: () => void;
    onSendEmail: (contact: Contact) => void;
    onSync: (contact: Contact) => void;
    onEditRequest?: () => void;
}> = ({ contact, isOpen, onClose, onSendEmail, onSync, onEditRequest }) => {
    const [logs, setLogs] = useState<EmailLog[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [showMetrics, setShowMetrics] = useState(false);
    const [availableLists, setAvailableLists] = useState<ContactList[]>([]);

    // Derived metrics for current contact
    const totalEmails = logs.length;
    const opened = logs.filter(l => l.status === 'Opened' || l.status === 'Clicked').length;
    const clicked = logs.filter(l => l.status === 'Clicked').length;
    const openRate = totalEmails > 0 ? Math.round((opened / totalEmails) * 100) : 0;

    useEffect(() => {
        if (contact) {
            setLogs(db.emails.getLogs(contact.id));
            setAvailableLists(db.crm.getLists());
        }
    }, [contact]);

    if (!contact) return null;

    const handleSync = async () => {
        setIsSyncing(true);
        await onSync(contact);
        setIsSyncing(false);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400">
                                {contact.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                    {contact.name}
                                    {contact.role && (contact.role.toLowerCase() === 'admin' || contact.role.toLowerCase() === 'tenant' || contact.role.toLowerCase() === 'user') && (
                                        <span className="bg-cafh-indigo text-white text-[10px] px-2 py-0.5 rounded-md uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                            <Shield size={10} /> Sistema
                                        </span>
                                    )}
                                </h3>
                                <div className="text-sm text-slate-500">{contact.email}</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {onEditRequest && (
                                <button onClick={onEditRequest} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400" title="Editar Contacto">
                                    <Edit size={20} />
                                </button>
                            )}
                            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400" title="Cerrar Panel">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => onSendEmail(contact)}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-cafh-indigo/5 text-cafh-indigo hover:bg-cafh-indigo/10 transition-colors"
                            >
                                <Mail size={20} />
                                <span className="text-[10px] font-bold uppercase">Email</span>
                            </button>
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                title="Sincronizar este perfil con tu base en Mailrelay"
                                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
                                <span className="text-[10px] font-bold uppercase">Sincronizar</span>
                            </button>
                            <button
                                onClick={() => setShowMetrics(!showMetrics)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${showMetrics ? 'bg-cafh-indigo text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                            >
                                <BarChart2 size={20} />
                                <span className="text-[10px] font-bold uppercase">Métricas</span>
                            </button>
                        </div>

                        {/* Individual Metrics View */}
                        {showMetrics && (
                            <div className="bg-white border text-center border-slate-200 rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Rendimiento Individual</h4>
                                <div className="grid grid-cols-3 gap-0 divide-x divide-slate-100">
                                    <div className="px-2">
                                        <p className="text-2xl font-bold text-cafh-indigo">{totalEmails}</p>
                                        <p className="text-[9px] uppercase font-bold text-slate-400 mt-1">Enviados</p>
                                    </div>
                                    <div className="px-2">
                                        <p className="text-2xl font-bold text-emerald-500">{openRate}%</p>
                                        <p className="text-[9px] uppercase font-bold text-slate-400 mt-1">Apertura</p>
                                    </div>
                                    <div className="px-2">
                                        <p className="text-2xl font-bold text-purple-600">{clicked}</p>
                                        <p className="text-[9px] uppercase font-bold text-slate-400 mt-1">Clics</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 px-2 flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-400">Puntaje Engagement:</span>
                                    <span className="font-bold text-slate-800 pr-2">{contact.engagementScore || 0}/100</span>
                                </div>
                            </div>
                        )}

                        {/* Details */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Información de Contacto</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><Phone size={16} /></div>
                                    <span className="text-slate-700">{contact.phone || 'No registrado'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><MapPin size={16} /></div>
                                    <span className="text-slate-700">{contact.city ? `${contact.city}, ${contact.country}` : 'No registrado'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><Shield size={16} /></div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${contact.status === 'Subscribed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {contact.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><Globe size={16} /></div>
                                    <span className="text-slate-500 text-xs">Mailrelay ID: <span className="font-mono text-slate-700">{contact.mailrelayId || 'Pendiente'}</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Lists and Tags */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Listas & Segmentos</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(contact.listIds && contact.listIds.length > 0) ? (
                                        availableLists.filter(l => contact.listIds?.includes(l.id)).map(list => (
                                            <span key={list.id} className="px-3 py-1 bg-cafh-indigo/5 border border-blue-100 rounded-full text-xs font-bold text-cafh-indigo shadow-sm flex items-center gap-1.5">
                                                <Layers size={12} />
                                                {list.name}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                                            <AlertCircle size={12} />
                                            Sin Listas Asignadas
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Etiquetas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {contact.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                    <button className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-cafh-indigo hover:text-cafh-indigo transition-colors" title="Agregar Etiqueta">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Email History */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Historial de Envíos</h4>
                                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">{logs.length} Total</span>
                            </div>
                            <div className="space-y-3">
                                {logs.length > 0 ? logs.map(log => (
                                    <div key={log.id} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-slate-800 truncate pr-2">{log.subject}</span>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${log.status === 'Opened' || log.status === 'Clicked' ? 'bg-green-100 text-green-700' :
                                                log.status === 'Bounced' ? 'bg-red-100 text-red-700' : 'bg-cafh-indigo/10 text-cafh-indigo'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                                            <span>{log.campaignName}</span>
                                            <span>{log.sentAt}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-6 text-slate-400 text-xs italic">
                                        No hay registros de envíos recientes.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-center">
                        <span className="font-display font-bold text-2xl text-slate-300 tracking-widest uppercase py-2">Cafh</span>
                    </div>
                </div>
            </div >
        </>
    );
};

const EmailComposerModal: React.FC<{
    contact: Contact | null;
    isOpen: boolean;
    onClose: () => void;
    onSend: (subject: string, content: string) => void;
}> = ({ contact, isOpen, onClose, onSend }) => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

    if (!contact || !isOpen) return null;

    const handleSend = async () => {
        if (!subject || !content) return;
        setIsSending(true);
        await onSend(subject, content);
        setIsSending(false);
        onClose();
        setSubject('');
        setContent('');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">Redactar Email</h3>
                            <p className="text-slate-500">Enviando a: <span className="font-bold text-cafh-indigo">{contact.name}</span></p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Asunto</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Escribe el asunto del correo..."
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Contenido del Mensaje</label>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setViewMode('editor')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === 'editor' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Editor HTML
                                    </button>
                                    <button
                                        onClick={() => setViewMode('preview')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Vista Previa
                                    </button>
                                </div>
                            </div>

                            {viewMode === 'editor' ? (
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={10}
                                    placeholder="<h1>Título</h1><p>Escribe tu mensaje HTML aquí...</p>"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all resize-none font-mono text-xs"
                                />
                            ) : (
                                <div
                                    className="w-full h-[240px] px-5 py-4 bg-white border border-slate-200 rounded-2xl overflow-y-auto"
                                    dangerouslySetInnerHTML={{ __html: content || '<p style="color:#94a3b8; font-style:italic;">No hay contenido para previsualizar.</p>' }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={isSending || !subject || !content}
                            className="flex-[2] py-4 bg-cafh-indigo text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSending ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
                            <span>{isSending ? 'Enviando...' : 'Enviar Email'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CRMView: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
    const [isCampaignOrchestratorOpen, setIsCampaignOrchestratorOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isMassEmailModalOpen, setIsMassEmailModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isSMTPSettingsOpen, setIsSMTPSettingsOpen] = useState(false);
    const [isListsOffCanvasOpen, setIsListsOffCanvasOpen] = useState(false);
    const [isContactEditorOpen, setIsContactEditorOpen] = useState(false);
    const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
    const [allEmailLogs, setAllEmailLogs] = useState<EmailLog[]>([]);
    const [metrics, setMetrics] = useState<EmailMetrics | null>(null);
    const [showMetrics, setShowMetrics] = useState(false);
    const [queueStatus, setQueueStatus] = useState<{ pending: number, sent: number, failed: number, sentCountThisHour: number, limit: number } | null>(null);

    const [selectedMetricsList, setSelectedMetricsList] = useState<string>('all');
    const availableLists = useMemo(() => db.crm.getLists(), [contacts]);

    // ── Search / Filter / Pagination / Selection ───────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'Subscribed' | 'Unsubscribed' | 'Pending' | 'Bounced'>('all');
    const [filterList, setFilterList] = useState<string>('all');
    const [filterTag, setFilterTag] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 50;
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showBulkTagInput, setShowBulkTagInput] = useState(false);
    const [bulkTag, setBulkTag] = useState('');
    const [showBulkListInput, setShowBulkListInput] = useState(false);
    const [bulkListId, setBulkListId] = useState('');

    // All tags derived from contacts
    const allContactTags = useMemo(() => {
        const s = new Set<string>();
        contacts.forEach(c => c.tags?.forEach(t => s.add(t)));
        return Array.from(s).sort();
    }, [contacts]);

    // Filtered set
    const filteredContacts = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return contacts.filter(c => {
            if (q && !c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q) && !(c.tags || []).some(t => t.toLowerCase().includes(q))) return false;
            if (filterStatus !== 'all' && c.status !== filterStatus) return false;
            if (filterList !== 'all' && !(c.listIds || []).includes(filterList)) return false;
            if (filterTag && !(c.tags || []).includes(filterTag)) return false;
            return true;
        });
    }, [contacts, searchQuery, filterStatus, filterList, filterTag]);

    const totalPages = Math.max(1, Math.ceil(filteredContacts.length / PAGE_SIZE));
    const paginatedContacts = useMemo(() =>
        filteredContacts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filteredContacts, currentPage]);

    // Reset page on filter change
    const handleFilterChange = (fn: () => void) => { fn(); setCurrentPage(1); setSelectedIds(new Set()); };

    // Bulk actions
    const handleBulkDelete = () => {
        if (!confirm(`¿Eliminar ${selectedIds.size} contactos?`)) return;
        selectedIds.forEach(id => db.crm.delete(id));
        setContacts(db.crm.getAll());
        setSelectedIds(new Set());
    };
    const handleBulkAddTag = () => {
        if (!bulkTag.trim()) return;
        selectedIds.forEach(id => {
            const c = contacts.find(x => x.id === id);
            if (!c) return;
            const tags = Array.from(new Set([...(c.tags || []), bulkTag.trim()]));
            db.crm.save({ ...c, tags });
        });
        setContacts(db.crm.getAll());
        setBulkTag(''); setShowBulkTagInput(false); setSelectedIds(new Set());
    };
    const handleBulkAddToList = () => {
        if (!bulkListId) return;
        selectedIds.forEach(id => {
            const c = contacts.find(x => x.id === id);
            if (!c) return;
            const listIds = Array.from(new Set([...(c.listIds || []), bulkListId]));
            db.crm.save({ ...c, listIds });
        });
        setContacts(db.crm.getAll());
        setBulkListId(''); setShowBulkListInput(false); setSelectedIds(new Set());
    };
    const handleBulkSubscribe = (status: Contact['status']) => {
        selectedIds.forEach(id => {
            const c = contacts.find(x => x.id === id);
            if (c) db.crm.save({ ...c, status });
        });
        setContacts(db.crm.getAll());
        setSelectedIds(new Set());
    };
    const toggleSelectAll = () => {
        if (selectedIds.size === paginatedContacts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(paginatedContacts.map(c => c.id)));
        }
    };

    const displayedMetrics = useMemo(() => {
        if (!metrics) return null;
        if (selectedMetricsList === 'all') return metrics;

        const contactsInList = contacts.filter(c => c.listIds?.includes(selectedMetricsList));
        const contactIds = new Set(contactsInList.map(c => c.id));
        const logsForList = allEmailLogs.filter(l => contactIds.has(l.contactId));

        if (logsForList.length === 0 || contactsInList.length === 0) {
            return { ...metrics, openRate: 0, clickRate: 0, bounceRate: 0, history: metrics.history.map(h => ({ ...h, sent: 0, opened: 0 })) };
        }

        const openedCount = logsForList.filter(l => l.status === 'Opened' || l.status === 'Clicked').length;
        const clickedCount = logsForList.filter(l => l.status === 'Clicked').length;
        const bouncedCount = logsForList.filter(l => l.status === 'Bounced').length;

        const openRate = Math.round((openedCount / logsForList.length) * 100);
        const clickRate = Math.round((clickedCount / logsForList.length) * 100);
        const bounceRate = Math.round((bouncedCount / logsForList.length) * 100);

        const ratio = contactsInList.length / (contacts.length || 1);
        const history = metrics.history.map(h => ({
            date: h.date,
            sent: Math.round(h.sent * ratio),
            opened: Math.round(h.opened * ratio)
        }));

        return { ...metrics, openRate, clickRate, bounceRate, history };
    }, [metrics, selectedMetricsList, allEmailLogs, contacts]);

    useEffect(() => {
        setContacts(db.crm.getAll());
        setMetrics(db.emails.getMetrics());
        setAllEmailLogs(db.emails.getLogs());

        const fetchQueue = async () => {
            const status = await db.emails.getQueueStatus();
            setQueueStatus(status);
        };
        fetchQueue();
        const interval = setInterval(fetchQueue, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const handleContactClick = (contact: Contact) => {
        setSelectedContact(contact);
        setIsOffCanvasOpen(true);
    };

    const handleSendEmail = (contact: Contact) => {
        setSelectedContact(contact);
        setIsEmailModalOpen(true);
    };

    const onEmailSent = async (subject: string, content: string) => {
        if (selectedContact) {
            await db.emails.send(selectedContact.id, subject, content);
            setContacts(db.crm.getAll());
            setAllEmailLogs(db.emails.getLogs());
        }
    };

    const handleEditRequest = (contact: Contact | null) => {
        setContactToEdit(contact);
        setIsContactEditorOpen(true);
        setIsOffCanvasOpen(false);
    };

    const onContactSaved = () => {
        setContacts(db.crm.getAll());
        setIsContactEditorOpen(false);
        setContactToEdit(null);
    };

    const handleApproveMember = async (contact: Contact) => {
        if (!confirm(`¿Estás seguro de que deseas aprobar y activar la cuenta de ${contact.name}? Se le enviará un correo de bienvenida automático.`)) return;
        const result = await db.admin.approveMember(contact.id);
        if (result) {
            setContacts(db.crm.getAll());
            // Optionally refresh email logs too since a welcome email was sent
            setAllEmailLogs(db.emails.getLogs());
        }
    };

    const onMassEmailSent = async (subject: string, content: string) => {
        const recipients = contacts.filter(c => c.status === 'Subscribed').map(c => c.email);
        if (recipients.length > 0) {
            await db.emails.sendMass(recipients, subject, content);
            alert(`${recipients.length} correos agregados a la cola de envío local.`);
        }
    };

    const onSyncMailrelay = async (contact: Contact) => {
        const updated = await db.mailrelay.syncContact(contact);
        setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
        setSelectedContact(updated);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Gestión de Contactos</h2>
                    <p className="text-slate-500">Centraliza tu comunidad, automatizaciones y métricas de envío.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsListsOffCanvasOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm"
                    >
                        <Layers size={18} />
                        <span>Listas / Segmentos</span>
                    </button>
                    <button
                        onClick={() => setIsCampaignOrchestratorOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-cafh-indigo text-white rounded-xl hover:bg-slate-900 transition-all font-bold text-sm shadow-lg shadow-indigo-100"
                    >
                        <Send size={18} />
                        <span>Campañas</span>
                        {(() => { const cnt = (() => { try { return JSON.parse(localStorage.getItem('cafh_campaigns_v1') || '[]').length; } catch { return 0; } })(); return cnt > 0 ? <span className="bg-white/30 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cnt}</span> : null; })()}
                    </button>
                    <button
                        onClick={() => setShowMetrics(!showMetrics)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold text-sm ${showMetrics ? 'bg-cafh-indigo text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <BarChart2 size={18} />
                        <span>{showMetrics ? 'Ocultar Métricas' : 'Ver Métricas'}</span>
                    </button>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm"
                    >
                        <Database size={18} />
                        <span>Carga Masiva</span>
                    </button>
                    <button
                        onClick={() => setIsSMTPSettingsOpen(true)}
                        className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all"
                        title="Ajustes de Servidor de Envío"
                    >
                        <Settings size={18} />
                    </button>
                    <button
                        onClick={() => handleEditRequest(null)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-cafh-indigo text-white rounded-xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 font-bold text-sm"
                    >
                        <Plus size={18} />
                        <span>Nuevo Contacto</span>
                    </button>
                </div>
            </div>

            {/* Metrics Dashboard (Collapsible) */}
            {showMetrics && displayedMetrics && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="lg:col-span-3 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-slate-800">Comportamiento de Envíos</h3>
                                <select
                                    value={selectedMetricsList}
                                    onChange={e => setSelectedMetricsList(e.target.value)}
                                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none hover:border-cafh-indigo transition-colors"
                                >
                                    <option value="all">Todas las Listas</option>
                                    {availableLists.map(list => (
                                        <option key={list.id} value={list.id}>{list.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-1.5 text-cafh-indigo"><span className="w-2 h-2 rounded-full bg-cafh-indigo"></span> Enviados</span>
                                <span className="flex items-center gap-1.5 text-emerald-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Abiertos</span>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={displayedMetrics.history}>
                                    <defs>
                                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="sent" stroke="#1e3a8a" fill="url(#colorSent)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="opened" stroke="#10b981" fill="transparent" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {/* Queue Throttling Status */}
                        {queueStatus && (
                            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl border border-slate-800">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Estado de Envío Local</h4>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Activo</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400">Lote por hora (cPanel)</span>
                                            <span className="font-bold">{queueStatus.sentCountThisHour} / {queueStatus.limit}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-cafh-indigo/50 transition-all duration-500"
                                                style={{ width: `${(queueStatus.sentCountThisHour / queueStatus.limit) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                                            <p className="text-[9px] text-slate-500 uppercase font-bold">En Cola</p>
                                            <p className="text-lg font-bold">{queueStatus.pending}</p>
                                        </div>
                                        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                                            <p className="text-[9px] text-slate-500 uppercase font-bold">Enviados</p>
                                            <p className="text-lg font-bold">{queueStatus.sent}</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-slate-500 italic">
                                        * El sistema procesa lotes de {queueStatus.limit} mails/hora para evitar SPAM y mantener lista blanca.
                                    </p>
                                </div>
                            </div>
                        )}
                        {[
                            { label: 'Tasa de Apertura', value: `${displayedMetrics.openRate}%`, icon: CheckCircle2, color: 'emerald' },
                            { label: 'Tasa de Clics', value: `${displayedMetrics.clickRate}%`, icon: Send, color: 'blue' },
                            { label: 'Rebotes (Bounces)', value: `${displayedMetrics.bounceRate}%`, icon: AlertCircle, color: 'red' },
                        ].map((m, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-${m.color}-50 text-${m.color}-600 flex items-center justify-center`}>
                                    <m.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
                                    <p className="text-xl font-bold text-slate-800">{m.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contacts Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col gap-3">
                    {/* Urgency Alert: Pending Activations */}
                    {contacts.some(c => c.status === 'Pending') && (
                        <div className={`p-4 rounded-2xl flex items-center justify-between mb-2 transition-all ${filterStatus === 'Pending' ? 'bg-amber-100 border border-amber-200' : 'bg-amber-50 border border-amber-100 animate-pulse'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow-sm">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-amber-800">
                                        {filterStatus === 'Pending' ? 'Revisando Cuentas Pendientes' : 'Cuentas Pendientes de Activación'}
                                    </p>
                                    <p className="text-xs text-amber-600">Hay {contacts.filter(c => c.status === 'Pending').length} miembros esperando aprobación.</p>
                                </div>
                            </div>
                            {filterStatus !== 'Pending' && (
                                <button
                                    onClick={() => handleFilterChange(() => setFilterStatus('Pending'))}
                                    className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200"
                                >
                                    Ver Pendientes
                                </button>
                            )}
                        </div>
                    )}

                    {/* Search row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => handleFilterChange(() => setSearchQuery(e.target.value))}
                                placeholder="Buscar por nombre, email o etiqueta..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm transition-all"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <select value={filterStatus} onChange={e => handleFilterChange(() => setFilterStatus(e.target.value as any))}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-cafh-indigo cursor-pointer">
                                <option value="all">Todos los estados</option>
                                <option value="Subscribed">✅ Suscritos</option>
                                <option value="Pending">🕐 Pendientes</option>
                                <option value="Unsubscribed">🚫 Desuscritos</option>
                                <option value="Bounced">⚠️ Rebotados</option>
                            </select>
                            <select value={filterList} onChange={e => handleFilterChange(() => setFilterList(e.target.value))}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-cafh-indigo cursor-pointer">
                                <option value="all">Todas las listas</option>
                                {availableLists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                            {allContactTags.length > 0 && (
                                <select value={filterTag} onChange={e => handleFilterChange(() => setFilterTag(e.target.value))}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-cafh-indigo cursor-pointer">
                                    <option value="">Todos los tags</option>
                                    {allContactTags.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            )}
                            {(searchQuery || filterStatus !== 'all' || filterList !== 'all' || filterTag) && (
                                <button onClick={() => handleFilterChange(() => { setSearchQuery(''); setFilterStatus('all'); setFilterList('all'); setFilterTag(''); })}
                                    className="px-3 py-2 text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1">
                                    <X size={12} /> Limpiar
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-slate-400">
                        <strong className="text-slate-600">{filteredContacts.length}</strong> resultado{filteredContacts.length !== 1 ? 's' : ''}
                        {filteredContacts.length !== contacts.length && <span className="text-cafh-indigo ml-1">(de {contacts.length} total)</span>}
                        {selectedIds.size > 0 && <span className="ml-3 font-bold text-cafh-indigo">· {selectedIds.size} seleccionados</span>}
                    </p>
                </div>

                {/* ── Bulk Selection Toolbar ─────────────────────── */}
                {selectedIds.size > 0 && (
                    <div className="mx-6 mb-0 mt-0 px-5 py-3 bg-cafh-indigo rounded-2xl flex items-center gap-3 flex-wrap animate-in slide-in-from-top-2 duration-200">
                        <span className="text-white font-bold text-sm">{selectedIds.size} seleccionados</span>
                        <div className="h-4 w-px bg-white/30" />
                        {/* Email masivo a seleccionados */}
                        <button onClick={() => { setIsMassEmailModalOpen(true); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-all">
                            <Mail size={13} /> Enviar Email
                        </button>
                        {/* Add Tag */}
                        {showBulkTagInput ? (
                            <div className="flex items-center gap-2">
                                <input value={bulkTag} onChange={e => setBulkTag(e.target.value)}
                                    placeholder="Nombre del tag" autoFocus
                                    className="px-3 py-1.5 rounded-lg bg-white text-slate-800 text-xs outline-none w-36 font-medium"
                                    onKeyDown={e => e.key === 'Enter' && handleBulkAddTag()}
                                />
                                <button onClick={handleBulkAddTag} className="px-2 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold">✓</button>
                                <button onClick={() => setShowBulkTagInput(false)} className="px-2 py-1.5 bg-white/20 text-white rounded-lg text-xs font-bold">✕</button>
                            </div>
                        ) : (
                            <button onClick={() => setShowBulkTagInput(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-all">
                                <Hash size={13} /> Agregar Tag
                            </button>
                        )}
                        {/* Add to List */}
                        {showBulkListInput ? (
                            <div className="flex items-center gap-2">
                                <select value={bulkListId} onChange={e => setBulkListId(e.target.value)}
                                    className="px-3 py-1.5 rounded-lg bg-white text-slate-800 text-xs outline-none font-medium">
                                    <option value="">— Lista —</option>
                                    {availableLists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                                <button onClick={handleBulkAddToList} className="px-2 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold">✓</button>
                                <button onClick={() => setShowBulkListInput(false)} className="px-2 py-1.5 bg-white/20 text-white rounded-lg text-xs font-bold">✕</button>
                            </div>
                        ) : (
                            <button onClick={() => setShowBulkListInput(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-all">
                                <Layers size={13} /> Agregar a Lista
                            </button>
                        )}
                        <button onClick={() => handleBulkSubscribe('Subscribed')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all">
                            <CheckCircle2 size={13} /> Suscribir
                        </button>
                        <button onClick={() => handleBulkSubscribe('Unsubscribed')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all">
                            <X size={13} /> Desuscribir
                        </button>
                        <button onClick={handleBulkDelete}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-all ml-auto">
                            <Trash2 size={13} /> Eliminar
                        </button>
                        <button onClick={() => setSelectedIds(new Set())} className="text-white/60 hover:text-white text-xs font-bold transition-colors">
                            Cancelar
                        </button>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-5 py-4">
                                    <input type="checkbox"
                                        checked={paginatedContacts.length > 0 && selectedIds.size === paginatedContacts.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 accent-cafh-indigo rounded cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contacto</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Tags</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden xl:table-cell">Envíos</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden xl:table-cell">Engagement</th>
                                <th className="px-4 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedContacts.length === 0 ? (
                                <tr><td colSpan={7} className="px-8 py-16 text-center text-slate-400 text-sm">Sin resultados para la búsqueda actual.</td></tr>
                            ) : paginatedContacts.map((contact) => {
                                const isSelected = selectedIds.has(contact.id);
                                return (
                                    <tr
                                        key={contact.id}
                                        className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${isSelected ? 'bg-cafh-indigo/5/60' : ''}`}
                                    >
                                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                            <input type="checkbox" checked={isSelected}
                                                onChange={() => {
                                                    setSelectedIds(prev => {
                                                        const next = new Set(prev);
                                                        if (next.has(contact.id)) next.delete(contact.id); else next.add(contact.id);
                                                        return next;
                                                    });
                                                }}
                                                className="w-4 h-4 accent-cafh-indigo rounded cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-4" onClick={() => handleContactClick(contact)}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${isSelected ? 'bg-cafh-indigo text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-cafh-indigo group-hover:text-white'}`}>
                                                    {contact.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 group-hover:text-cafh-indigo transition-colors text-sm">{contact.name}</div>
                                                    <div className="text-xs text-slate-400">{contact.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4" onClick={() => handleContactClick(contact)}>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${contact.status === 'Subscribed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                contact.status === 'Bounced' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                    contact.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                        'bg-slate-100 text-slate-600 border border-slate-200'
                                                }`}>
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 hidden lg:table-cell" onClick={() => handleContactClick(contact)}>
                                            <div className="flex flex-wrap gap-1">
                                                {(contact.tags || []).slice(0, 3).map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{tag}</span>
                                                ))}
                                                {(contact.tags || []).length > 3 && (
                                                    <span className="px-2 py-0.5 bg-slate-200 text-slate-500 text-[10px] font-bold rounded-full">+{(contact.tags || []).length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 hidden xl:table-cell" onClick={() => handleContactClick(contact)}>
                                            <div className="flex gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                                                <span title="Unitarios" className="bg-cafh-indigo/5 text-cafh-indigo px-1.5 py-0.5 rounded">U: {allEmailLogs.filter(l => l.contactId === contact.id && l.campaignName === 'Direct Message').length}</span>
                                                <span title="Masivos" className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">M: {allEmailLogs.filter(l => l.contactId === contact.id && l.campaignName !== 'Direct Message').length}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 hidden xl:table-cell" onClick={() => handleContactClick(contact)}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${contact.engagementScore > 70 ? 'bg-emerald-500' : contact.engagementScore > 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                                                        style={{ width: `${contact.engagementScore}%` }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400">{contact.engagementScore}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                                {contact.status === 'Pending' && (
                                                    <button onClick={(e) => { e.stopPropagation(); handleApproveMember(contact); }}
                                                        title="Aprobar y Activar Miembro"
                                                        className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors shadow-sm">
                                                        <CheckCircle2 size={14} />
                                                    </button>
                                                )}
                                                <button onClick={(e) => { e.stopPropagation(); handleSendEmail(contact); }}
                                                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-cafh-indigo hover:border-cafh-indigo transition-colors shadow-sm">
                                                    <Mail size={14} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleEditRequest(contact); }}
                                                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                                                    <Edit size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ─────────────────────────────────── */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                    <p className="text-xs text-slate-400 font-medium">
                        Mostrando <strong className="text-slate-700">{((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filteredContacts.length)}</strong> de <strong className="text-slate-700">{filteredContacts.length}</strong> contactos
                        {filteredContacts.length !== contacts.length && <span className="ml-1 text-cafh-indigo">(filtrado de {contacts.length})</span>}
                    </p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
                            className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">«</button>
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">‹ Anterior</button>

                        {/* Page number pills */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                            const page = start + i;
                            return (
                                <button key={page} onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 text-xs font-bold rounded-xl transition-all ${page === currentPage ? 'bg-cafh-indigo text-white shadow-lg shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}>{page}</button>
                            );
                        })}

                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Siguiente ›</button>
                        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
                            className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">»</button>
                    </div>
                </div>
            </div>

            {/* Modals & Off-canvas */}
            <ContactOffCanvas
                contact={selectedContact}
                isOpen={isOffCanvasOpen}
                onClose={() => setIsOffCanvasOpen(false)}
                onSendEmail={handleSendEmail}
                onSync={onSyncMailrelay}
                onEditRequest={() => handleEditRequest(selectedContact)}
            />

            <ContactEditorModal
                isOpen={isContactEditorOpen}
                initialContact={contactToEdit}
                onClose={() => setIsContactEditorOpen(false)}
                onSave={onContactSaved}
            />

            <EmailComposerModal
                contact={selectedContact}
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSend={onEmailSent}
            />

            <MassEmailComposerModal
                recipientCount={contacts.filter(c => c.status === 'Subscribed').length}
                isOpen={isMassEmailModalOpen}
                onClose={() => setIsMassEmailModalOpen(false)}
                onSend={onMassEmailSent}
            />

            <ImportContactsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportSuccess={(count) => {
                    setContacts(db.crm.getAll());
                    setIsImportModalOpen(false);
                    alert(`¡${count} contactos importados exitosamente!`);
                }}
            />

            <SMTPSettingsModal
                isOpen={isSMTPSettingsOpen}
                onClose={() => setIsSMTPSettingsOpen(false)}
            />

            <CampaignOrchestratorModal
                isOpen={isCampaignOrchestratorOpen}
                onClose={() => setIsCampaignOrchestratorOpen(false)}
                contacts={contacts}
                onCampaignSent={() => { setContacts(db.crm.getAll()); setAllEmailLogs(db.emails.getLogs()); }}
            />

            <ContactListsOffCanvas
                isOpen={isListsOffCanvasOpen}
                onClose={() => setIsListsOffCanvasOpen(false)}
            />
        </div>
    );
};

// ============================================================
// --- CAMPAIGN ORCHESTRATOR MODAL ---
// ============================================================
type CampaignTab = 'list' | 'create' | 'edit';

const CampaignOrchestratorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    contacts: Contact[];
    onCampaignSent: () => void;
}> = ({ isOpen, onClose, contacts, onCampaignSent }) => {
    const [tab, setTab] = useState<CampaignTab>('list');
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [availableLists, setAvailableLists] = useState<ContactList[]>([]);
    const [isLaunching, setIsLaunching] = useState(false);
    const [launchResult, setLaunchResult] = useState<{ recipientCount: number } | null>(null);

    // --- Wizard State ---
    const [wizardStep, setWizardStep] = useState(1);
    // Step 1: Identificación
    const [formName, setFormName] = useState('');
    const [formSubject, setFormSubject] = useState('');
    const [formPreviewText, setFormPreviewText] = useState('');
    // Step 2: Audiencia
    const [formRecipientType, setFormRecipientType] = useState<'all' | 'subscribed' | 'list' | 'tag'>('subscribed');
    const [formListId, setFormListId] = useState('');
    const [formTag, setFormTag] = useState('');
    // Step 3: Contenido
    const [formTitle, setFormTitle] = useState('');
    const [formSubtitle, setFormSubtitle] = useState('');
    const [formContent, setFormContent] = useState('');
    const [formViewMode, setFormViewMode] = useState<'editor' | 'preview' | 'emailPreview'>('editor');
    // Step 4: Testing
    const [wizardTestEmail, setWizardTestEmail] = useState('');
    const [isWizardTesting, setIsWizardTesting] = useState(false);
    const [wizardTestSent, setWizardTestSent] = useState(false);
    const [wizardTestCampaignId, setWizardTestCampaignId] = useState<string | null>(null);
    // Step 5: Envío
    const [sendMode, setSendMode] = useState<'now' | 'schedule'>('now');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('09:00');

    // Test send (from campaign list)
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [testSent, setTestSent] = useState(false);

    // All unique tags from contacts
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        contacts.forEach(c => c.tags?.forEach(t => tagSet.add(t)));
        return Array.from(tagSet).sort();
    }, [contacts]);

    const refreshData = () => {
        setCampaigns(db.campaigns.getAll());
        setAvailableLists(db.crm.getLists());
    };

    useEffect(() => {
        if (isOpen) refreshData();
    }, [isOpen]);

    const resetForm = () => {
        setWizardStep(1);
        setFormName(''); setFormSubject(''); setFormPreviewText('');
        setFormRecipientType('subscribed'); setFormListId(''); setFormTag('');
        setFormTitle(''); setFormSubtitle(''); setFormContent(''); setFormViewMode('editor');
        setWizardTestEmail(''); setWizardTestSent(false); setWizardTestCampaignId(null);
        setSendMode('now'); setScheduledDate(''); setScheduledTime('09:00');
    };

    const estimatedRecipients = useMemo(() => {
        if (formRecipientType === 'all') return contacts.length;
        if (formRecipientType === 'subscribed') return contacts.filter(c => c.status === 'Subscribed').length;
        if (formRecipientType === 'list' && formListId) return contacts.filter(c => c.listIds?.includes(formListId)).length;
        if (formRecipientType === 'tag' && formTag) return contacts.filter(c => c.tags?.includes(formTag)).length;
        return 0;
    }, [formRecipientType, formListId, formTag, contacts]);

    // Build campaign content (combines title/subtitle/body)
    const builtContent = useMemo(() => {
        const t = formTitle ? `<h1 style="font-family:sans-serif;color:#1A428A;margin-bottom:8px">${formTitle}</h1>` : '';
        const s = formSubtitle ? `<h2 style="font-family:sans-serif;color:#64748b;font-size:1.1em;margin-bottom:16px;font-weight:400">${formSubtitle}</h2>` : '';
        return `${t}${s}${formContent}`;
    }, [formTitle, formSubtitle, formContent]);

    const handleSaveDraft = (finalStatus: Campaign['status'] = 'Draft') => {
        if (!formName || !formSubject) return;
        const data = {
            name: formName, subject: formSubject, content: builtContent,
            status: finalStatus,
            recipientType: formRecipientType as 'all' | 'subscribed' | 'list',
            listId: formRecipientType === 'list' ? formListId || undefined : undefined,
            recipientCount: estimatedRecipients,
            scheduledAt: sendMode === 'schedule' ? `${scheduledDate}T${scheduledTime}` : undefined,
        };
        if (selectedCampaign) {
            db.campaigns.save({ ...selectedCampaign, ...data });
        } else {
            db.campaigns.create(data as any);
        }
        refreshData(); resetForm(); setSelectedCampaign(null); setTab('list');
    };

    const handleEditCampaign = (c: Campaign) => {
        setSelectedCampaign(c);
        setFormName(c.name); setFormSubject(c.subject);
        // try to split content back (best effort)
        setFormContent(c.content);
        setFormRecipientType(c.recipientType as any); setFormListId(c.listId || '');
        setWizardStep(1); setTab('edit');
    };

    const handleWizardTestSend = async () => {
        if (!wizardTestEmail) return;
        setIsWizardTesting(true);
        // Save as Testing draft first if needed
        let campId = wizardTestCampaignId;
        if (!campId) {
            const c = db.campaigns.create({
                name: formName || 'Draft Test', subject: formSubject, content: builtContent,
                status: 'Testing', recipientType: formRecipientType as any,
                listId: formListId || undefined, recipientCount: estimatedRecipients,
            });
            campId = c.id;
            setWizardTestCampaignId(campId);
        }
        await db.campaigns.sendTest(campId, wizardTestEmail);
        setIsWizardTesting(false); setWizardTestSent(true);
        setTimeout(() => setWizardTestSent(false), 3000);
        refreshData();
    };

    const handleDeleteCampaign = (id: string) => {
        if (!confirm('¿Eliminar esta campaña? Esta acción no se puede deshacer.')) return;
        db.campaigns.delete(id);
        refreshData();
    };

    const handleSendTest = async () => {
        if (!testEmail || !selectedCampaign) return;
        setIsSendingTest(true);
        await db.campaigns.sendTest(selectedCampaign.id, testEmail);
        setIsSendingTest(false); setTestSent(true);
        setTimeout(() => { setTestSent(false); setIsTestModalOpen(false); refreshData(); }, 2000);
    };

    const handleLaunch = async (campaign: Campaign) => {
        if (!confirm(`¿Lanzar la campaña "${campaign.name}"?\n\nSe enviará a aproximadamente ${campaign.recipientCount} destinatarios.`)) return;
        setIsLaunching(true);
        const result = await db.campaigns.launch(campaign.id);
        setIsLaunching(false); setLaunchResult(result);
        refreshData(); onCampaignSent();
        setTimeout(() => setLaunchResult(null), 4000);
    };

    const statusConfig: Record<string, { label: string; cls: string }> = {
        Draft: { label: 'Borrador', cls: 'bg-slate-100 text-slate-600' },
        Sent: { label: 'Enviada', cls: 'bg-emerald-50 text-emerald-700' },
        Testing: { label: 'En Prueba', cls: 'bg-amber-50 text-amber-700' },
        Scheduled: { label: 'Programada', cls: 'bg-cafh-indigo/5 text-cafh-indigo' },
    };

    if (!isOpen) return null;

    const isFormValid = formName.trim() && formSubject.trim() && formContent.trim();

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-slate-50 rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[90vh] relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-cafh-indigo rounded-2xl flex items-center justify-center">
                            <Send size={18} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Orquestador de Campañas</h3>
                            <p className="text-xs text-slate-400">{campaigns.length} campañas registradas</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Tabs */}
                        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                            {([['list', 'Mis Campañas'], ['create', '+ Nueva']] as [CampaignTab, string][]).map(([t, label]) => (
                                <button key={t} onClick={() => { setTab(t); if (t === 'create') resetForm(); }}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tab === t ? 'bg-white text-cafh-indigo shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                    {label}
                                </button>
                            ))}
                            {tab === 'edit' && (
                                <button className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-50 text-amber-700">✏ Editando</button>
                            )}
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={22} /></button>
                    </div>
                </div>

                {/* Launch success banner */}
                {launchResult && (
                    <div className="bg-emerald-500 text-white text-center py-3 text-sm font-bold animate-in slide-in-from-top-2 duration-300 shrink-0">
                        ✅ Campaña lanzada exitosamente — {launchResult.recipientCount} emails agregados a la cola de envío
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">

                    {/* ── TAB: LIST ─────────────────────────────────── */}
                    {tab === 'list' && (
                        <div className="p-8 space-y-4">
                            {campaigns.length === 0 ? (
                                <div className="text-center py-24">
                                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
                                        <Send size={32} className="text-slate-300" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-400 mb-2">Sin campañas aún</h4>
                                    <p className="text-sm text-slate-400 mb-6">Crea tu primera campaña de email marketing.</p>
                                    <button onClick={() => { setTab('create'); resetForm(); }}
                                        className="px-6 py-3 bg-cafh-indigo text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">
                                        Crear primera campaña
                                    </button>
                                </div>
                            ) : campaigns.map(camp => {
                                const openRate = camp.metrics.sent > 0 ? Math.round((camp.metrics.opened / camp.metrics.sent) * 100) : 0;
                                const clickRate = camp.metrics.sent > 0 ? Math.round((camp.metrics.clicked / camp.metrics.sent) * 100) : 0;
                                const sc = statusConfig[camp.status] || statusConfig.Draft;
                                return (
                                    <div key={camp.id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${sc.cls}`}>{sc.label}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono">{camp.createdAt.split('T')[0]}</span>
                                                        {camp.sentAt && <span className="text-[10px] text-emerald-600 font-mono">Enviada: {camp.sentAt.replace('T', ' ').substr(0, 16)}</span>}
                                                        {camp.testEmail && <span className="text-[10px] text-amber-600 font-mono">Test → {camp.testEmail}</span>}
                                                    </div>
                                                    <h4 className="font-bold text-slate-800 text-lg">{camp.name}</h4>
                                                    <p className="text-sm text-slate-500 mt-0.5">Asunto: <span className="font-medium text-slate-700">{camp.subject}</span></p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        Audiencia: <span className="font-bold text-slate-600">{camp.recipientType === 'all' ? 'Todos los contactos' : camp.recipientType === 'subscribed' ? 'Solo suscritos' : `Lista: ${availableLists.find(l => l.id === camp.listId)?.name || camp.listId}`}</span>
                                                        {' · '}{camp.recipientCount} destinatarios
                                                    </p>
                                                </div>

                                                {/* Metrics mini row */}
                                                {camp.status === 'Sent' && (
                                                    <div className="flex gap-4 shrink-0">
                                                        <div className="text-center">
                                                            <p className="text-2xl font-extrabold text-cafh-indigo">{camp.metrics.sent}</p>
                                                            <p className="text-[9px] text-slate-400 uppercase font-bold">Enviados</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-2xl font-extrabold text-emerald-500">{openRate}%</p>
                                                            <p className="text-[9px] text-slate-400 uppercase font-bold">Apertura</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-2xl font-extrabold text-purple-500">{clickRate}%</p>
                                                            <p className="text-[9px] text-slate-400 uppercase font-bold">Clics</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-2xl font-extrabold text-red-400">{camp.metrics.bounced}</p>
                                                            <p className="text-[9px] text-slate-400 uppercase font-bold">Rebotes</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 mt-5 pt-4 border-t border-slate-50">
                                                {camp.status !== 'Sent' && (
                                                    <>
                                                        <button onClick={() => handleEditCampaign(camp)}
                                                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                                            <Edit size={13} /> Editar
                                                        </button>
                                                        <button onClick={() => { setSelectedCampaign(camp); setIsTestModalOpen(true); }}
                                                            className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors">
                                                            <Eye size={13} /> Enviar Prueba
                                                        </button>
                                                        <button onClick={() => handleLaunch(camp)} disabled={isLaunching}
                                                            className="flex items-center gap-1.5 px-5 py-2 bg-cafh-indigo text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100 disabled:opacity-60 ml-auto">
                                                            {isLaunching ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                                                            {isLaunching ? 'Lanzando...' : 'Lanzar Campaña'}
                                                        </button>
                                                    </>
                                                )}
                                                {camp.status === 'Sent' && (
                                                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5"><CheckCircle2 size={13} /> Campaña completada</span>
                                                )}
                                                <button onClick={() => handleDeleteCampaign(camp.id)}
                                                    className="ml-auto flex items-center gap-1 px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors">
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── 5-STEP WIZARD: CREATE / EDIT ─────────────── */}
                    {(tab === 'create' || tab === 'edit') && (() => {
                        const steps = [
                            { n: 1, label: 'Identifica\u00adci\u00f3n', icon: '📋' },
                            { n: 2, label: 'Audiencia', icon: '👥' },
                            { n: 3, label: 'Contenido', icon: '✍️' },
                            { n: 4, label: 'Testing', icon: '🧪' },
                            { n: 5, label: 'Env\u00edo', icon: '🚀' },
                        ];
                        const canGoNext = wizardStep === 1 ? !!formName && !!formSubject
                            : wizardStep === 2 ? (formRecipientType !== 'list' || !!formListId) && (formRecipientType !== 'tag' || !!formTag)
                                : wizardStep === 3 ? !!formContent
                                    : wizardStep === 4 ? true
                                        : true;

                        return (
                            <div className="p-8">
                                {/* Step Indicator */}
                                <div className="max-w-3xl mx-auto mb-8">
                                    {/* Progress Bar */}
                                    <div className="relative flex items-center justify-between mb-2">
                                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 rounded-full -z-0">
                                            <div className="h-full bg-cafh-indigo rounded-full transition-all duration-500"
                                                style={{ width: `${((wizardStep - 1) / 4) * 100}%` }} />
                                        </div>
                                        {steps.map(s => (
                                            <div key={s.n} onClick={() => s.n < wizardStep && setWizardStep(s.n)}
                                                className={`relative z-10 flex flex-col items-center gap-1 cursor-pointer group`}>
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold border-4 transition-all duration-300
                                                    ${s.n === wizardStep ? 'bg-cafh-indigo border-cafh-indigo text-white scale-110 shadow-xl shadow-indigo-200'
                                                        : s.n < wizardStep ? 'bg-white border-cafh-indigo text-cafh-indigo'
                                                            : 'bg-white border-slate-200 text-slate-400'}`}>
                                                    {s.n < wizardStep ? '✓' : s.icon}
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${s.n === wizardStep ? 'text-cafh-indigo' : s.n < wizardStep ? 'text-slate-500' : 'text-slate-300'}`}>
                                                    {s.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Step Content */}
                                <div className="max-w-2xl mx-auto">

                                    {/* ── STEP 1: IDENTIFICACIÓN ── */}
                                    {wizardStep === 1 && (
                                        <div className="space-y-5">
                                            <div className="text-center mb-6">
                                                <h4 className="text-xl font-bold text-slate-800">Identifica tu Campaña</h4>
                                                <p className="text-sm text-slate-400 mt-1">Define el nombre interno y el asunto que ver\u00e1n tus destinatarios</p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre Interno <span className="text-red-400">*</span></label>
                                                <input type="text" value={formName} onChange={e => setFormName(e.target.value)}
                                                    placeholder="Ej. Newsletter Marzo 2026"
                                                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm font-medium shadow-sm" />
                                                <p className="text-xs text-slate-400 mt-1.5">Solo lo ves t\u00fa. Organiza tus campa\u00f1as f\u00e1cilmente.</p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Asunto del Email <span className="text-red-400">*</span></label>
                                                <input type="text" value={formSubject} onChange={e => setFormSubject(e.target.value)}
                                                    placeholder="Ej. ✨ Noticias de Cafh — Marzo 2026"
                                                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm font-medium shadow-sm" />
                                                <p className="text-xs text-slate-400 mt-1.5">Lo primero que ver\u00e1n en el cliente de correo.</p>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Texto de Vista Previa (Pre-header)</label>
                                                <input type="text" value={formPreviewText} onChange={e => setFormPreviewText(e.target.value)}
                                                    placeholder="Ej. Descubre las novedades de este mes..."
                                                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm font-medium shadow-sm" />
                                                <p className="text-xs text-slate-400 mt-1.5">Texto que aparece junto al asunto en la bandeja de entrada.</p>
                                            </div>
                                            {/* Email inbox mock preview */}
                                            {(formSubject || formPreviewText) && (
                                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Vista previa en bandeja de entrada</p>
                                                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-cafh-indigo rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">C</div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-bold text-slate-800">Cafh</span>
                                                                <span className="text-xs text-slate-400">10:30</span>
                                                            </div>
                                                            <p className="text-sm font-bold text-slate-700 truncate">{formSubject || '(sin asunto)'}</p>
                                                            <p className="text-xs text-slate-400 truncate">{formPreviewText || '(sin pre-header)'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ── STEP 2: AUDIENCIA ── */}
                                    {wizardStep === 2 && (
                                        <div className="space-y-5">
                                            <div className="text-center mb-6">
                                                <h4 className="text-xl font-bold text-slate-800">\u00bfA qui\u00e9n envi\u00e1s?</h4>
                                                <p className="text-sm text-slate-400 mt-1">Selecciona la audiencia que recibir\u00e1 esta campa\u00f1a</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {([
                                                    ['subscribed', '✅ Solo Suscritos', `${contacts.filter(c => c.status === 'Subscribed').length} contactos activos`, 'La audiencia m\u00e1s segura'],
                                                    ['all', '👥 Todos los Contactos', `${contacts.length} contactos en total`, 'Incluye desuscritos'],
                                                    ['list', '📋 Por Lista', 'Selecciona una lista', 'Segmentaci\u00f3n por lista'],
                                                    ['tag', '🏷\ufe0f Por Etiqueta', 'Selecciona un tag CRM', 'Segmentaci\u00f3n por tag'],
                                                ] as [string, string, string, string][]).map(([val, title, sub, hint]) => (
                                                    <button key={val} onClick={() => setFormRecipientType(val as any)}
                                                        className={`p-5 rounded-2xl border-2 text-left transition-all ${formRecipientType === val ? 'border-cafh-indigo bg-cafh-indigo/5 shadow-lg shadow-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                                        <p className="font-bold text-sm text-slate-800 mb-1">{title}</p>
                                                        <p className="text-xs text-slate-500">{sub}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1 italic">{hint}</p>
                                                    </button>
                                                ))}
                                            </div>
                                            {formRecipientType === 'list' && (
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Lista de Contactos <span className="text-red-400">*</span></label>
                                                    <select value={formListId} onChange={e => setFormListId(e.target.value)}
                                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-cafh-indigo">
                                                        <option value="">— Selecciona una lista —</option>
                                                        {availableLists.map(l => <option key={l.id} value={l.id}>{l.name} ({l.contactCount || 0} contactos)</option>)}
                                                    </select>
                                                </div>
                                            )}
                                            {formRecipientType === 'tag' && (
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Etiqueta CRM <span className="text-red-400">*</span></label>
                                                    <select value={formTag} onChange={e => setFormTag(e.target.value)}
                                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-cafh-indigo">
                                                        <option value="">— Selecciona un tag —</option>
                                                        {allTags.map(t => (
                                                            <option key={t} value={t}>{t} ({contacts.filter(c => c.tags?.includes(t)).length} contactos)</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 bg-cafh-indigo/5 border border-cafh-indigo/20 px-5 py-4 rounded-2xl">
                                                <Users size={20} className="text-cafh-indigo shrink-0" />
                                                <div>
                                                    <p className="text-sm font-bold text-cafh-indigo">{estimatedRecipients} destinatarios estimados</p>
                                                    <p className="text-xs text-slate-400">Calculado con los contactos actuales del CRM</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── STEP 3: CONTENIDO ── */}
                                    {wizardStep === 3 && (
                                        <div className="space-y-5">
                                            <div className="text-center mb-6">
                                                <h4 className="text-xl font-bold text-slate-800">Dise\u00f1a el Contenido</h4>
                                                <p className="text-sm text-slate-400 mt-1">T\u00edtulo, subt\u00edtulo y cuerpo del mensaje</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">T\u00edtulo Principal del Email</label>
                                                    <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)}
                                                        placeholder="Ej. Noticias de Cafh"
                                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm font-medium" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subt\u00edtulo</label>
                                                    <input type="text" value={formSubtitle} onChange={e => setFormSubtitle(e.target.value)}
                                                        placeholder="Ej. Marzo 2026"
                                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm font-medium" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cuerpo del Mensaje (HTML) <span className="text-red-400">*</span></label>
                                                    <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                                                        {(['editor', 'preview', 'emailPreview'] as const).map(mode => (
                                                            <button key={mode} onClick={() => setFormViewMode(mode)}
                                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${formViewMode === mode ? 'bg-white text-cafh-indigo shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                                                {mode === 'editor' ? '⌨ Editor' : mode === 'preview' ? '👁 HTML' : '📧 Email'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                {formViewMode === 'editor' && (
                                                    <textarea value={formContent} onChange={e => setFormContent(e.target.value)} rows={14}
                                                        placeholder="<p>Escribe el cuerpo del mensaje en HTML...</p>&#10;<p>Ejemplo: <strong>Noticias</strong> del mes de marzo.</p>"
                                                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none resize-none font-mono text-xs leading-relaxed shadow-sm" />
                                                )}
                                                {formViewMode === 'preview' && (
                                                    <div className="w-full min-h-[350px] px-5 py-4 bg-white border border-slate-200 rounded-2xl overflow-y-auto prose max-w-none shadow-sm"
                                                        dangerouslySetInnerHTML={{ __html: builtContent || '<p style="color:#94a3b8;font-style:italic">Sin contenido. Agrega algo en el Editor.</p>' }} />
                                                )}
                                                {formViewMode === 'emailPreview' && (
                                                    <div className="bg-slate-100 rounded-2xl p-4 overflow-y-auto" style={{ maxHeight: '420px' }}>
                                                        {/* Email client mockup */}
                                                        <div className="bg-white rounded-xl shadow-md max-w-lg mx-auto overflow-hidden">
                                                            <div className="bg-cafh-indigo px-6 py-5 text-white text-center">
                                                                <p className="text-xs text-white/60 font-bold uppercase tracking-widest mb-1">Cafh</p>
                                                                <p className="font-bold text-lg">{formSubject || 'Sin asunto'}</p>
                                                                {formPreviewText && <p className="text-xs text-white/70 mt-1">{formPreviewText}</p>}
                                                            </div>
                                                            <div className="px-8 py-6 prose max-w-none"
                                                                dangerouslySetInnerHTML={{ __html: builtContent || '<p style="color:#94a3b8;font-style:italic">Sin contenido.</p>' }} />
                                                            <div className="px-8 py-4 border-t border-slate-100 text-center text-xs text-slate-400">
                                                                Cafh · <a href="#" className="underline">Cancelar suscripci\u00f3n</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── STEP 4: TESTING ── */}
                                    {wizardStep === 4 && (
                                        <div className="space-y-6">
                                            <div className="text-center mb-6">
                                                <h4 className="text-xl font-bold text-slate-800">Prueba antes de Enviar</h4>
                                                <p className="text-sm text-slate-400 mt-1">Env\u00eda un correo de prueba para revisar c\u00f3mo se ver\u00e1 en la bandeja</p>
                                            </div>
                                            {/* Campaign summary card */}
                                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Resumen de la Campa\u00f1a</p>
                                                <div className="flex justify-between text-sm"><span className="text-slate-500">Nombre:</span><span className="font-bold text-slate-800">{formName}</span></div>
                                                <div className="flex justify-between text-sm"><span className="text-slate-500">Asunto:</span><span className="font-bold text-slate-700 text-right">{formSubject}</span></div>
                                                <div className="flex justify-between text-sm"><span className="text-slate-500">Audiencia:</span><span className="font-bold text-cafh-indigo">{estimatedRecipients} destinatarios</span></div>
                                                <div className="flex justify-between text-sm"><span className="text-slate-500">Tipo:</span>
                                                    <span className="font-bold text-slate-700">{formRecipientType === 'all' ? 'Todos' : formRecipientType === 'subscribed' ? 'Solo Suscritos' : formRecipientType === 'list' ? `Lista: ${availableLists.find(l => l.id === formListId)?.name}` : `Tag: ${formTag}`}</span>
                                                </div>
                                            </div>
                                            {/* Test send */}
                                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">🧪</div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">Env\u00edo de Prueba</p>
                                                        <p className="text-xs text-slate-500">El asunto llegar\u00e1 con el prefijo <span className="font-mono bg-white px-1 rounded">[TEST]</span></p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <input type="email" value={wizardTestEmail} onChange={e => setWizardTestEmail(e.target.value)}
                                                        placeholder="tu@email.com"
                                                        className="flex-1 px-4 py-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-sm" />
                                                    <button onClick={handleWizardTestSend} disabled={!wizardTestEmail || isWizardTesting}
                                                        className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50 ${wizardTestSent ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'}`}>
                                                        {isWizardTesting ? <RefreshCw size={15} className="animate-spin" /> : wizardTestSent ? <CheckCircle2 size={15} /> : <Send size={15} />}
                                                        {isWizardTesting ? 'Enviando...' : wizardTestSent ? '¡Enviado!' : 'Enviar Prueba'}
                                                    </button>
                                                </div>
                                                {wizardTestSent && (
                                                    <div className="mt-3 text-xs text-emerald-700 font-bold bg-emerald-50 px-4 py-2 rounded-xl animate-in fade-in duration-300">
                                                        ✅ Test enviado a {wizardTestEmail} — Revisa tu bandeja de entrada.
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-center text-slate-400">Puedes saltarte el testing y continuar al env\u00edo directamente.</p>
                                        </div>
                                    )}

                                    {/* ── STEP 5: PROGRAMACIÓN / ENVÍO ── */}
                                    {wizardStep === 5 && (
                                        <div className="space-y-6">
                                            <div className="text-center mb-6">
                                                <h4 className="text-xl font-bold text-slate-800">\u00bfCu\u00e1ndo enviamos?</h4>
                                                <p className="text-sm text-slate-400 mt-1">Env\u00eda ahora o programa para un horario \u00f3ptimo</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {([
                                                    ['now', '⚡ Enviar Ahora', 'La campa\u00f1a se agrega inmediatamente a la cola de env\u00edo.'],
                                                    ['schedule', '📅 Programar', 'Elige fecha y hora exacta de env\u00edo.'],
                                                ] as [string, string, string][]).map(([val, title, desc]) => (
                                                    <button key={val} onClick={() => setSendMode(val as any)}
                                                        className={`p-6 rounded-2xl border-2 text-left transition-all ${sendMode === val ? 'border-cafh-indigo bg-cafh-indigo/5 shadow-lg shadow-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                                        <p className="font-bold text-slate-800 mb-2">{title}</p>
                                                        <p className="text-xs text-slate-500">{desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                            {sendMode === 'schedule' && (
                                                <div className="grid grid-cols-2 gap-4 bg-cafh-indigo/5 border border-blue-100 rounded-2xl p-5">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Fecha de Env\u00edo</label>
                                                        <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}
                                                            min={new Date().toISOString().split('T')[0]}
                                                            className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hora de Env\u00edo</label>
                                                        <input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)}
                                                            className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo" />
                                                    </div>
                                                    {scheduledDate && <p className="col-span-2 text-xs text-cafh-indigo font-bold">📅 Programada para: {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>}
                                                </div>
                                            )}
                                            {/* Final summary */}
                                            <div className="bg-gradient-to-br from-cafh-indigo to-blue-700 rounded-2xl p-6 text-white">
                                                <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Resumen Final</p>
                                                <p className="text-2xl font-extrabold mb-1">{formName}</p>
                                                <p className="text-white/80 text-sm mb-3">Asunto: {formSubject}</p>
                                                <div className="flex gap-6 text-sm">
                                                    <div><span className="text-white/60">Destinatarios</span><br /><strong className="text-xl">{estimatedRecipients}</strong></div>
                                                    <div><span className="text-white/60">Modo</span><br /><strong>{sendMode === 'now' ? 'Inmediato' : 'Programado'}</strong></div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => handleSaveDraft('Draft')}
                                                    className="flex-1 py-3.5 border-2 border-slate-200 bg-white rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm flex items-center justify-center gap-2">
                                                    <FileText size={16} /> Guardar Borrador
                                                </button>
                                                <button onClick={() => {
                                                    if (sendMode === 'now') {
                                                        handleSaveDraft('Draft');
                                                        const camp = db.campaigns.getAll()[0];
                                                        if (camp) handleLaunch(camp);
                                                    } else {
                                                        handleSaveDraft('Scheduled');
                                                    }
                                                }}
                                                    disabled={sendMode === 'schedule' && !scheduledDate}
                                                    className="flex-[2] py-3.5 bg-cafh-indigo text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200 text-sm flex items-center justify-center gap-2 disabled:opacity-40">
                                                    <Send size={16} />
                                                    {sendMode === 'now' ? '🚀 Lanzar Campaña Ahora' : '📅 Programar Campaña'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Controls */}
                                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                                        <button onClick={() => { if (wizardStep === 1) { setTab('list'); resetForm(); } else setWizardStep(w => w - 1); }}
                                            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm">
                                            <ArrowLeft size={16} /> {wizardStep === 1 ? 'Cancelar' : 'Anterior'}
                                        </button>
                                        {wizardStep < 5 && (
                                            <button onClick={() => setWizardStep(w => w + 1)} disabled={!canGoNext}
                                                className="flex items-center gap-2 px-6 py-3 bg-cafh-indigo text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100 text-sm disabled:opacity-40">
                                                Siguiente <ChevronRight size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Test Send Modal (from Campaign List) */}
            {isTestModalOpen && selectedCampaign && (
                <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
                    <div className="absolute inset-0 bg-slate-900/60" onClick={() => setIsTestModalOpen(false)} />
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><Eye size={18} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800">Enviar Prueba</h4>
                                <p className="text-xs text-slate-400">Campa\u00f1a: {selectedCampaign.name}</p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email de destino de la prueba</label>
                            <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)}
                                placeholder="admin@cafh.cl"
                                className="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm" />
                            <p className="text-xs text-slate-400 mt-2">Se enviar\u00e1 con el prefijo <span className="font-mono bg-slate-100 px-1 rounded">[TEST]</span> en el asunto.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setIsTestModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50">Cancelar</button>
                            <button onClick={handleSendTest} disabled={!testEmail || isSendingTest}
                                className={`flex-[2] py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${testSent ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'} disabled:opacity-50`}>
                                {isSendingTest ? <RefreshCw size={16} className="animate-spin" /> : testSent ? <CheckCircle2 size={16} /> : <Send size={16} />}
                                {isSendingTest ? 'Enviando...' : testSent ? '¡Enviado!' : 'Enviar Prueba'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MassEmailComposerModal: React.FC<{
    recipientCount: number;
    isOpen: boolean;
    onClose: () => void;
    onSend: (subject: string, content: string) => void;
}> = ({ recipientCount, isOpen, onClose, onSend }) => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!subject || !content) return;
        setIsSending(true);
        await onSend(subject, content);
        setIsSending(false);
        onClose();
        setSubject('');
        setContent('');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">Campaña de Envío Masivo</h3>
                            <p className="text-slate-500">Se enviará a <span className="font-bold text-cafh-indigo">{recipientCount} contactos suscritos</span></p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-6 flex gap-3">
                        <AlertCircle className="text-amber-600 shrink-0" size={20} />
                        <p className="text-xs text-amber-800">
                            <strong>Throttling Activo:</strong> Los correos se enviarán en lotes de 80 por hora para cumplir con las políticas de cPanel y evitar SPAM.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Asunto de la Campaña</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Escribe el asunto..."
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Contenido del Mensaje</label>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setViewMode('editor')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === 'editor' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Editor HTML
                                    </button>
                                    <button
                                        onClick={() => setViewMode('preview')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Vista Previa
                                    </button>
                                </div>
                            </div>

                            {viewMode === 'editor' ? (
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={10}
                                    placeholder="<h1>Título</h1><p>Escribe tu mensaje HTML aquí...</p>"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all resize-none font-mono text-xs"
                                />
                            ) : (
                                <div
                                    className="w-full h-[240px] px-5 py-4 bg-white border border-slate-200 rounded-2xl overflow-y-auto"
                                    dangerouslySetInnerHTML={{ __html: content || '<p style="color:#94a3b8; font-style:italic;">No hay contenido para previsualizar.</p>' }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={isSending || !subject || !content}
                            className="flex-[2] py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSending ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
                            <span>{isSending ? 'Procesando...' : 'Iniciar Envío por Lotes'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- IMPORT CONTACTS MODAL ---
const ImportContactsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onImportSuccess: (count: number) => void;
}> = ({ isOpen, onClose, onImportSuccess }) => {
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleImport = async () => {
        if (!inputText.trim()) return;
        setIsProcessing(true);
        try {
            // Basic parsing logic: Split by lines, then by basic separators (comma or tab)
            const lines = inputText.split(/\r?\n/).filter(l => l.trim() !== '');
            const newContacts: Omit<Contact, 'id'>[] = [];

            // Assume format: Name, Email, Phone
            for (const line of lines) {
                // Determine separator
                const separator = line.includes('\t') ? '\t' : (line.includes(';') ? ';' : ',');
                const parts = line.split(separator).map(p => p.trim());

                if (parts.length >= 2) {
                    newContacts.push({
                        name: parts[0] || 'Desconocido',
                        email: parts[1],
                        phone: parts[2] || '',
                        role: 'Lead',
                        status: 'Subscribed',
                        lastContact: new Date().toISOString().split('T')[0],
                        tags: ['Importado Masivamente']
                    });
                }
            }

            if (newContacts.length > 0) {
                db.crm.addMultiple(newContacts);
                onImportSuccess(newContacts.length);
            } else {
                alert('No se detectaron contactos válidos. Verifica el formato.');
            }
        } catch (error) {
            console.error('Error importing contacts', error);
            alert('Ocurrió un error leyendo el bloque de datos.');
        } finally {
            setIsProcessing(false);
            setInputText('');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">Importación Masiva</h3>
                            <p className="text-slate-500">Copia y pega desde Excel u hoja de cálculo.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="bg-cafh-indigo/5 border border-blue-100 p-4 rounded-2xl mb-6 flex gap-3">
                        <UploadCloud className="text-cafh-indigo shrink-0" size={20} />
                        <div className="text-xs text-slate-800">
                            <strong>Instrucciones:</strong> Copia los datos de tu Excel o archivo CSV y pégalos abajo.
                            El sistema detectará automáticamente las columnas si están separadas por tabulaciones (copiado directo de Excel) o comas/puntos y comas (archivos CSV).
                            <br /><br />
                            <span className="font-mono bg-cafh-indigo/10 px-2 py-1 rounded text-[10px]">Formato: Nombre [TAB] Email [TAB] Teléfono</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bloque de Datos (Copiar y Pegar)</label>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                rows={8}
                                placeholder={`Ejemplo:\nJuan Pérez\tjuan@ejemplo.com\t+56912345678\nMaría Gómez\tmaria@ejemplo.com\t+56987654321`}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all resize-none font-mono text-xs whitespace-pre"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={isProcessing || !inputText.trim()}
                            className="flex-[2] py-3 bg-cafh-indigo text-white font-bold rounded-2xl shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isProcessing ? <RefreshCw size={20} className="animate-spin" /> : <Database size={20} />}
                            <span>{isProcessing ? 'Procesando...' : 'Iniciar Importación'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SMTP SETTINGS MODAL ---
const SMTPSettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const [config, setConfig] = useState<SMTPConfig>(() => db.emails.getSMTPConfig());
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            db.emails.updateSMTPConfig(config);
            setIsSaving(false);
            onClose();
        }, 600);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">Servidor de Salida (SMTP)</h3>
                            <p className="text-slate-500">Configura tus credenciales de cPanel o Mailrelay.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-6 flex gap-3">
                        <Settings className="text-slate-400 shrink-0" size={20} />
                        <p className="text-xs text-slate-500">
                            <strong>Nota:</strong> Estos datos se usarán internamente para la pasarela de envíos cuando la aplicación esté montada en el servidor de producción.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Host SMTP</label>
                            <input
                                type="text"
                                value={config.host}
                                onChange={(e) => setConfig({ ...config, host: e.target.value })}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Puerto</label>
                            <input
                                type="text"
                                value={config.port}
                                onChange={(e) => setConfig({ ...config, port: e.target.value })}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Usuario</label>
                            <input
                                type="text"
                                value={config.user}
                                onChange={(e) => setConfig({ ...config, user: e.target.value })}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={config.pass}
                                onChange={(e) => setConfig({ ...config, pass: e.target.value })}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Remitente</label>
                            <input
                                type="email"
                                value={config.fromEmail}
                                onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre Remitente</label>
                            <input
                                type="text"
                                value={config.fromName}
                                onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={config.secure}
                                        onChange={(e) => setConfig({ ...config, secure: e.target.checked })}
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${config.secure ? 'bg-cafh-indigo' : 'bg-slate-300'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${config.secure ? 'translate-x-4' : ''}`}></div>
                                </div>
                                <span className="text-sm font-bold text-slate-700">Usar conexión segura (SSL/TLS)</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-[2] py-4 bg-cafh-indigo text-white font-bold rounded-2xl shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                            <span>{isSaving ? 'Guardando...' : 'Guardar Credenciales'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- CONTACT LISTS OFF-CANVAS ---
const ContactListsOffCanvas: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [lists, setLists] = useState<ContactList[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListDesc, setNewListDesc] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLists(db.crm.getLists());
        }
    }, [isOpen]);

    const handleCreateList = () => {
        if (!newListName.trim()) return;
        const newList = db.crm.addList({ name: newListName, description: newListDesc });
        setLists([...lists, newList]);
        setNewListName('');
        setNewListDesc('');
        setIsCreating(false);
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`¿Estás seguro de eliminar el segmento "${name}"? Los contactos internos no se borrarán de la base de datos principal, solo se desmarcarán.`)) {
            db.crm.deleteList(id);
            setLists(lists.filter(l => l.id !== id));
        }
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />}
            <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Listas & Segmentos</h2>
                            <p className="text-xs text-slate-500">Agrupa inteligentemente a tus contactos</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {!isCreating ? (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-cafh-indigo hover:text-cafh-indigo transition-colors"
                            >
                                <Plus size={20} />
                                <span>Crear Nuevo Segmento</span>
                            </button>
                        ) : (
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                                <h4 className="font-bold text-slate-800 mb-4 text-sm">Nueva Lista</h4>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Nombre (ej. Suscriptores Web)"
                                        value={newListName}
                                        onChange={e => setNewListName(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Descripción corta"
                                        value={newListDesc}
                                        onChange={e => setNewListDesc(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo"
                                    />
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={() => setIsCreating(false)} className="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                                        <button onClick={handleCreateList} disabled={!newListName.trim()} className="flex-1 py-2 text-xs font-bold bg-cafh-indigo text-white rounded-lg disabled:opacity-50 transition-colors">Guardar</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Listas Activas ({lists.length})</h3>
                            {lists.length === 0 && !isCreating && (
                                <p className="text-sm text-slate-400 italic text-center py-8">Aún no hay listas creadas.</p>
                            )}
                            {lists.map(list => (
                                <div key={list.id} className="group bg-white border border-slate-200 p-4 rounded-2xl hover:border-cafh-indigo hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{list.name}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{list.description}</p>
                                        </div>
                                        <div className="flex bg-cafh-indigo/5 text-cafh-indigo px-2 py-1 rounded gap-1 items-center text-xs font-bold">
                                            <User size={12} /> {list.contactCount || 0}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1"><Clock size={10} /> Creada: {list.createdAt.split('T')[0]}</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDelete(list.id, list.name)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded bg-white border border-slate-200 transition-colors" title="Eliminar lista">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// --- CONTACT EDITOR MODAL ---
const ContactEditorModal: React.FC<{
    isOpen: boolean;
    initialContact: Contact | null;
    onClose: () => void;
    onSave: () => void;
}> = ({ isOpen, initialContact, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'Subscribed' | 'Pending' | 'Unsubscribed' | 'Bounced' | 'new'>('Subscribed');
    const [listIds, setListIds] = useState<string[]>([]);
    const [availableLists, setAvailableLists] = useState<ContactList[]>([]);

    useEffect(() => {
        if (isOpen) {
            setAvailableLists(db.crm.getLists());
            if (initialContact) {
                setName(initialContact.name);
                setEmail(initialContact.email);
                setPhone(initialContact.phone || '');
                setStatus(initialContact.status);
                setListIds(initialContact.listIds || []);
            } else {
                setName('');
                setEmail('');
                setPhone('');
                setStatus('Subscribed');
                setListIds([]);
            }
        }
    }, [isOpen, initialContact]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name || !email) return;

        if (initialContact) {
            db.crm.update({
                ...initialContact,
                name,
                email,
                phone,
                status,
                listIds
            });
        } else {
            db.crm.add({
                name,
                email,
                phone,
                role: 'user',
                status,
                tags: ['Manual', 'Nuevo'],
                engagementScore: 50,
                lastContact: new Date().toISOString(),
                listIds
            });
        }

        // Update contactCount internally in storage for each list
        const allLists = db.crm.getLists();
        const contacts = db.crm.getAll(); // Fetch fresh to count correctly
        allLists.forEach(l => {
            const freshCount = contacts.filter(c => c.listIds?.includes(l.id)).length;
            if (l.contactCount !== freshCount) {
                db.crm.updateList({ ...l, contactCount: freshCount });
            }
        });

        onSave();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{initialContact ? 'Editar Contacto' : 'Nuevo Contacto'}</h3>
                            <p className="text-slate-500">Completa los datos esenciales.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Ej. Juan Pérez"
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="juan@ejemplo.com"
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Teléfono (Opcional)</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="+56 9 1234 5678"
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Estado de Suscripción</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value as any)}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all font-bold text-slate-600"
                            >
                                <option value="Subscribed">Suscrito (Activo)</option>
                                <option value="Pending">Pendiente</option>
                                <option value="Unsubscribed">Desuscrito</option>
                                <option value="Bounced">Rebotado</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Listas Asociadas</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl max-h-40 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {availableLists.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">No hay listas creadas.</p>
                                ) : (
                                    availableLists.map(list => (
                                        <label key={list.id} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 appearance-none border-2 border-slate-300 rounded checked:bg-cafh-indigo checked:border-cafh-indigo transition-colors"
                                                    checked={listIds.includes(list.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setListIds([...listIds, list.id]);
                                                        else setListIds(listIds.filter(id => id !== list.id));
                                                    }}
                                                />
                                                <CheckCircle2 size={12} className={`absolute text-white pointer-events-none transition-opacity ${listIds.includes(list.id) ? 'opacity-100' : 'opacity-0'}`} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700 group-hover:text-cafh-indigo transition-colors">{list.name}</p>
                                                <p className="text-[10px] text-slate-500">{list.description}</p>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!name || !email}
                            className="flex-1 py-4 bg-cafh-indigo text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-slate-900 transition-all disabled:opacity-50"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- AUTOMATIONS VIEW ---
// ============================================================
type AutomationViewTab = 'list' | 'create' | 'edit' | 'detail';


export const AutomationsView: React.FC = () => {
    const [automations, setAutomations] = useState<AutomationRule[]>([]);
    const [executions, setExecutions] = useState<AutomationExecution[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [lists, setLists] = useState<ContactList[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [viewTab, setViewTab] = useState<AutomationViewTab>('list');
    const [selectedAuto, setSelectedAuto] = useState<AutomationRule | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [runResult, setRunResult] = useState<{ count: number } | null>(null);
    const [showExecLog, setShowExecLog] = useState<AutomationExecution | null>(null);

    // Wizard state
    const [wStep, setWStep] = useState(1);
    // Step 1: Basic
    const [wName, setWName] = useState('');
    const [wDesc, setWDesc] = useState('');
    const [wTriggerType, setWTriggerType] = useState<AutomationRule['trigger']['type']>('manual');
    const [wTriggerListId, setWTriggerListId] = useState('');
    const [wTriggerTag, setWTriggerTag] = useState('');
    const [wTriggerInactiveDays, setWTriggerInactiveDays] = useState(30);
    // Step 2: Nodes
    const [wNodes, setWNodes] = useState<AutomationNode[]>([]);
    const [wNodePositions, setWNodePositions] = useState<Record<string, { x: number; y: number }>>({});
    // Node builder
    const [addingNodeType, setAddingNodeType] = useState<AutomationNodeType | ''>('');
    const [nodeEmailSubject, setNodeEmailSubject] = useState('');
    const [nodeEmailContent, setNodeEmailContent] = useState('');
    const [nodeWaitAmount, setNodeWaitAmount] = useState(1);
    const [nodeWaitUnit, setNodeWaitUnit] = useState<'minutes' | 'hours' | 'days'>('days');
    const [nodeTag, setNodeTag] = useState('');
    const [nodeTagAction, setNodeTagAction] = useState<'add' | 'remove'>('add');
    const [nodeListId, setNodeListId] = useState('');
    const [nodeCondCheck, setNodeCondCheck] = useState<ConditionNode['check']>('has_tag');
    const [nodeCondValue, setNodeCondValue] = useState('');
    // Step 3: Segment (for manual run)
    const [wSegmentType, setWSegmentType] = useState<'all' | 'subscribed' | 'list' | 'tag'>('subscribed');
    const [wSegmentValue, setWSegmentValue] = useState('');

    // All tags from contacts
    const allTags = useMemo(() => {
        const s = new Set<string>();
        contacts.forEach(c => c.tags?.forEach(t => s.add(t)));
        return Array.from(s).sort();
    }, [contacts]);

    const refreshData = () => {
        setAutomations(db.automations.getAll());
        setExecutions(db.automations.getExecutions());
        setContacts(db.crm.getAll());
        setLists(db.crm.getLists());
        setCampaigns(db.campaigns.getAll());
    };

    useEffect(() => { refreshData(); }, []);

    const resetWizard = () => {
        setWStep(1); setWName(''); setWDesc('');
        setWTriggerType('manual'); setWTriggerListId(''); setWTriggerTag(''); setWTriggerInactiveDays(30);
        setWNodes([]); setWNodePositions({}); setAddingNodeType('');
        setWSegmentType('subscribed'); setWSegmentValue('');
    };

    const handleAddNode = () => {
        if (!addingNodeType) return;
        const id = `node_${Date.now()}`;
        let node: AutomationNode;
        if (addingNodeType === 'send_email') {
            if (!nodeEmailSubject || !nodeEmailContent) return;
            node = { id, type: 'send_email', subject: nodeEmailSubject, content: nodeEmailContent };
            setNodeEmailSubject(''); setNodeEmailContent('');
        } else if (addingNodeType === 'wait') {
            node = { id, type: 'wait', amount: nodeWaitAmount, unit: nodeWaitUnit };
        } else if (addingNodeType === 'update_tag') {
            if (!nodeTag) return;
            node = { id, type: 'update_tag', action: nodeTagAction, tag: nodeTag };
            setNodeTag('');
        } else if (addingNodeType === 'move_to_list') {
            if (!nodeListId) return;
            node = { id, type: 'move_to_list', listId: nodeListId };
        } else if (addingNodeType === 'condition') {
            node = { id, type: 'condition', check: nodeCondCheck, value: nodeCondValue, branchTrue: [], branchFalse: [] };
        } else {
            node = { id, type: 'end' };
        }
        setWNodes(prev => [...prev, node]);
        setAddingNodeType('');
    };

    const handleSaveAutomation = (status: AutomationRule['status'] = 'Draft') => {
        if (!wName) return;
        const trigger: AutomationRule['trigger'] = {
            type: wTriggerType,
            listId: wTriggerListId || undefined,
            tag: wTriggerTag || undefined,
            inactiveDays: wTriggerInactiveDays,
        };
        const data = { name: wName, description: wDesc, status, trigger, nodes: wNodes, nodePositions: wNodePositions };
        if (selectedAuto && viewTab === 'edit') {
            db.automations.save({ ...selectedAuto, ...data, updatedAt: new Date().toISOString() });
        } else {
            db.automations.create(data);
        }
        refreshData(); resetWizard(); setSelectedAuto(null); setViewTab('list');
    };

    const handleEditAutomation = (auto: AutomationRule) => {
        setSelectedAuto(auto);
        setWName(auto.name); setWDesc(auto.description || '');
        setWTriggerType(auto.trigger.type);
        setWTriggerListId(auto.trigger.listId || '');
        setWTriggerTag(auto.trigger.tag || '');
        setWTriggerInactiveDays(auto.trigger.inactiveDays || 30);
        setWNodes(auto.nodes);
        setWNodePositions(auto.nodePositions || {});
        setWStep(1); setViewTab('edit');
    };

    const handleRunForSegment = async (auto: AutomationRule) => {
        setIsRunning(true);
        const result = await db.automations.runForSegment(auto.id, wSegmentType, wSegmentValue || undefined);
        setIsRunning(false);
        setRunResult({ count: result.count });
        refreshData();
        setTimeout(() => setRunResult(null), 4000);
    };

    const handleToggleStatus = (auto: AutomationRule) => {
        db.automations.save({ ...auto, status: auto.status === 'Active' ? 'Paused' : 'Active' });
        refreshData();
    };

    const handleDelete = (id: string) => {
        if (!confirm('¿Eliminar esta automatización?')) return;
        db.automations.delete(id);
        refreshData();
    };

    const triggerLabels: Record<string, string> = {
        manual: '🖐 Disparo Manual', contact_added_to_list: '📋 Contacto añadido a lista',
        tag_added: '🏷️ Tag añadido', campaign_sent: '📧 Campaña enviada',
        campaign_opened: '👁 Campaña abierta', campaign_clicked: '🖱 Campaña con clic',
        no_activity: '😴 Sin actividad X días', scheduled_date: '📅 Fecha programada',
    };

    const nodeIcon: Record<string, string> = {
        send_email: '📧', wait: '⏳', condition: '🔀', update_tag: '🏷️', move_to_list: '📋', end: '🏁'
    };

    const statusCfg = {
        Active: { label: 'Activa', cls: 'bg-emerald-50 text-emerald-700' },
        Paused: { label: 'Pausada', cls: 'bg-amber-50 text-amber-700' },
        Draft: { label: 'Borrador', cls: 'bg-slate-100 text-slate-600' },
    };

    const wizardSteps = ['Configuración', 'Flujo de Nodos', 'Activar'];

    // ── Global KPIs
    const totalExecutions = automations.reduce((s, a) => s + a.stats.totalExecutions, 0);
    const totalEmailsSent = automations.reduce((s, a) => s + a.stats.emailsSent, 0);
    const activeCount = automations.filter(a => a.status === 'Active').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Automatizaciones</h2>
                    <p className="text-slate-500">Motor de flujos automáticos conectado al CRM Cafh.</p>
                </div>
                <button onClick={() => { resetWizard(); setSelectedAuto(null); setViewTab('create'); }}
                    className="flex items-center gap-2 px-5 py-3 bg-cafh-indigo text-white rounded-2xl hover:bg-slate-900 transition-all font-bold text-sm shadow-lg shadow-indigo-100">
                    <Plus size={18} /> Nueva Automatización
                </button>
            </div>

            {/* KPI Bar */}
            {viewTab === 'list' && (
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Activas', value: activeCount, icon: '✅', color: 'text-emerald-600' },
                        { label: 'Ejecuciones Totales', value: totalExecutions, icon: '▶', color: 'text-cafh-indigo' },
                        { label: 'Emails por Automación', value: totalEmailsSent, icon: '📧', color: 'text-purple-600' },
                    ].map(k => (
                        <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                            <span className="text-3xl">{k.icon}</span>
                            <div>
                                <p className={`text-2xl font-extrabold ${k.color}`}>{k.value}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{k.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Launch banner */}
            {runResult && (
                <div className="bg-emerald-500 text-white text-center py-3 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2 duration-300">
                    ✅ Automatización ejecutada para {runResult.count} contactos
                </div>
            )}

            {/* ── LIST VIEW ─────────────────────────────────── */}
            {viewTab === 'list' && (
                <div className="space-y-4">
                    {automations.length === 0 ? (
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-20 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
                                <Zap size={32} className="text-slate-300" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-400 mb-2">Sin automatizaciones aún</h4>
                            <p className="text-sm text-slate-400 mb-6">Crea tu primera automatización con nodos de email, espera y condición.</p>
                            <button onClick={() => { resetWizard(); setViewTab('create'); }}
                                className="px-6 py-3 bg-cafh-indigo text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">
                                Crear primera automatización
                            </button>
                        </div>
                    ) : automations.map(auto => {
                        const sc = statusCfg[auto.status];
                        const latestExecs = executions.filter(e => e.automationId === auto.id).slice(0, 3);
                        return (
                            <div key={auto.id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${sc.cls}`}>{sc.label}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">{triggerLabels[auto.trigger.type] || auto.trigger.type}</span>
                                            </div>
                                            <h4 className="font-bold text-slate-800 text-lg">{auto.name}</h4>
                                            {auto.description && <p className="text-sm text-slate-500 mt-0.5">{auto.description}</p>}
                                            {/* Node flow preview */}
                                            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                                                {auto.nodes.map((n, i) => (
                                                    <span key={n.id} className="flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg font-medium text-slate-600">
                                                        {nodeIcon[n.type]} {n.type === 'send_email' ? (n as SendEmailNode).subject.substring(0, 20) + '...' : n.type === 'wait' ? `${(n as WaitNode).amount} ${(n as WaitNode).unit}` : n.type}
                                                        {i < auto.nodes.length - 1 && <ChevronRight size={10} className="text-slate-300" />}
                                                    </span>
                                                ))}
                                                {auto.nodes.length === 0 && <span className="text-xs text-slate-400 italic">Sin nodos configurados</span>}
                                            </div>
                                        </div>
                                        {/* Mini stats */}
                                        <div className="flex gap-5 shrink-0">
                                            <div className="text-center"><p className="text-xl font-extrabold text-cafh-indigo">{auto.stats.totalExecutions}</p><p className="text-[9px] text-slate-400 font-bold uppercase">Ejecuciones</p></div>
                                            <div className="text-center"><p className="text-xl font-extrabold text-emerald-500">{auto.stats.emailsSent}</p><p className="text-[9px] text-slate-400 font-bold uppercase">Emails</p></div>
                                            <div className="text-center"><p className="text-xl font-extrabold text-purple-500">{auto.stats.tagsApplied}</p><p className="text-[9px] text-slate-400 font-bold uppercase">Tags</p></div>
                                        </div>
                                    </div>

                                    {/* Recent executions */}
                                    {latestExecs.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-slate-50">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Últimas ejecuciones</p>
                                            <div className="space-y-1">
                                                {latestExecs.map(ex => (
                                                    <div key={ex.id} className="flex items-center justify-between text-xs">
                                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${ex.status === 'completed' ? 'bg-emerald-400' : ex.status === 'failed' ? 'bg-red-400' : 'bg-amber-400'}`} />
                                                        <span className="text-slate-600 flex-1">{ex.contactEmail}</span>
                                                        <span className="text-slate-400">{ex.startedAt.substring(0, 16).replace('T', ' ')}</span>
                                                        <button onClick={() => setShowExecLog(ex)} className="ml-2 text-cafh-indigo hover:underline font-bold">Log</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions row */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50 flex-wrap">
                                        <button onClick={() => handleEditAutomation(auto)}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                            <Edit size={13} /> Editar
                                        </button>
                                        <button onClick={() => handleToggleStatus(auto)}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${auto.status === 'Active' ? 'bg-amber-50 border border-amber-100 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100'}`}>
                                            {auto.status === 'Active' ? <><Pause size={13} /> Pausar</> : <><Play size={13} /> Activar</>}
                                        </button>
                                        <div className="ml-auto flex gap-2">
                                            <select value={wSegmentType} onChange={e => setWSegmentType(e.target.value as any)}
                                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none">
                                                <option value="subscribed">Solo suscritos</option>
                                                <option value="all">Todos los contactos</option>
                                                <option value="list">Por lista</option>
                                                <option value="tag">Por tag</option>
                                            </select>
                                            <button onClick={() => handleRunForSegment(auto)} disabled={isRunning || auto.nodes.length === 0}
                                                className="flex items-center gap-1.5 px-5 py-2 bg-cafh-indigo text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100 disabled:opacity-60">
                                                {isRunning ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
                                                Ejecutar
                                            </button>
                                        </div>
                                        <button onClick={() => handleDelete(auto.id)}
                                            className="flex items-center gap-1 px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── WIZARD: CREATE / EDIT ─────────────────────── */}
            {(viewTab === 'create' || viewTab === 'edit') && (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                    {/* Progress */}
                    <div className="flex items-center gap-4 mb-8">
                        {wizardSteps.map((label, i) => (
                            <div key={label} className="flex items-center gap-2">
                                <div onClick={() => i + 1 < wStep && setWStep(i + 1)}
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-all cursor-pointer
                                    ${wStep === i + 1 ? 'bg-cafh-indigo border-cafh-indigo text-white scale-110' : wStep > i + 1 ? 'bg-white border-cafh-indigo text-cafh-indigo' : 'bg-white border-slate-200 text-slate-400'}`}>
                                    {wStep > i + 1 ? '✓' : i + 1}
                                </div>
                                <span className={`text-xs font-bold ${wStep === i + 1 ? 'text-cafh-indigo' : wStep > i + 1 ? 'text-slate-500' : 'text-slate-300'}`}>{label}</span>
                                {i < wizardSteps.length - 1 && <div className="h-px w-6 bg-slate-200" />}
                            </div>
                        ))}
                    </div>

                    {/* STEP 1: Configuración + Trigger */}
                    {wStep === 1 && (
                        <div className="max-w-xl space-y-5">
                            <div className="text-center mb-6">
                                <h4 className="text-xl font-bold text-slate-800">Configuración del Flujo</h4>
                                <p className="text-sm text-slate-400 mt-1">Define el nombre y qué evento dispara la automatización</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre <span className="text-red-400">*</span></label>
                                <input value={wName} onChange={e => setWName(e.target.value)} placeholder="Ej. Bienvenida nuevos suscriptores"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción</label>
                                <input value={wDesc} onChange={e => setWDesc(e.target.value)} placeholder="¿Qué hace esta automatización?"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-cafh-indigo text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Trigger — ¿Qué inicia el flujo?</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(Object.entries(triggerLabels) as [AutomationRule['trigger']['type'], string][]).map(([val, label]) => (
                                        <button key={val} onClick={() => setWTriggerType(val)}
                                            className={`p-4 rounded-2xl border-2 text-left transition-all text-sm ${wTriggerType === val ? 'border-cafh-indigo bg-cafh-indigo/5 shadow-md shadow-indigo-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                                            <span className="font-bold text-slate-800">{label}</span>
                                        </button>
                                    ))}
                                </div>
                                {/* Conditional trigger params */}
                                {wTriggerType === 'contact_added_to_list' && (
                                    <select value={wTriggerListId} onChange={e => setWTriggerListId(e.target.value)}
                                        className="mt-3 w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo">
                                        <option value="">— Selecciona lista —</option>
                                        {lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                )}
                                {wTriggerType === 'tag_added' && (
                                    <input value={wTriggerTag} onChange={e => setWTriggerTag(e.target.value)} placeholder="Nombre del tag (Ej: retiro_2026)"
                                        className="mt-3 w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo" />
                                )}
                                {wTriggerType === 'no_activity' && (
                                    <div className="mt-3 flex items-center gap-3">
                                        <input type="number" value={wTriggerInactiveDays} onChange={e => setWTriggerInactiveDays(Number(e.target.value))} min={1}
                                            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo w-24" />
                                        <span className="text-sm text-slate-500 font-medium">días sin actividad</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Visual Flow Canvas */}
                    {wStep === 2 && (
                        <div>
                            <div className="text-center mb-5">
                                <h4 className="text-xl font-bold text-slate-800">Diseña el Flujo</h4>
                                <p className="text-sm text-slate-400 mt-1">Arrastra los nodos para organizar el flujo. Usa el panel inferior para agregar pasos.</p>
                            </div>

                            {/* ── React Flow Canvas ── */}
                            <AutomationFlowBuilder
                                trigger={{ type: wTriggerType, listId: wTriggerListId || undefined, tag: wTriggerTag || undefined, inactiveDays: wTriggerInactiveDays }}
                                nodes={wNodes}
                                nodePositions={wNodePositions}
                                onPositionsChange={setWNodePositions}
                                height={480}
                            />

                            {/* ── Node Adder Panel (below canvas) ── */}
                            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Agregar nodo al flujo</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {(['send_email', 'wait', 'condition', 'update_tag', 'move_to_list', 'end'] as AutomationNodeType[]).map(t => (
                                        <button key={t} onClick={() => setAddingNodeType(t)}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${addingNodeType === t ? 'bg-cafh-indigo text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-cafh-indigo'}`}>
                                            {nodeIcon[t]} {t.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>

                                {addingNodeType === 'send_email' && (
                                    <div className="space-y-3">
                                        <input value={nodeEmailSubject} onChange={e => setNodeEmailSubject(e.target.value)} placeholder="Asunto del email *"
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo" />
                                        <textarea value={nodeEmailContent} onChange={e => setNodeEmailContent(e.target.value)} placeholder="Contenido HTML del email *" rows={3}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo resize-none font-mono text-xs" />
                                    </div>
                                )}
                                {addingNodeType === 'wait' && (
                                    <div className="flex gap-3">
                                        <input type="number" value={nodeWaitAmount} onChange={e => setNodeWaitAmount(Number(e.target.value))} min={1}
                                            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo w-24" />
                                        <select value={nodeWaitUnit} onChange={e => setNodeWaitUnit(e.target.value as any)}
                                            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo">
                                            <option value="minutes">Minutos</option>
                                            <option value="hours">Horas</option>
                                            <option value="days">Días</option>
                                        </select>
                                    </div>
                                )}
                                {addingNodeType === 'update_tag' && (
                                    <div className="flex gap-3">
                                        <select value={nodeTagAction} onChange={e => setNodeTagAction(e.target.value as any)}
                                            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo">
                                            <option value="add">Agregar tag</option>
                                            <option value="remove">Remover tag</option>
                                        </select>
                                        <input value={nodeTag} onChange={e => setNodeTag(e.target.value)} placeholder="Nombre del tag"
                                            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo" />
                                    </div>
                                )}
                                {addingNodeType === 'move_to_list' && (
                                    <select value={nodeListId} onChange={e => setNodeListId(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo">
                                        <option value="">— Selecciona lista —</option>
                                        {lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                )}
                                {addingNodeType === 'condition' && (
                                    <div className="flex gap-3">
                                        <select value={nodeCondCheck} onChange={e => setNodeCondCheck(e.target.value as any)}
                                            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo">
                                            <option value="has_tag">Tiene tag</option>
                                            <option value="in_list">Está en lista</option>
                                            <option value="email_opened">Abrió email reciente</option>
                                            <option value="email_clicked">Hizo clic reciente</option>
                                        </select>
                                        {(nodeCondCheck === 'has_tag' || nodeCondCheck === 'in_list') && (
                                            <input value={nodeCondValue} onChange={e => setNodeCondValue(e.target.value)} placeholder={nodeCondCheck === 'has_tag' ? 'Nombre del tag' : 'ID de lista'}
                                                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cafh-indigo" />
                                        )}
                                    </div>
                                )}

                                {addingNodeType && (
                                    <button onClick={handleAddNode} className="mt-3 px-5 py-2.5 bg-cafh-indigo text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all">
                                        + Agregar al flujo
                                    </button>
                                )}

                                {/* Node list (removable) */}
                                {wNodes.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nodos en el flujo ({wNodes.length})</p>
                                        <div className="flex flex-wrap gap-2">
                                            {wNodes.map((n, i) => (
                                                <div key={n.id} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700">
                                                    <span>{nodeIcon[n.type]}</span>
                                                    <span className="capitalize">{n.type.replace(/_/g, ' ')}</span>
                                                    <button onClick={() => setWNodes(prev => prev.filter((_, idx) => idx !== i))}
                                                        className="ml-1 text-red-400 hover:text-red-600 transition-colors">×</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Activate */}
                    {wStep === 3 && (
                        <div className="max-w-xl space-y-6">
                            <div className="text-center mb-6">
                                <h4 className="text-xl font-bold text-slate-800">Revisa y Activa</h4>
                                <p className="text-sm text-slate-400 mt-1">Resumen final antes de activar</p>
                            </div>
                            <div className="bg-gradient-to-br from-cafh-indigo to-blue-700 rounded-2xl p-6 text-white">
                                <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Resumen</p>
                                <p className="text-2xl font-extrabold mb-1">{wName}</p>
                                {wDesc && <p className="text-white/70 text-sm mb-3">{wDesc}</p>}
                                <p className="text-sm text-white/80">Trigger: <strong>{triggerLabels[wTriggerType]}</strong></p>
                                <p className="text-sm text-white/80 mt-1">Nodos: <strong>{wNodes.length}</strong> pasos configurados</p>
                            </div>
                            {/* Flow preview */}
                            <div className="space-y-2">
                                {wNodes.map((n, i) => (
                                    <div key={n.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 text-sm">
                                        <span className="text-base">{nodeIcon[n.type]}</span>
                                        <span className="font-bold text-slate-700 capitalize">{n.type.replace('_', ' ')}</span>
                                        {n.type === 'send_email' && <span className="text-slate-400 text-xs">"{(n as SendEmailNode).subject}"</span>}
                                        {n.type === 'wait' && <span className="text-slate-400 text-xs">{(n as WaitNode).amount} {(n as WaitNode).unit}</span>}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => handleSaveAutomation('Draft')}
                                    className="flex-1 py-3.5 border-2 border-slate-200 bg-white rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm flex items-center justify-center gap-2">
                                    <FileText size={16} /> Guardar Borrador
                                </button>
                                <button onClick={() => handleSaveAutomation('Active')}
                                    className="flex-[2] py-3.5 bg-cafh-indigo text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200 text-sm flex items-center justify-center gap-2">
                                    <Zap size={16} /> Activar Automatización
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Wizard Nav */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                        <button onClick={() => { if (wStep === 1) { setViewTab('list'); resetWizard(); } else setWStep(w => w - 1); }}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm">
                            <ArrowLeft size={16} /> {wStep === 1 ? 'Cancelar' : 'Anterior'}
                        </button>
                        {wStep < 3 && (
                            <button onClick={() => setWStep(w => w + 1)} disabled={wStep === 1 && !wName}
                                className="flex items-center gap-2 px-6 py-3 bg-cafh-indigo text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100 text-sm disabled:opacity-40">
                                Siguiente <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Execution Log Modal */}
            {showExecLog && (
                <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowExecLog(null)} />
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative p-8 animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h4 className="font-bold text-slate-800">Log de Ejecución</h4>
                            <button onClick={() => setShowExecLog(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={18} /></button>
                        </div>
                        <div className="bg-slate-900 rounded-2xl p-5 font-mono text-xs text-emerald-400 space-y-1.5">
                            {showExecLog.log.map((line, i) => (
                                <p key={i} className="leading-relaxed">{line}</p>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-3 text-xs text-slate-400">
                            <span>Contacto: <strong className="text-slate-700">{showExecLog.contactEmail}</strong></span>
                            <span>Estado: <strong className={showExecLog.status === 'completed' ? 'text-emerald-600' : 'text-red-500'}>{showExecLog.status}</strong></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- CMS VIEW ---
export const CMSView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'home' | 'pages' | 'menu' | 'articles' | 'changelog'>('home');
    const [homeConfig, setHomeConfig] = useState<HomeConfig>(() => db.cms.getHomeConfig());
    const [changeLogs, setChangeLogs] = useState<ChangeLog[]>(() => db.cms.getChangeLogs());

    const handleHomeUpdate = (newConfig: HomeConfig) => {
        const updated = db.cms.updateHomeConfig(newConfig);
        setHomeConfig(updated);
        setChangeLogs(db.cms.getChangeLogs());
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gestor de Contenidos (CMS)</h2>
                    <p className="text-slate-500">Administra la experiencia digital de Cafh en tiempo real.</p>
                </div>
            </div>

            {/* CMS Sub-navigation */}
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
                {[
                    { id: 'home', label: 'Home & Global', icon: Globe },
                    { id: 'pages', label: 'Páginas Internas', icon: FileText },
                    { id: 'menu', label: 'Mega Menú', icon: Grid },
                    { id: 'articles', label: 'Artículos & SEO', icon: File },
                    { id: 'changelog', label: 'Bitácora', icon: Clock },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-cafh-indigo text-white shadow-lg shadow-cafh-indigo/25'
                            : 'text-slate-500 hover:bg-cafh-indigo/10 hover:text-cafh-indigo'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'home' && (
                    <HomeEditor config={homeConfig} onSave={handleHomeUpdate} />
                )}
                {activeTab === 'changelog' && (
                    <ChangeLogTable logs={changeLogs} />
                )}
                {activeTab === 'pages' && (
                    <PagesManager />
                )}
                {activeTab === 'articles' && (
                    <ArticlesManager />
                )}
                {activeTab === 'menu' && (
                    <MenuEditor />
                )}
            </div>
        </div>
    );
};

const HomeEditor: React.FC<{ config: HomeConfig; onSave: (config: HomeConfig) => void }> = ({ config, onSave }) => {
    const [localConfig, setLocalConfig] = useState<HomeConfig>(config);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
    const [activeSelector, setActiveSelector] = useState<{ type: 'search' | 'columns' | 'social' | 'hero'; index: number } | null>(null);

    const handleIconSelect = (iconName: string, assetType?: string) => {
        if (!activeSelector) return;
        const { type, index } = activeSelector;
        if (type === 'search') {
            const newItems = [...localConfig.searchItems];
            newItems[index].icon = iconName;
            setLocalConfig({ ...localConfig, searchItems: newItems });
        } else if (type === 'columns') {
            const newCols = [...localConfig.threeColumns];
            newCols[index].icon = iconName;
            setLocalConfig({ ...localConfig, threeColumns: newCols });
        } else if (type === 'social') {
            const newLinks = [...localConfig.footer.socialLinks];
            newLinks[index].icon = iconName;
            setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, socialLinks: newLinks } });
        }
    };

    const handleAssetSelect = (assetUrl: string, assetType?: string) => {
        if (!activeSelector) return;
        const { type, index } = activeSelector;
        if (type === 'hero') {
            const newBgs = [...localConfig.hero.backgrounds];
            // Robust video detection including new formats and blobs
            const videoExtensions = ['.mp4', '.webm', '.ogg', '.3gp', '.mov'];
            const isVideo = assetType === 'video' ||
                videoExtensions.some(ext => assetUrl.toLowerCase().endsWith(ext)) ||
                assetUrl.startsWith('blob:') ||
                assetUrl.includes('video');

            if (index === -1) {
                newBgs.push({
                    id: Math.random().toString(36).substr(2, 9),
                    url: assetUrl,
                    type: isVideo ? 'video' : 'image'
                });
            } else {
                newBgs[index] = {
                    ...newBgs[index],
                    url: assetUrl,
                    type: isVideo ? 'video' : 'image'
                };
            }
            setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, backgrounds: newBgs } });
        }
    };

    const handleSave = () => {
        console.log('Iniciando guardado de configuración:', localConfig);
        try {
            onSave(localConfig);
            alert('✅ Configuración de Home guardada exitosamente.');
        } catch (err) {
            console.error('Error al guardar:', err);
            alert('❌ Error al guardar los cambios. Revisa la consola para más detalles.');
        }
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...localConfig.sectionOrder];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newOrder.length) {
            [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
            setLocalConfig({ ...localConfig, sectionOrder: newOrder });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Hero Editor */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cafh-indigo/5 text-cafh-indigo rounded-lg">
                                <Sparkles size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Sección Hero & Sliders</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={localConfig.hero.textAlignment}
                                onChange={e => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, textAlignment: e.target.value as any } })}
                                className="text-xs font-bold bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 outline-none"
                            >
                                <option value="left">Alineación Izquierda</option>
                                <option value="center">Alineación Centro</option>
                                <option value="right">Alineación Derecha</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Título Principal</label>
                                <input
                                    type="text"
                                    value={localConfig.hero.title}
                                    onChange={e => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, title: e.target.value } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Palabra Destacada</label>
                                <input
                                    type="text"
                                    value={localConfig.hero.highlightWord}
                                    onChange={e => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, highlightWord: e.target.value } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subtítulo Principal</label>
                            <textarea
                                rows={2}
                                value={localConfig.hero.subtitle}
                                onChange={e => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, subtitle: e.target.value } })}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Velocidad Slider (ms)</label>
                                <input
                                    type="number"
                                    value={localConfig.hero.sliderSpeed}
                                    onChange={e => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, sliderSpeed: parseInt(e.target.value) } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ID Video YouTube</label>
                                <input
                                    type="text"
                                    value={localConfig.hero.modalVideoId}
                                    onChange={e => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, modalVideoId: e.target.value } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                    placeholder="Ej: dQw4w9WgXcQ"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Texto Botón CTA</label>
                                <input
                                    type="text"
                                    value={localConfig.hero.ctaText}
                                    onChange={e => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, ctaText: e.target.value } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Link Botón CTA</label>
                                <input
                                    type="text"
                                    value={localConfig.hero.ctaLink}
                                    onChange={e => setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, ctaLink: e.target.value } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Fondos (Imágenes/Videos)</label>
                                <span className="text-[9px] font-bold text-slate-400 italic">Nota: Las subidas locales son temporales para esta sesión.</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {localConfig.hero.backgrounds.map((bg, idx) => (
                                    <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border border-slate-100 bg-slate-100 flex items-center justify-center">
                                        {bg.type === 'video' ? (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                <Video className="text-white/20" size={32} />
                                                <video src={bg.url} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                                            </div>
                                        ) : bg.url ? (
                                            <img src={bg.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        ) : (
                                            <ImageIcon className="text-slate-300" size={32} />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setActiveSelector({ type: 'hero', index: idx });
                                                    setIsAssetPickerOpen(true);
                                                }}
                                                className="p-2 bg-white text-slate-800 rounded-lg shadow-lg hover:scale-110 transition-transform"
                                                title="Cambiar fondo"
                                            >
                                                <RefreshCw size={14} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newBgs = localConfig.hero.backgrounds.filter((_, i) => i !== idx);
                                                    setLocalConfig({ ...localConfig, hero: { ...localConfig.hero, backgrounds: newBgs } });
                                                }}
                                                className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:scale-110 transition-transform"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        setActiveSelector({ type: 'hero', index: -1 });
                                        setIsAssetPickerOpen(true);
                                    }}
                                    className="aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-cafh-indigo hover:text-cafh-indigo transition-all group"
                                >
                                    <Plus size={24} className="group-hover:scale-125 transition-transform" />
                                    <span className="text-[10px] font-black mt-2 uppercase tracking-widest">Añadir Fondo</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Section Editor */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <Compass size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Sección Buscador</h3>
                        </div>
                    </div>
                    <div className="p-8">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subtítulo Buscador</label>
                        <input
                            type="text"
                            value={localConfig.searchSubtitle}
                            onChange={e => setLocalConfig({ ...localConfig, searchSubtitle: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all mb-8"
                        />

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Iconos / Accesos Directos (8 sugeridos)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {localConfig.searchItems.map((item, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Acceso {idx + 1}</span>
                                            <button
                                                onClick={() => {
                                                    const newItems = localConfig.searchItems.filter((_, i) => i !== idx);
                                                    setLocalConfig({ ...localConfig, searchItems: newItems });
                                                }}
                                                className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={item.label}
                                                onChange={e => {
                                                    const newItems = [...localConfig.searchItems];
                                                    newItems[idx].label = e.target.value;
                                                    setLocalConfig({ ...localConfig, searchItems: newItems });
                                                }}
                                                placeholder="Etiqueta"
                                                className="w-full px-3 py-2 bg-white border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-cafh-indigo"
                                            />
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={item.icon}
                                                    onChange={e => {
                                                        const newItems = [...localConfig.searchItems];
                                                        newItems[idx].icon = e.target.value;
                                                        setLocalConfig({ ...localConfig, searchItems: newItems });
                                                    }}
                                                    placeholder="Icono (Lucide)"
                                                    className="w-full pl-3 pr-10 py-2 bg-white border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-cafh-indigo"
                                                />
                                                <button
                                                    onClick={() => {
                                                        setActiveSelector({ type: 'search', index: idx });
                                                        setIsIconPickerOpen(true);
                                                    }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cafh-indigo transition-colors"
                                                >
                                                    <Sparkles size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            value={item.path}
                                            onChange={e => {
                                                const newItems = [...localConfig.searchItems];
                                                newItems[idx].path = e.target.value;
                                                setLocalConfig({ ...localConfig, searchItems: newItems });
                                            }}
                                            placeholder="Ruta (ej: /activities)"
                                            className="w-full px-3 py-2 bg-white border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-cafh-indigo"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    setLocalConfig({
                                        ...localConfig,
                                        searchItems: [...localConfig.searchItems, { label: 'Nuevo', icon: 'Activity', path: '/' }]
                                    });
                                }}
                                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:border-cafh-indigo hover:text-cafh-indigo transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={14} /> AÑADIR ACCESO DIRECTO
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section Order Manager */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Layers size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Orden de Secciones (Home)</h3>
                        </div>
                    </div>
                    <div className="p-8 space-y-3">
                        {localConfig.sectionOrder.map((section, idx) => (
                            <div key={section} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm">
                                        <GripVertical size={16} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 capitalize">{section.replace(/([A-Z])/g, ' $1')}</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => moveSection(idx, 'up')} className="p-2 bg-white rounded-lg text-slate-400 hover:text-cafh-indigo shadow-sm">
                                        <ArrowUp size={14} />
                                    </button>
                                    <button onClick={() => moveSection(idx, 'down')} className="p-2 bg-white rounded-lg text-slate-400 hover:text-cafh-indigo shadow-sm">
                                        <ArrowDown size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Three Columns Editor */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <Grid size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Columnas Informativas</h3>
                        </div>
                    </div>
                    <div className="p-8 space-y-8">
                        {localConfig.threeColumns.map((col, idx) => (
                            <div key={idx} className="p-6 bg-slate-50 rounded-3xl space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Columna 0{idx + 1}</span>
                                        <select
                                            value={col.alignment}
                                            onChange={e => {
                                                const newCols = [...localConfig.threeColumns];
                                                newCols[idx].alignment = e.target.value as any;
                                                setLocalConfig({ ...localConfig, threeColumns: newCols });
                                            }}
                                            className="text-[9px] font-bold bg-white border border-slate-100 rounded-md px-2 py-1 outline-none"
                                        >
                                            <option value="left">Izquierda</option>
                                            <option value="center">Centro</option>
                                            <option value="right">Derecha</option>
                                        </select>
                                    </div>
                                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                                        <Globe size={16} className="text-slate-400" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={col.title}
                                        onChange={e => {
                                            const newCols = [...localConfig.threeColumns];
                                            newCols[idx].title = e.target.value;
                                            setLocalConfig({ ...localConfig, threeColumns: newCols });
                                        }}
                                        placeholder="Título"
                                        className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm font-bold"
                                    />
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={col.icon}
                                            onChange={e => {
                                                const newCols = [...localConfig.threeColumns];
                                                newCols[idx].icon = e.target.value;
                                                setLocalConfig({ ...localConfig, threeColumns: newCols });
                                            }}
                                            placeholder="Icono (Lucide Name)"
                                            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm"
                                        />
                                        <button
                                            onClick={() => {
                                                setActiveSelector({ type: 'columns', index: idx });
                                                setIsIconPickerOpen(true);
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cafh-indigo transition-colors"
                                        >
                                            <Sparkles size={16} />
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    rows={2}
                                    value={col.description}
                                    onChange={e => {
                                        const newCols = [...localConfig.threeColumns];
                                        newCols[idx].description = e.target.value;
                                        setLocalConfig({ ...localConfig, threeColumns: newCols });
                                    }}
                                    placeholder="Descripción"
                                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm resize-none"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={col.link || ''}
                                        onChange={e => {
                                            const newCols = [...localConfig.threeColumns];
                                            newCols[idx].link = e.target.value;
                                            setLocalConfig({ ...localConfig, threeColumns: newCols });
                                        }}
                                        placeholder="Enlace (Opcional)"
                                        className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm"
                                    />
                                    <input
                                        type="number"
                                        value={col.order}
                                        onChange={e => {
                                            const newCols = [...localConfig.threeColumns];
                                            newCols[idx].order = parseInt(e.target.value) || 0;
                                            setLocalConfig({ ...localConfig, threeColumns: newCols });
                                        }}
                                        placeholder="Orden"
                                        className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-cafh-indigo outline-none text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Blog Section Editor */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Sección Blog</h3>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Título de Sección</label>
                                <input
                                    type="text"
                                    value={localConfig.blogSection.sectionTitle}
                                    onChange={e => setLocalConfig({ ...localConfig, blogSection: { ...localConfig.blogSection, sectionTitle: e.target.value } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subtítulo de Sección</label>
                                <input
                                    type="text"
                                    value={localConfig.blogSection.sectionSubtitle}
                                    onChange={e => setLocalConfig({ ...localConfig, blogSection: { ...localConfig.blogSection, sectionSubtitle: e.target.value } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Posts a Mostrar</label>
                                <input
                                    type="number"
                                    value={localConfig.blogSection.postsToShow}
                                    onChange={e => setLocalConfig({ ...localConfig, blogSection: { ...localConfig.blogSection, postsToShow: parseInt(e.target.value) } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Velocidad AutoPlay (ms)</label>
                                <input
                                    type="number"
                                    value={localConfig.blogSection.autoPlaySpeed}
                                    onChange={e => setLocalConfig({ ...localConfig, blogSection: { ...localConfig.blogSection, autoPlaySpeed: parseInt(e.target.value) } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                            <div className="flex flex-col justify-center pt-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={localConfig.blogSection.autoPlay}
                                        onChange={e => setLocalConfig({ ...localConfig, blogSection: { ...localConfig.blogSection, autoPlay: e.target.checked } })}
                                        className="w-5 h-5 rounded text-cafh-indigo focus:ring-cafh-indigo"
                                    />
                                    <span className="text-sm font-bold text-slate-700">Activar AutoPlay</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activities Section Editor */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                                <CalendarIcon size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Sección Actividades</h3>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Título de Sección</label>
                                <input
                                    type="text"
                                    value={localConfig.activitiesSection.title}
                                    onChange={e => setLocalConfig({ ...localConfig, activitiesSection: { ...localConfig.activitiesSection, title: e.target.value } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subtítulo de Sección</label>
                                <input
                                    type="text"
                                    value={localConfig.activitiesSection.subtitle}
                                    onChange={e => setLocalConfig({ ...localConfig, activitiesSection: { ...localConfig.activitiesSection, subtitle: e.target.value } })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Máximo de Eventos a Mostrar</label>
                            <input
                                type="number"
                                value={localConfig.activitiesSection.maxEvents}
                                onChange={e => setLocalConfig({ ...localConfig, activitiesSection: { ...localConfig.activitiesSection, maxEvents: parseInt(e.target.value) } })}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Actions Card */}
                <div className="bg-cafh-indigo p-8 rounded-[2rem] text-white shadow-xl shadow-cafh-indigo/10 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Publicar Cambios</h3>
                        <p className="text-blue-100 text-sm mb-6">Los cambios se reflejarán inmediatamente en el sitio público.</p>
                        <button
                            onClick={handleSave}
                            className="w-full py-4 bg-white text-cafh-indigo font-black rounded-2xl hover:bg-cafh-indigo/5 transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            GUARDAR CONFIGURACIÓN
                        </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10">
                        <Globe size={120} />
                    </div>
                </div>

                {/* Footer Complete Config */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-800">Configuración Footer</h3>
                        <div className="p-2 bg-cafh-indigo/5 text-cafh-indigo rounded-lg">
                            <Layout size={16} />
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Suscripción & CRM</h4>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Título Suscripción</label>
                                <input
                                    type="text"
                                    value={localConfig.footer.subscriptionTitle}
                                    onChange={e => setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, subscriptionTitle: e.target.value } })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subtítulo Suscripción</label>
                                <input
                                    type="text"
                                    value={localConfig.footer.subscriptionSubtitle}
                                    onChange={e => setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, subscriptionSubtitle: e.target.value } })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Origen Lead (Tag CRM)</label>
                                <input
                                    type="text"
                                    value={localConfig.footer.leadSourceTag}
                                    onChange={e => setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, leadSourceTag: e.target.value } })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none font-mono"
                                    placeholder="ej: Footer_Home"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Redes Sociales</h4>
                            {localConfig.footer.socialLinks.map((link, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setActiveSelector({ type: 'social', index: idx });
                                            setIsIconPickerOpen(true);
                                        }}
                                        className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-cafh-indigo hover:bg-white transition-colors"
                                        title="Cambiar Icono"
                                    >
                                        <DynamicIcon name={link.icon} size={16} />
                                    </button>
                                    <input
                                        type="text"
                                        value={link.platform}
                                        onChange={e => {
                                            const newLinks = [...localConfig.footer.socialLinks];
                                            newLinks[idx].platform = e.target.value;
                                            setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, socialLinks: newLinks } });
                                        }}
                                        placeholder="Plataforma"
                                        className="w-1/3 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={e => {
                                            const newLinks = [...localConfig.footer.socialLinks];
                                            newLinks[idx].url = e.target.value;
                                            setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, socialLinks: newLinks } });
                                        }}
                                        placeholder="URL"
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs outline-none"
                                    />
                                    <button
                                        onClick={() => {
                                            const newLinks = localConfig.footer.socialLinks.filter((_, i) => i !== idx);
                                            setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, socialLinks: newLinks } });
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    setLocalConfig({
                                        ...localConfig,
                                        footer: {
                                            ...localConfig.footer,
                                            socialLinks: [...localConfig.footer.socialLinks, { platform: 'Nueva', url: '#', icon: 'Globe' }]
                                        }
                                    });
                                }}
                                className="text-xs font-bold text-cafh-indigo flex items-center gap-1 hover:underline"
                            >
                                <Plus size={12} /> Añadir Red Social
                            </button>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Columnas del Footer (4)</h4>
                            {localConfig.footer.columns.map((col, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-2xl space-y-4">
                                    <input
                                        type="text"
                                        value={col.title}
                                        onChange={e => {
                                            const newCols = [...localConfig.footer.columns];
                                            newCols[idx].title = e.target.value;
                                            setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, columns: newCols } });
                                        }}
                                        className="w-full bg-white px-3 py-2 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 outline-none"
                                        placeholder={`Título Columna ${idx + 1}`}
                                    />
                                    <div className="space-y-2">
                                        {col.links.map((link, lIdx) => (
                                            <div key={lIdx} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={link.label}
                                                    onChange={e => {
                                                        const newCols = [...localConfig.footer.columns];
                                                        newCols[idx].links[lIdx].label = e.target.value;
                                                        setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, columns: newCols } });
                                                    }}
                                                    placeholder="Etiqueta"
                                                    className="w-1/3 px-2 py-1.5 bg-white border border-slate-100 rounded-md text-[10px] outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    value={link.path || link.url || ''}
                                                    onChange={e => {
                                                        const newCols = [...localConfig.footer.columns];
                                                        newCols[idx].links[lIdx].path = e.target.value;
                                                        newCols[idx].links[lIdx].url = e.target.value;
                                                        setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, columns: newCols } });
                                                    }}
                                                    placeholder="URL o Ruta"
                                                    className="flex-1 px-2 py-1.5 bg-white border border-slate-100 rounded-md text-[10px] outline-none"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newCols = [...localConfig.footer.columns];
                                                        newCols[idx].links = newCols[idx].links.filter((_, i) => i !== lIdx);
                                                        setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, columns: newCols } });
                                                    }}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newCols = [...localConfig.footer.columns];
                                                newCols[idx].links.push({ label: 'Nuevo Enlace', path: '/', url: '/' });
                                                setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, columns: newCols } });
                                            }}
                                            className="text-[10px] font-bold text-cafh-indigo flex items-center gap-1 hover:underline"
                                        >
                                            <Plus size={10} /> Añadir Enlace
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Copyright Text</label>
                            <input
                                type="text"
                                value={localConfig.footer.copyright}
                                onChange={e => setLocalConfig({ ...localConfig, footer: { ...localConfig.footer, copyright: e.target.value } })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AssetPickerModal
                isOpen={isIconPickerOpen}
                onClose={() => setIsIconPickerOpen(false)}
                onSelect={handleIconSelect}
                initialTab="system"
                title="Seleccionar Ícono o Recurso"
                description="Busca un ícono del sistema o selecciona una imagen/video."
            />

            <AssetPickerModal
                isOpen={isAssetPickerOpen}
                onClose={() => setIsAssetPickerOpen(false)}
                onSelect={handleAssetSelect}
                initialTab="media"
                allowedMediaTypes={['image', 'video']}
                title="Seleccionar Fondo o Recurso"
                description="Elige una imagen o video para el fondo, o un ícono del sistema si lo prefieres."
            />
        </div>
    );
};

// --- MEDIA LIBRARY VIEW ---

export const MediaLibraryView: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterType, setFilterType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setAssets(db.media.search(searchQuery, filterType));
    }, [searchQuery, filterType, refreshKey]);

    const handleUpload = (newAsset: Omit<MediaAsset, 'id' | 'uploadedAt'>) => {
        db.media.add(newAsset);
        setRefreshKey(prev => prev + 1);
        setIsUploadModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este archivo?')) {
            db.media.delete(id);
            setRefreshKey(prev => prev + 1);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'image': return <ImageIcon size={20} />;
            case 'video': return <Film size={20} />;
            case 'audio': return <Music size={20} />;
            default: return <File size={20} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Biblioteca de Medios</h2>
                    <p className="text-slate-500">Gestiona imágenes, videos y documentos institucionales.</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-cafh-indigo text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Subir Archivos</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o etiqueta..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cafh-indigo outline-none text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cafh-indigo"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="image">Imágenes</option>
                        <option value="video">Videos</option>
                        <option value="document">Documentos</option>
                        <option value="audio">Audio</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-cafh-indigo shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-cafh-indigo shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Assets Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {assets.map(asset => (
                        <div key={asset.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all relative">
                            <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden">
                                {asset.type === 'image' ? (
                                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="text-slate-400">
                                        {getIcon(asset.type)}
                                    </div>
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-md transition-colors">
                                        <Download size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(asset.id)}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg backdrop-blur-md transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-xs font-bold text-slate-800 truncate mb-1" title={asset.name}>{asset.name}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400 uppercase font-medium">{asset.size}</span>
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">{asset.type}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Upload Placeholder */}
                    <div
                        onClick={() => setIsUploadModalOpen(true)}
                        className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-cafh-indigo hover:text-cafh-indigo transition-colors cursor-pointer"
                    >
                        <Plus size={32} className="mb-2" />
                        <span className="text-xs font-bold">Subir nuevo</span>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Archivo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tamaño</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {assets.map(asset => (
                                <tr key={asset.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                                {getIcon(asset.type)}
                                            </div>
                                            <span className="font-medium text-slate-800">{asset.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-slate-500 uppercase">{asset.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">{asset.size}</td>
                                    <td className="px-6 py-4 text-xs text-slate-500">{asset.uploadedAt}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-cafh-indigo"><ExternalLink size={16} /></button>
                                            <button className="p-1.5 text-slate-400 hover:text-cafh-indigo"><Download size={16} /></button>
                                            <button onClick={() => handleDelete(asset.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {assets.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <SearchIcon size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No se encontraron archivos</h3>
                    <p className="text-slate-500">Intenta con otra búsqueda o filtro.</p>
                </div>
            )}

            <MediaUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleUpload}
            />
        </div>
    );
};

const MediaUploadModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onUpload: (asset: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
}> = ({ isOpen, onClose, onUpload }) => {
    const [uploadType, setUploadType] = useState<'local' | 'url'>('local');
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        try {
            const rawProfiles = localStorage.getItem('cafh_journey_profiles_v1');
            const profiles = rawProfiles ? JSON.parse(rawProfiles) : [];
            const rawQs = localStorage.getItem('cafh_journey_questions_v1');
            const qs = rawQs ? JSON.parse(rawQs) : [];

            let allTags = new Set<string>();
            qs.forEach((q: any) => {
                q.options?.forEach((o: any) => {
                    o.profileTags?.forEach((t: string) => allTags.add(t));
                });
            });
            profiles.forEach((p: any) => {
                p.contentTags?.forEach((t: string) => allTags.add(t));
            });

            const defaults = ['Meditación', 'Bienestar', 'Mística', 'Filosofía', 'Grupos', 'Voluntariado', 'Lecturas Breves', 'Podcast', 'Reuniones', 'Cursos', 'Retiros', 'Biblioteca', 'Blog', 'Meditación Guiada', 'Diálogos', 'Estudio'];
            defaults.forEach(t => allTags.add(t));

            setAvailableTags(Array.from(allTags).sort());
        } catch (e) {
            console.error(e);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsProcessing(true);
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                const type = file.type.startsWith('image') ? 'image' :
                    file.type.startsWith('video') ? 'video' :
                        file.type.startsWith('audio') ? 'audio' : 'document';

                onUpload({
                    name: file.name,
                    url: base64,
                    type: type as any,
                    size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                    tags: selectedTags.length > 0 ? selectedTags : ['Local']
                });
                setIsProcessing(false);
                setSelectedTags([]);
                onClose();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlUpload = () => {
        if (!url || !name) return;

        // Simple type detection from URL
        let type: 'image' | 'video' | 'audio' | 'document' = 'document';
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) type = 'image';
        else if (lowerUrl.match(/\.(mp4|webm|ogg|mov)$/)) type = 'video';
        else if (lowerUrl.match(/\.(mp3|wav|ogg)$/)) type = 'audio';

        onUpload({
            name,
            url,
            type,
            size: 'External',
            tags: ['URL']
        });
        onClose();
        setUrl('');
        setName('');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">Subir Archivo</h3>
                            <p className="text-slate-500">Agrega nuevos medios a tu biblioteca.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                        <button
                            onClick={() => setUploadType('local')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${uploadType === 'local' ? 'bg-white text-cafh-indigo shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Archivo Local
                        </button>
                        <button
                            onClick={() => setUploadType('url')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${uploadType === 'url' ? 'bg-white text-cafh-indigo shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Desde URL
                        </button>
                    </div>

                    {uploadType === 'local' ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Etiquetas del Viaje para este Archivo</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {availableTags.map(tag => {
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                onClick={() => setSelectedTags(prev => isSelected ? prev.filter(t => t !== tag) : [...prev, tag])}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected ? 'bg-cafh-indigo text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-cafh-indigo'}`}
                                            >
                                                {tag}
                                            </button>
                                        )
                                    })}
                                </div>
                                <p className="text-[10px] text-slate-400">Estas etiquetas conectan el archivo con los perfiles del viaje de usuario.</p>
                            </div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-cafh-indigo hover:bg-cafh-indigo/5 transition-all cursor-pointer group"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => {
                                        handleFileChange(e);
                                    }}
                                />
                                {isProcessing ? (
                                    <RefreshCw size={48} className="mx-auto mb-4 text-cafh-indigo animate-spin" />
                                ) : (
                                    <Plus size={48} className="mx-auto mb-4 text-slate-300 group-hover:text-cafh-indigo transition-colors" />
                                )}
                                <p className="text-slate-600 font-bold">Haz clic para seleccionar un archivo</p>
                                <p className="text-xs text-slate-400 mt-2">Imágenes, videos, audio o documentos</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre del Archivo</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: Logo Institucional"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">URL del Archivo</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Etiquetas del Viaje para este Archivo</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {availableTags.map(tag => {
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                onClick={() => setSelectedTags(prev => isSelected ? prev.filter(t => t !== tag) : [...prev, tag])}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected ? 'bg-cafh-indigo text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-cafh-indigo'}`}
                                            >
                                                {tag}
                                            </button>
                                        )
                                    })}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2">El contenido con estas etiquetas aparecerá en el dashboard de los miembros de acuerdo a lo definido en el Viaje.</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (!url || !name) return;
                                    let type: 'image' | 'video' | 'audio' | 'document' = 'document';
                                    const lowerUrl = url.toLowerCase();
                                    if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) type = 'image';
                                    else if (lowerUrl.match(/\.(mp4|webm|ogg|mov)$/)) type = 'video';
                                    else if (lowerUrl.match(/\.(mp3|wav|ogg)$/)) type = 'audio';

                                    onUpload({ name, url, type, size: 'External', tags: selectedTags.length > 0 ? selectedTags : ['URL'] });
                                    onClose();
                                    setUrl('');
                                    setName('');
                                    setSelectedTags([]);
                                }}
                                disabled={!url || !name}
                                className="w-full py-4 bg-cafh-indigo text-white font-bold rounded-2xl shadow-xl shadow-cafh-indigo/10 hover:bg-slate-900 transition-all disabled:opacity-50"
                            >
                                Agregar desde URL
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PagesManager: React.FC = () => {
    const [pages, setPages] = useState<CustomPage[]>(() => db.cms.getPages());
    const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
    const [showSystemPages, setShowSystemPages] = useState(false);

    const systemPages = db.cms.getAllAvailableRoutes().filter(r => !r.isDynamic);

    const handleSavePage = (page: CustomPage) => {
        db.cms.savePage(page);
        setPages(db.cms.getPages());
        setEditingPage(null);
    };

    const handleDeletePage = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta página?')) {
            db.cms.deletePage(id);
            setPages(db.cms.getPages());
        }
    };

    if (editingPage) {
        return <PageEditor page={editingPage} onSave={handleSavePage} onCancel={() => setEditingPage(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Mapa de Páginas & Contenidos</h3>
                    <p className="text-xs text-slate-500">Centraliza y gestiona todas las rutas de tu plataforma.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowSystemPages(!showSystemPages)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${showSystemPages ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        {showSystemPages ? 'Ocultar Páginas Sistema' : 'Ver Páginas Sistema'}
                    </button>
                    <button
                        onClick={() => setEditingPage({ id: '', title: '', slug: '', sections: [], status: 'Draft', seo: { title: '', description: '', keywords: [] } })}
                        className="flex items-center gap-2 px-4 py-2 bg-cafh-indigo text-white rounded-xl hover:bg-slate-900 transition-all shadow-sm text-sm font-bold"
                    >
                        <Plus size={18} />
                        CREAR NUEVA PÁGINA
                    </button>
                </div>
            </div>

            {showSystemPages && (
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Páginas del Sistema (Estáticas)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {systemPages.map(p => (
                            <div key={p.path} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                                <div>
                                    <p className="text-sm font-bold text-slate-700">{p.label}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{p.path}</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href={p.path} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-cafh-indigo"><ExternalLink size={14} /></a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map(page => (
                    <div key={page.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-cafh-indigo/5 text-cafh-indigo rounded-2xl">
                                <FileText size={24} />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${page.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                {page.status}
                            </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-1">{page.title}</h4>
                        <p className="text-xs text-slate-400 mb-6 font-mono">/p/{page.slug}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-xs text-slate-400">{page.sections.length} secciones</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingPage(page)}
                                    className="p-2 text-slate-400 hover:text-cafh-indigo hover:bg-cafh-indigo/5 rounded-lg transition-all"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeletePage(page.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {pages.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No hay páginas dinámicas creadas</h3>
                        <p className="text-slate-500 text-sm">Comienza creando tu primera página interna personalizada.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PageEditor: React.FC<{ page: CustomPage; onSave: (page: CustomPage) => void; onCancel: () => void }> = ({ page, onSave, onCancel }) => {
    const [localPage, setLocalPage] = useState<CustomPage>(page);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [isPagePickerOpen, setIsPagePickerOpen] = useState(false);
    const [allPages, setAllPages] = useState<CustomPage[]>([]);
    const [activeSelector, setActiveSelector] = useState<{ sectionIdx: number; itemIdx: number | null; field?: string } | null>(null);

    useEffect(() => {
        setAllPages(db.cms.getPages());
    }, []);

    const handleIconSelect = (iconName: string, assetType?: string) => {
        if (!activeSelector) return;
        const { sectionIdx, itemIdx, field } = activeSelector;
        const newSections = [...localPage.sections];
        const section = newSections[sectionIdx];

        if (itemIdx === null) {
            // Section level fields
            if (field && section.content[field] !== undefined) {
                section.content[field] = iconName;
            } else if (section.type === 'Hero' || section.type === 'Image' || section.type === 'ImageText') {
                section.content.imageUrl = iconName;
            } else if (section.type === 'Video') {
                section.content.videoId = iconName;
            } else if (section.type === 'Gallery') {
                if (!section.content.images) section.content.images = [];
                section.content.images.push(iconName);
            }
        } else {
            // Item level icon
            if (section.type === 'Stats' || section.type === 'Cards' || section.type === 'IconGrid') {
                section.content.items[itemIdx].icon = iconName;
            }
        }
        setLocalPage({ ...localPage, sections: newSections });
    };
    const handlePageLinkSelect = (slug: string) => {
        if (!activeSelector) return;
        const { sectionIdx, itemIdx, field } = activeSelector;
        const newSections = [...localPage.sections];

        if (itemIdx === null) {
            if (field) newSections[sectionIdx].content[field] = slug;
        } else {
            if (field) newSections[sectionIdx].content.items[itemIdx][field] = slug;
        }

        setLocalPage({ ...localPage, sections: newSections });
        setIsPagePickerOpen(false);
        setActiveSelector(null);
    };

    const addSection = (type: PageSection['type']) => {
        const newSection: PageSection = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: type === 'Text' ? { text: 'Nueva sección de texto...' } :
                type === 'Image' ? { imageUrl: '', caption: '' } :
                    type === 'Hero' ? { title: '', subtitle: '', imageUrl: '', ctaText: '', ctaLink: '' } :
                        type === 'Stats' ? { items: [{ label: 'Dato', value: '100', icon: 'Activity' }] } :
                            type === 'Cards' ? { items: [{ title: 'Título', description: 'Descripción', icon: 'Star' }] } :
                                type === 'IconGrid' ? { items: [{ label: 'Etiqueta', icon: 'Heart' }] } :
                                    type === 'Gallery' ? { images: [] } :
                                        type === 'Video' ? { videoId: '', title: '' } :
                                            type === 'CTA' ? { title: '', text: '', buttonText: '', buttonLink: '' } :
                                                type === 'Accordion' ? { items: [{ title: 'Pregunta', content: 'Respuesta' }] } :
                                                    type === 'ImageText' ? { title: 'Tu título aquí', text: 'Tu descripción aquí...', imageUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3', imagePosition: 'left' } :
                                                        type === 'Table' ? { title: 'Cronograma', headers: ['Horario', 'Actividad', 'Lugar'], rows: [['08:00', 'Meditación', 'Sala A'], ['10:00', 'Charla', 'Salón Central']] } :
                                                            type === 'Tabs' ? { items: [{ title: 'Misión', content: 'Contenido de la misión...' }, { title: 'Visión', content: 'Contenido de la visión...' }] } :
                                                                type === 'VideoGrid' ? { items: [{ title: 'Presentación', videoId: 'dQw4w9WgXcQ' }, { title: 'Testimonio', videoId: 'dQw4w9WgXcQ' }] } :
                                                                    type === 'ResourcesGrid' || type === 'EventsCalendar' || type === 'Timeline' || type === 'MethodPillars' ? {} :
                                                                        { items: [] },
            order: localPage.sections.length
        };
        setLocalPage({ ...localPage, sections: [...localPage.sections, newSection] });
    };

    const moveSection = (idx: number, direction: 'up' | 'down') => {
        const newSections = [...localPage.sections];
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx >= 0 && targetIdx < newSections.length) {
            [newSections[idx], newSections[targetIdx]] = [newSections[targetIdx], newSections[idx]];
            setLocalPage({ ...localPage, sections: newSections });
        }
    };

    const duplicateSection = (idx: number) => {
        const newSections = [...localPage.sections];
        const sectionToCopy = newSections[idx];
        const duplicated: PageSection = {
            ...JSON.parse(JSON.stringify(sectionToCopy)),
            id: Math.random().toString(36).substr(2, 9),
            order: sectionToCopy.order + 0.5
        };
        newSections.push(duplicated);
        const sorted = newSections.sort((a, b) => a.order - b.order).map((s, i) => ({ ...s, order: i }));
        setLocalPage({ ...localPage, sections: sorted });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-400" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-800">{localPage.id ? 'Editar Página' : 'Nueva Página'}</h3>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 group relative cursor-pointer" onClick={() => {
                                navigator.clipboard.writeText(`/${localPage.slug}`);
                                // Optional toast
                            }}>
                                <Globe2 size={12} className="text-slate-400" />
                                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">/{localPage.slug || 'sin-ruta'}</span>
                                <Copy size={10} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                                    Clic para copiar ruta
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">Configura la estructura y contenido de tu página.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={localPage.status}
                        onChange={e => setLocalPage({ ...localPage, status: e.target.value as any })}
                        className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"
                    >
                        <option value="Draft">Borrador</option>
                        <option value="Published">Publicado</option>
                    </select>
                    <button
                        onClick={() => onSave(localPage)}
                        className="px-6 py-2 bg-cafh-indigo text-white rounded-xl font-bold text-sm shadow-lg shadow-cafh-indigo/10"
                    >
                        GUARDAR PÁGINA
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Título de la Página</label>
                                <input
                                    type="text"
                                    value={localPage.title}
                                    onChange={e => setLocalPage({ ...localPage, title: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                    placeholder="Ej: Nuestra Historia"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={localPage.slug}
                                    onChange={e => setLocalPage({ ...localPage, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-cafh-indigo outline-none transition-all"
                                    placeholder="nuestra-historia"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sections List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-4">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Secciones de Contenido</h4>
                        </div>

                        {localPage.sections.map((section, idx) => (
                            <div key={section.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group">
                                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg text-cafh-indigo shadow-sm">
                                            {section.type === 'Text' ? <Type size={16} /> :
                                                section.type === 'Image' ? <Image size={16} /> :
                                                    section.type === 'Hero' ? <Layout size={16} /> :
                                                        section.type === 'Stats' ? <Hash size={16} /> :
                                                            section.type === 'Cards' ? <Grid size={16} /> :
                                                                section.type === 'IconGrid' ? <Activity size={16} /> :
                                                                    section.type === 'Gallery' ? <Image size={16} /> :
                                                                        section.type === 'Video' ? <Play size={16} /> :
                                                                            section.type === 'CTA' ? <MousePointer size={16} /> :
                                                                                section.type === 'ResourcesGrid' || section.type === 'EventsCalendar' || section.type === 'Timeline' || section.type === 'MethodPillars' ? <Layout size={16} /> :
                                                                                    <ChevronDown size={16} />}
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">{section.type} Section</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => moveSection(idx, 'up')}
                                            disabled={idx === 0}
                                            className="p-2 text-slate-300 hover:text-cafh-indigo disabled:opacity-30 transition-all"
                                        >
                                            <ChevronUp size={16} />
                                        </button>
                                        <button
                                            onClick={() => moveSection(idx, 'down')}
                                            disabled={idx === localPage.sections.length - 1}
                                            className="p-2 text-slate-300 hover:text-cafh-indigo disabled:opacity-30 transition-all"
                                        >
                                            <ChevronDown size={16} />
                                        </button>
                                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                        <button
                                            onClick={() => duplicateSection(idx)}
                                            className="p-2 text-slate-300 hover:text-cafh-indigo transition-all"
                                            title="Duplicar Sección"
                                        >
                                            <Copy size={16} />
                                        </button>
                                        <button
                                            onClick={() => setLocalPage({ ...localPage, sections: localPage.sections.filter(s => s.id !== section.id) })}
                                            className="p-2 text-slate-300 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {section.type === 'Text' && (
                                        <textarea
                                            value={section.content.text}
                                            onChange={e => {
                                                const newSections = [...localPage.sections];
                                                newSections[idx].content.text = e.target.value;
                                                setLocalPage({ ...localPage, sections: newSections });
                                            }}
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none h-32 resize-none"
                                            placeholder="Escribe el contenido aquí..."
                                        />
                                    )}
                                    {section.type === 'Image' && (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={section.content.imageUrl}
                                                onChange={e => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.imageUrl = e.target.value;
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                                                placeholder="URL de la imagen"
                                            />
                                            <input
                                                type="text"
                                                value={section.content.caption}
                                                onChange={e => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.caption = e.target.value;
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                                                placeholder="Pie de foto (opcional)"
                                            />
                                        </div>
                                    )}
                                    {section.type === 'ImageText' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        value={section.content.title}
                                                        onChange={e => {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.title = e.target.value;
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                        }}
                                                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"
                                                        placeholder="Título"
                                                    />
                                                    <textarea
                                                        value={section.content.text}
                                                        onChange={e => {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.text = e.target.value;
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                        }}
                                                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none h-32 resize-none"
                                                        placeholder="Contenido..."
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="relative group/img overflow-hidden rounded-xl border border-slate-100">
                                                        <img src={section.content.imageUrl} alt="" className="w-full h-40 object-cover" />
                                                        <button
                                                            onClick={() => {
                                                                setActiveSelector({ sectionIdx: idx, itemIdx: null, field: 'imageUrl' });
                                                                setIsIconPickerOpen(true);
                                                            }}
                                                            className="absolute inset-0 bg-cafh-indigo/60 text-white opacity-0 group-hover/img:opacity-100 flex items-center justify-center gap-2 transition-all"
                                                        >
                                                            <Sparkles size={16} /> Cambiar Media
                                                        </button>
                                                    </div>
                                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.imagePosition = 'left';
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${section.content.imagePosition === 'left' ? 'bg-white text-cafh-indigo shadow-sm' : 'text-slate-400'}`}
                                                        >
                                                            IZQUIERDA
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.imagePosition = 'right';
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${section.content.imagePosition === 'right' ? 'bg-white text-cafh-indigo shadow-sm' : 'text-slate-400'}`}
                                                        >
                                                            DERECHA
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {section.type === 'Table' && (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={section.content.title}
                                                onChange={e => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.title = e.target.value;
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"
                                                placeholder="Título de la Tabla"
                                            />
                                            <div className="overflow-x-auto bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                <table className="w-full text-xs text-left">
                                                    <thead>
                                                        <tr>
                                                            {section.content.headers.map((h: string, hi: number) => (
                                                                <th key={hi} className="p-2">
                                                                    <input
                                                                        type="text"
                                                                        value={h}
                                                                        onChange={e => {
                                                                            const newSections = [...localPage.sections];
                                                                            newSections[idx].content.headers[hi] = e.target.value;
                                                                            setLocalPage({ ...localPage, sections: newSections });
                                                                        }}
                                                                        className="w-full bg-white border border-slate-200 rounded p-1 outline-none font-bold"
                                                                    />
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {section.content.rows.map((row: string[], ri: number) => (
                                                            <tr key={ri}>
                                                                {row.map((cell, ci) => (
                                                                    <td key={ci} className="p-1">
                                                                        <input
                                                                            type="text"
                                                                            value={cell}
                                                                            onChange={e => {
                                                                                const newSections = [...localPage.sections];
                                                                                newSections[idx].content.rows[ri][ci] = e.target.value;
                                                                                setLocalPage({ ...localPage, sections: newSections });
                                                                            }}
                                                                            className="w-full bg-slate-100/50 border border-transparent hover:border-slate-200 rounded p-1 outline-none"
                                                                        />
                                                                    </td>
                                                                ))}
                                                                <td className="p-1">
                                                                    <button
                                                                        onClick={() => {
                                                                            const newSections = [...localPage.sections];
                                                                            newSections[idx].content.rows.splice(ri, 1);
                                                                            setLocalPage({ ...localPage, sections: newSections });
                                                                        }}
                                                                        className="p-1 text-slate-300 hover:text-red-500"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <button
                                                    onClick={() => {
                                                        const newSections = [...localPage.sections];
                                                        newSections[idx].content.rows.push(new Array(section.content.headers.length).fill(''));
                                                        setLocalPage({ ...localPage, sections: newSections });
                                                    }}
                                                    className="mt-4 flex items-center gap-2 text-[10px] font-bold text-cafh-indigo hover:text-cafh-indigo-dark transition-all px-3 py-1 bg-white rounded-lg shadow-sm border border-slate-100"
                                                >
                                                    <Plus size={10} /> AÑADIR FILA
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {section.type === 'Tabs' && (
                                        <div className="space-y-4">
                                            {section.content.items.map((item: any, i: number) => (
                                                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                                                    <button
                                                        onClick={() => {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.items.splice(i, 1);
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                        }}
                                                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={e => {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.items[i].title = e.target.value;
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                        }}
                                                        className="w-full mb-2 p-2 bg-white border border-slate-100 rounded-lg text-sm font-bold outline-none"
                                                        placeholder="Título de la Pestaña"
                                                    />
                                                    <textarea
                                                        value={item.content}
                                                        onChange={e => {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.items[i].content = e.target.value;
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                        }}
                                                        className="w-full p-2 bg-white border border-slate-100 rounded-lg text-xs outline-none h-24 resize-none"
                                                        placeholder="Contenido..."
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.items.push({ title: 'Nueva Pestaña', content: '' });
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full py-3 border border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-cafh-indigo hover:border-cafh-indigo hover:bg-cafh-indigo/5 transition-all text-xs font-bold"
                                            >
                                                + AÑADIR PESTAÑA
                                            </button>
                                        </div>
                                    )}
                                    {section.type === 'VideoGrid' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {section.content.items.map((v: any, vi: number) => (
                                                    <div key={vi} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group space-y-3">
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.items.splice(vi, 1);
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden relative">
                                                            <img src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`} alt={v.title} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <Play size={24} className="text-white drop-shadow-lg" />
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={v.title}
                                                            onChange={e => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.items[vi].title = e.target.value;
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="w-full p-2 bg-white border border-slate-100 rounded-lg text-xs font-bold outline-none"
                                                            placeholder="Título del Video"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={v.videoId}
                                                            onChange={e => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.items[vi].videoId = e.target.value;
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="w-full p-2 bg-white border border-slate-100 rounded-lg text-xs font-mono outline-none"
                                                            placeholder="ID de Video YouTube"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.items.push({ title: 'Nuevo Video', videoId: '' });
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full py-3 border border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-cafh-indigo hover:border-cafh-indigo hover:bg-cafh-indigo/5 transition-all text-xs font-bold"
                                            >
                                                + AÑADIR VIDEO A LA GRILLA
                                            </button>
                                        </div>
                                    )}
                                    {section.type === 'Hero' && (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={section.content.title}
                                                onChange={e => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.title = e.target.value;
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"
                                                placeholder="Título del Hero"
                                            />
                                            <input
                                                type="text"
                                                value={section.content.imageUrl}
                                                onChange={e => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.imageUrl = e.target.value;
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                                                placeholder="URL de fondo"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={section.content.ctaText}
                                                    onChange={e => {
                                                        const newSections = [...localPage.sections];
                                                        newSections[idx].content.ctaText = e.target.value;
                                                        setLocalPage({ ...localPage, sections: newSections });
                                                    }}
                                                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                                                    placeholder="Texto Botón"
                                                />
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={section.content.ctaLink}
                                                        onChange={e => {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.ctaLink = e.target.value;
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                        }}
                                                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none pr-10"
                                                        placeholder="Enlace (ex: /contacto)"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            setActiveSelector({ sectionIdx: idx, itemIdx: null, field: 'ctaLink' });
                                                            setIsPagePickerOpen(true);
                                                        }}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cafh-indigo"
                                                        title="Seleccionar página"
                                                    >
                                                        <Globe size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {section.type === 'Stats' && (
                                        <div className="space-y-4">
                                            {section.content.items.map((item: any, i: number) => (
                                                <div key={i} className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl">
                                                    <input
                                                        type="text"
                                                        value={item.label}
                                                        onChange={e => {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.items[i].label = e.target.value;
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                        }}
                                                        className="px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs outline-none"
                                                        placeholder="Etiqueta"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.value}
                                                        onChange={e => {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.items[i].value = e.target.value;
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                        }}
                                                        className="px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs outline-none"
                                                        placeholder="Valor"
                                                    />
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="text"
                                                                value={item.icon}
                                                                onChange={e => {
                                                                    const newSections = [...localPage.sections];
                                                                    newSections[idx].content.items[i].icon = e.target.value;
                                                                    setLocalPage({ ...localPage, sections: newSections });
                                                                }}
                                                                className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs outline-none"
                                                                placeholder="Icono"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    setActiveSelector({ sectionIdx: idx, itemIdx: i });
                                                                    setIsIconPickerOpen(true);
                                                                }}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cafh-indigo"
                                                            >
                                                                <Sparkles size={12} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.items = newSections[idx].content.items.filter((_: any, index: number) => index !== i);
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.items.push({ label: '', value: '', icon: 'Activity' });
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 hover:border-cafh-indigo hover:text-cafh-indigo transition-all"
                                            >
                                                + AÑADIR DATO
                                            </button>
                                        </div>
                                    )}
                                    {section.type === 'Cards' && (
                                        <div className="space-y-4">
                                            {section.content.items.map((item: any, i: number) => (
                                                <div key={i} className="p-4 bg-slate-50 rounded-xl space-y-3">
                                                    <div className="flex justify-between">
                                                        <input
                                                            type="text"
                                                            value={item.title}
                                                            onChange={e => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.items[i].title = e.target.value;
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="bg-transparent font-bold text-sm outline-none w-full"
                                                            placeholder="Título de la Card"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.items = newSections[idx].content.items.filter((_: any, index: number) => index !== i);
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="p-1 text-red-400 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        value={item.description}
                                                        onChange={e => {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.items[i].description = e.target.value;
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                        }}
                                                        className="w-full p-3 bg-white border border-slate-100 rounded-lg text-xs outline-none h-20 resize-none"
                                                        placeholder="Descripción..."
                                                    />
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={item.icon}
                                                            onChange={e => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.items[i].icon = e.target.value;
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs outline-none"
                                                            placeholder="Icono (Lucide)"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                setActiveSelector({ sectionIdx: idx, itemIdx: i });
                                                                setIsIconPickerOpen(true);
                                                            }}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-cafh-indigo hover:bg-cafh-indigo/5 rounded-md"
                                                        >
                                                            <Sparkles size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.items.push({ title: '', description: '', icon: 'Star' });
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 hover:border-cafh-indigo hover:text-cafh-indigo transition-all"
                                            >
                                                + AÑADIR CARD
                                            </button>
                                        </div>
                                    )}
                                    {section.type === 'IconGrid' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                {section.content.items.map((item: any, i: number) => (
                                                    <div key={i} className="flex gap-2 p-2 bg-slate-50 rounded-xl">
                                                        <input
                                                            type="text"
                                                            value={item.label}
                                                            onChange={e => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.items[i].label = e.target.value;
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="flex-1 px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs outline-none"
                                                            placeholder="Etiqueta"
                                                        />
                                                        <div className="relative w-24">
                                                            <input
                                                                type="text"
                                                                value={item.icon}
                                                                onChange={e => {
                                                                    const newSections = [...localPage.sections];
                                                                    newSections[idx].content.items[i].icon = e.target.value;
                                                                    setLocalPage({ ...localPage, sections: newSections });
                                                                }}
                                                                className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs outline-none"
                                                                placeholder="Icono"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    setActiveSelector({ sectionIdx: idx, itemIdx: i });
                                                                    setIsIconPickerOpen(true);
                                                                }}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-cafh-indigo hover:bg-cafh-indigo/5 rounded-md"
                                                            >
                                                                <Sparkles size={14} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.items = newSections[idx].content.items.filter((_: any, index: number) => index !== i);
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.items.push({ label: '', icon: 'Heart' });
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 hover:border-cafh-indigo hover:text-cafh-indigo transition-all"
                                            >
                                                + AÑADIR ICONO
                                            </button>
                                        </div>
                                    )}
                                    {section.type === 'Gallery' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-3 gap-3">
                                                {section.content.images.map((img: string, i: number) => (
                                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                                                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.images = newSections[idx].content.images.filter((_: any, index: number) => index !== i);
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    id={`new-img-${section.id}`}
                                                    className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                                                    placeholder="URL de imagen..."
                                                />
                                                <button
                                                    onClick={() => {
                                                        const input = document.getElementById(`new-img-${section.id}`) as HTMLInputElement;
                                                        if (input.value) {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.images.push(input.value);
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                            input.value = '';
                                                        }
                                                    }}
                                                    className="px-4 bg-cafh-indigo text-white rounded-xl text-xs font-bold"
                                                >
                                                    AÑADIR
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {section.type === 'Video' && (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={section.content.title}
                                                onChange={e => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.title = e.target.value;
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                                                placeholder="Título del Video (Opcional)"
                                            />
                                            <input
                                                type="text"
                                                value={section.content.videoId}
                                                onChange={e => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.videoId = e.target.value;
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                                                placeholder="ID de Video YouTube (ej: dQw4w9WgXcQ)"
                                            />
                                        </div>
                                    )}
                                    {section.type === 'CTA' && (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={section.content.title}
                                                onChange={e => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.title = e.target.value;
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none font-bold"
                                                placeholder="Título del CTA"
                                            />
                                            <textarea
                                                value={section.content.text}
                                                onChange={e => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.text = e.target.value;
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none h-20 resize-none"
                                                placeholder="Texto descriptivo..."
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    value={section.content.buttonText}
                                                    onChange={e => {
                                                        const newSections = [...localPage.sections];
                                                        newSections[idx].content.buttonText = e.target.value;
                                                        setLocalPage({ ...localPage, sections: newSections });
                                                    }}
                                                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                                                    placeholder="Texto del Botón"
                                                />
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={section.content.buttonLink}
                                                        onChange={e => {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.buttonLink = e.target.value;
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                        }}
                                                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none pr-10"
                                                        placeholder="Enlace (ex: /contacto)"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            setActiveSelector({ sectionIdx: idx, itemIdx: null, field: 'buttonLink' });
                                                            setIsPagePickerOpen(true);
                                                        }}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cafh-indigo"
                                                    >
                                                        <Globe size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {section.type === 'Accordion' && (
                                        <div className="space-y-4">
                                            {section.content.items.map((item: any, i: number) => (
                                                <div key={i} className="p-4 bg-slate-50 rounded-xl space-y-3">
                                                    <div className="flex justify-between">
                                                        <input
                                                            type="text"
                                                            value={item.title}
                                                            onChange={e => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.items[i].title = e.target.value;
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="bg-transparent font-bold text-sm outline-none w-full"
                                                            placeholder="Título / Pregunta"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newSections = [...localPage.sections];
                                                                newSections[idx].content.items = newSections[idx].content.items.filter((_: any, index: number) => index !== i);
                                                                setLocalPage({ ...localPage, sections: newSections });
                                                            }}
                                                            className="p-1 text-red-400 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        value={item.content}
                                                        onChange={e => {
                                                            const newSections = [...localPage.sections];
                                                            newSections[idx].content.items[i].content = e.target.value;
                                                            setLocalPage({ ...localPage, sections: newSections });
                                                        }}
                                                        className="w-full p-3 bg-white border border-slate-100 rounded-lg text-xs outline-none h-24 resize-none"
                                                        placeholder="Contenido / Respuesta..."
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const newSections = [...localPage.sections];
                                                    newSections[idx].content.items.push({ title: '', content: '' });
                                                    setLocalPage({ ...localPage, sections: newSections });
                                                }}
                                                className="w-full py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 hover:border-cafh-indigo hover:text-cafh-indigo transition-all"
                                            >
                                                + AÑADIR ITEM
                                            </button>
                                        </div>
                                    )}
                                    {(section.type === 'ResourcesGrid' || section.type === 'EventsCalendar' || section.type === 'Timeline' || section.type === 'MethodPillars') && (
                                        <div className="p-4 bg-purple-50 rounded-xl text-center border border-purple-100">
                                            <p className="text-sm text-purple-600 font-medium">Esta es una sección predefinida que inyecta componentes avanzados (<span className="font-bold">{section.type}</span>). No requiere configuración manual aquí.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {localPage.sections.length === 0 && (
                            <div className="p-12 border-2 border-dashed border-slate-100 rounded-[2rem] text-center text-slate-400">
                                <Layers size={40} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm">No hay secciones aún. Añade una para comenzar.</p>
                            </div>
                        )}
                    </div>
                </div >

                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Plus size={16} className="text-cafh-indigo" />
                            Añadir Sección
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={() => addSection('Hero')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <Layout size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Banner Hero</span>
                            </button>
                            <button onClick={() => addSection('Text')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <Type size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Bloque de Texto</span>
                            </button>
                            <button onClick={() => addSection('Image')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <Image size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Imagen / Video</span>
                            </button>
                            <button onClick={() => addSection('ImageText')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <Columns size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Imagen + Texto</span>
                            </button>
                            <button onClick={() => addSection('Table')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <Table2 size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Tabla Pro</span>
                            </button>
                            <button onClick={() => addSection('Tabs')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <FolderOpen size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Pestañas (Tabs)</span>
                            </button>
                            <button onClick={() => addSection('VideoGrid')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <Video size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Galería de Videos</span>
                            </button>

                            <button onClick={() => addSection('Stats')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <Hash size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Datos Numéricos</span>
                            </button>
                            <button onClick={() => addSection('Cards')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <Grid size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Grid de Cards</span>
                            </button>
                            <button onClick={() => addSection('IconGrid')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <Activity size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Grid de Iconos</span>
                            </button>
                            <button onClick={() => addSection('Gallery')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <Image size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Galería de Fotos</span>
                            </button>
                            <button onClick={() => addSection('CTA')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <MousePointer size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Llamado a la Acción</span>
                            </button>
                            <button onClick={() => addSection('Accordion')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <ChevronDown size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Acordeón / FAQ</span>
                            </button>
                            <div className="border-t border-slate-100 pt-3 mt-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bloques Dinámicos (Especiales)</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <button onClick={() => addSection('ResourcesGrid')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-purple-50 rounded-2xl transition-all group">
                                        <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-purple-600 shadow-sm">
                                            <FileText size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-purple-600">Grid de Recursos</span>
                                    </button>
                                    <button onClick={() => addSection('EventsCalendar')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-purple-50 rounded-2xl transition-all group">
                                        <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-purple-600 shadow-sm">
                                            <CalendarIcon size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-purple-600">Calendario de Eventos</span>
                                    </button>
                                    <button onClick={() => addSection('Timeline')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-purple-50 rounded-2xl transition-all group">
                                        <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-purple-600 shadow-sm">
                                            <Layout size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-purple-600">Línea de Tiempo (Historia)</span>
                                    </button>
                                    <button onClick={() => addSection('MethodPillars')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-purple-50 rounded-2xl transition-all group">
                                        <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-purple-600 shadow-sm">
                                            <Grid size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-purple-600">Pilares del Método</span>
                                    </button>
                                </div>
                            </div>
                            <button onClick={() => addSection('Video')} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-cafh-indigo/5 rounded-2xl transition-all group">
                                <div className="p-2 bg-white rounded-lg text-slate-400 group-hover:text-cafh-indigo shadow-sm">
                                    <Play size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-cafh-indigo">Video YouTube</span>
                            </button>
                        </div>
                    </div>

                    {/* SEO Config */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <SearchIcon size={16} className="text-cafh-indigo" />
                            Configuración SEO
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Meta Title</label>
                                <input
                                    type="text"
                                    value={localPage.seo.title}
                                    onChange={e => setLocalPage({ ...localPage, seo: { ...localPage.seo, title: e.target.value } })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Meta Description</label>
                                <textarea
                                    rows={3}
                                    value={localPage.seo.description}
                                    onChange={e => setLocalPage({ ...localPage, seo: { ...localPage.seo, description: e.target.value } })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <AssetPickerModal
                isOpen={isIconPickerOpen}
                onClose={() => setIsIconPickerOpen(false)}
                onSelect={handleIconSelect}
                initialTab="system"
                title="Seleccionar Ícono o Recurso"
                description="Busca un ícono del sistema o selecciona una imagen/video."
            />
            <PagePickerModal
                isOpen={isPagePickerOpen}
                onClose={() => setIsPagePickerOpen(false)}
                onSelect={handlePageLinkSelect}
                pages={allPages}
            />
        </div>
    );
};

const MenuEditor: React.FC = () => {
    const [menu, setMenu] = useState<MegaMenuItem[]>(() => db.cms.getMenu());
    const availableRoutes = db.cms.getAllAvailableRoutes();

    const handleSave = () => {
        db.cms.updateMenu(menu);
        alert('Estructura del Mega Menú guardada.');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Estructura del Mega Menú</h3>
                    <p className="text-xs text-slate-500">Gestiona los enlaces principales y sus sub-columnas.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-cafh-indigo text-white rounded-xl font-bold text-sm shadow-lg shadow-cafh-indigo/10"
                >
                    GUARDAR MENÚ
                </button>
            </div>

            <div className="space-y-6">
                {menu.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-lg text-cafh-indigo shadow-sm">
                                    <Grid size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={e => {
                                        const newMenu = [...menu];
                                        newMenu[idx].label = e.target.value;
                                        setMenu(newMenu);
                                    }}
                                    className="bg-transparent font-bold text-slate-800 outline-none border-b border-transparent focus:border-cafh-indigo"
                                />
                            </div>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {item.columns?.map((col, colIdx) => (
                                <div key={colIdx} className="space-y-4">
                                    <input
                                        type="text"
                                        value={col.title}
                                        onChange={e => {
                                            const newMenu = [...menu];
                                            newMenu[idx].columns![colIdx].title = e.target.value;
                                            setMenu(newMenu);
                                        }}
                                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest outline-none bg-transparent"
                                    />
                                    <div className="space-y-3">
                                        {col.items.map((sub, subIdx) => (
                                            <div key={subIdx} className="p-4 bg-slate-50 rounded-2xl space-y-2 group relative">
                                                <input
                                                    type="text"
                                                    value={sub.label}
                                                    onChange={e => {
                                                        const newMenu = [...menu];
                                                        newMenu[idx].columns![colIdx].items[subIdx].label = e.target.value;
                                                        setMenu(newMenu);
                                                    }}
                                                    className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none"
                                                    placeholder="Etiqueta del enlace"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={sub.path}
                                                        onChange={e => {
                                                            const newMenu = [...menu];
                                                            newMenu[idx].columns![colIdx].items[subIdx].path = e.target.value;
                                                            // Auto-label if empty
                                                            if (!sub.label || sub.label === 'Nuevo Enlace') {
                                                                const route = availableRoutes.find(r => r.path === e.target.value);
                                                                if (route) newMenu[idx].columns![colIdx].items[subIdx].label = route.label.replace('[Página] ', '');
                                                            }
                                                            setMenu(newMenu);
                                                        }}
                                                        className="flex-1 bg-white border border-slate-100 rounded-lg px-2 py-1 text-[10px] text-slate-500 outline-none"
                                                    >
                                                        <option value="">Seleccionar página...</option>
                                                        <optgroup label="Páginas del Sistema">
                                                            {availableRoutes.filter(r => !r.isDynamic).map(r => (
                                                                <option key={r.path} value={r.path}>{r.label}</option>
                                                            ))}
                                                        </optgroup>
                                                        <optgroup label="Páginas Dinámicas (CMS)">
                                                            {availableRoutes.filter(r => r.isDynamic).map(r => (
                                                                <option key={r.path} value={r.path}>{r.label}</option>
                                                            ))}
                                                        </optgroup>
                                                        <optgroup label="Personalizado">
                                                            <option value={sub.path}>Manual: {sub.path}</option>
                                                        </optgroup>
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            const newMenu = [...menu];
                                                            newMenu[idx].columns![colIdx].items = newMenu[idx].columns![colIdx].items.filter((_, i) => i !== subIdx);
                                                            setMenu(newMenu);
                                                        }}
                                                        className="p-1 text-red-400 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newMenu = [...menu];
                                                newMenu[idx].columns![colIdx].items.push({ label: 'Nuevo Enlace', path: '/', icon: 'Globe', desc: '' });
                                                setMenu(newMenu);
                                            }}
                                            className="w-full py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-1"
                                        >
                                            <Plus size={12} /> AÑADIR ENLACE
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ArticlesManager: React.FC = () => {
    const [articles, setArticles] = useState<any[]>(() => db.content.search('')); // Using existing db.content for now

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Gestión de Artículos & Blog</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-cafh-indigo text-white rounded-xl hover:bg-slate-900 transition-all shadow-sm text-sm font-bold">
                    <Plus size={18} />
                    NUEVO ARTÍCULO
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {articles.filter(a => a.type === 'Article').map(article => (
                    <div key={article.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden">
                                {article.imageUrl && <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{article.title}</h4>
                                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                                    <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {article.publishDate}</span>
                                    <span className="flex items-center gap-1"><BarChart2 size={12} /> {article.views} vistas</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-cafh-indigo hover:bg-cafh-indigo/5 rounded-xl transition-all">
                                <Edit size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



const ChangeLogTable: React.FC<{ logs: ChangeLog[] }> = ({ logs }) => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Bitácora de Control de Cambios</h3>
                    <p className="text-slate-500 text-sm">Trazabilidad completa de acciones y responsabilidades.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-500 text-xs font-bold">
                    <Shield size={14} />
                    SISTEMA AUDITADO
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuario</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sección</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acción</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha / Hora</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalles</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-cafh-indigo/10 flex items-center justify-center text-cafh-indigo font-bold text-xs">
                                            {log.userName.charAt(0)}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{log.userName}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-xs font-medium text-slate-500">{log.section}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${log.action === 'Create' ? 'bg-green-50 text-green-600' :
                                        log.action === 'Update' ? 'bg-cafh-indigo/5 text-cafh-indigo' :
                                            log.action === 'Delete' ? 'bg-red-50 text-red-600' :
                                                'bg-purple-50 text-purple-600'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700">{new Date(log.timestamp).toLocaleDateString()}</span>
                                        <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <p className="text-xs text-slate-500 line-clamp-1">{log.details}</p>
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">
                                    No hay registros de cambios aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ============================================================
// --- ANALYTICS VIEW (NUEVA VISTA) ---
// ============================================================
export const AnalyticsView: React.FC = () => {
    const contacts = useMemo(() => db.crm.getAll(), []);
    const emailLogs = useMemo(() => db.emails.getLogs(), []);
    const allContent = useMemo(() => db.content.getAll(), []);
    const emailMetrics = useMemo(() => db.emails.getMetrics(), []);
    const allMedia = useMemo(() => db.media.getAll(), []);
    const interactions = useMemo(() => db.analytics.getInteractions(), []);

    const totalContacts = contacts.length;
    const subscribed = contacts.filter(c => c.status === 'Subscribed').length;
    const opened = emailLogs.filter(l => l.status === 'Opened' || l.status === 'Clicked').length;
    const clicked = emailLogs.filter(l => l.status === 'Clicked').length;

    const funnelSteps = [
        { label: 'Total Inscritos', value: totalContacts, pct: 100, color: 'bg-cafh-indigo', textColor: 'text-cafh-indigo' },
        { label: 'Suscritos Activos', value: subscribed, pct: totalContacts > 0 ? Math.round((subscribed / totalContacts) * 100) : 0, color: 'bg-cafh-indigo/50', textColor: 'text-cafh-indigo/80' },
        { label: 'Emails Abiertos', value: opened, pct: totalContacts > 0 ? Math.round((opened / totalContacts) * 100) : 0, color: 'bg-emerald-500', textColor: 'text-emerald-500' },
        { label: 'Hicieron Clic', value: clicked, pct: totalContacts > 0 ? Math.round((clicked / totalContacts) * 100) : 0, color: 'bg-purple-500', textColor: 'text-purple-500' },
    ];

    const pieData = [
        { name: 'Suscrito', value: contacts.filter(c => c.status === 'Subscribed').length, fill: '#1A428A' },
        { name: 'Desuscrito', value: contacts.filter(c => c.status === 'Unsubscribed').length, fill: '#94a3b8' },
        { name: 'Rebotado', value: contacts.filter(c => c.status === 'Bounced').length, fill: '#f87171' },
        { name: 'Pendiente', value: contacts.filter(c => c.status === 'Pending' || c.status === 'new').length, fill: '#fbbf24' },
    ].filter(d => d.value > 0);

    const engagementBuckets = [
        { name: '0-20', count: 0, color: '#f87171' },
        { name: '21-40', count: 0, color: '#fb923c' },
        { name: '41-60', count: 0, color: '#fbbf24' },
        { name: '61-80', count: 0, color: '#34d399' },
        { name: '81-100', count: 0, color: '#1A428A' },
    ];
    contacts.forEach(c => {
        const score = c.engagementScore || 0;
        if (score <= 20) engagementBuckets[0].count++;
        else if (score <= 40) engagementBuckets[1].count++;
        else if (score <= 60) engagementBuckets[2].count++;
        else if (score <= 80) engagementBuckets[3].count++;
        else engagementBuckets[4].count++;
    });

    const campaignMap: Record<string, { sent: number; opened: number; clicked: number }> = {};
    emailLogs.forEach(l => {
        const camp = l.campaignName || 'Sin Campaña';
        if (!campaignMap[camp]) campaignMap[camp] = { sent: 0, opened: 0, clicked: 0 };
        campaignMap[camp].sent++;
        if (l.status === 'Opened' || l.status === 'Clicked') campaignMap[camp].opened++;
        if (l.status === 'Clicked') campaignMap[camp].clicked++;
    });
    const campaignData = Object.entries(campaignMap).map(([name, stats]) => ({
        name, Enviados: stats.sent, Abiertos: stats.opened,
        tasa: stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0,
    })).sort((a, b) => b.Enviados - a.Enviados);

    // Tags Populares de Intereses (Consumo de Contenido) y CRM
    const tagCount: Record<string, number> = {};
    contacts.forEach(c => c.tags?.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
    interactions.forEach(i => i.tags?.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; })); // Incluye también lo que más lee la gente
    const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 15);

    // Tabla de rendimiento que une Contenido del CMS y Biblioteca de Medios (Videos/Audios/PDFs) consumidos
    const interactionCounts: Record<string, number> = {};
    interactions.forEach(i => { interactionCounts[i.assetId] = (interactionCounts[i.assetId] || 0) + 1; });
    const contentTable = [
        ...allContent.map(c => ({ id: c.id, title: c.title, type: c.type, author: c.author, views: c.views || interactionCounts[c.id] || 0, status: c.status })),
        ...allMedia.map((m: any) => ({ id: m.id, title: m.name, type: m.type, author: 'Sist. Archivos', views: interactionCounts[m.id] || 0, status: 'Published' }))
    ].sort((a, b) => b.views - a.views).slice(0, 15);

    const emailHistoryChart = emailMetrics?.history?.map(h => ({
        date: h.date.slice(5), Enviados: h.sent, Abiertos: h.opened,
    })) || [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Analítica de Plataforma</h2>
                    <p className="text-slate-500 mt-1">Métricas calculadas en tiempo real desde CRM, Email y Contenidos.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Datos en Vivo</span>
                </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-cafh-indigo/10 rounded-xl text-cafh-indigo"><Target size={20} /></div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Embudo de Conversión</h3>
                        <p className="text-xs text-slate-400">De inscrito a acción real en emails</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {funnelSteps.map((step, i) => (
                        <div key={i} className="relative">
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <div className={`text-4xl font-extrabold ${step.textColor} mb-1`}>{step.pct}%</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{step.label}</div>
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className={`h-full ${step.color} rounded-full`} style={{ width: `${step.pct}%` }}></div>
                                </div>
                                <div className="text-xs text-slate-400 mt-2 font-mono">{step.value.toLocaleString()} personas</div>
                            </div>
                            {i < funnelSteps.length - 1 && (
                                <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-slate-300">
                                    <ChevronRight size={20} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-cafh-indigo/5 rounded-xl text-cafh-indigo"><TrendingUp size={18} /></div>
                        <div>
                            <h3 className="font-bold text-slate-800">Histórico de Envío de Emails</h3>
                            <p className="text-xs text-slate-400">Enviados vs Abiertos por fecha</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={emailHistoryChart}>
                                <defs>
                                    <linearGradient id="anCS" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1A428A" stopOpacity={0.2} /><stop offset="95%" stopColor="#1A428A" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="anCO" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)' }} />
                                <Area type="monotone" dataKey="Enviados" stroke="#1A428A" fill="url(#anCS)" strokeWidth={3} dot={false} />
                                <Area type="monotone" dataKey="Abiertos" stroke="#10b981" fill="url(#anCO)" strokeWidth={3} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600"><Percent size={18} /></div>
                        <div>
                            <h3 className="font-bold text-slate-800">Estado de Contactos</h3>
                            <p className="text-xs text-slate-400">Distribución por estado</p>
                        </div>
                    </div>
                    <div className="h-48 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                                    {pieData.map((entry, index) => (<Cell key={`cell-an-${index}`} fill={entry.fill} />))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px -3px rgb(0 0 0 / 0.15)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {pieData.map(d => (
                            <div key={d.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: d.fill }}></div>
                                <span className="text-xs text-slate-600 font-medium truncate">{d.name}</span>
                                <span className="text-xs font-bold text-slate-800 ml-auto">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Campaign Performance & Engagement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-7 py-5 border-b border-slate-50 flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600"><Mail size={18} /></div>
                        <div>
                            <h3 className="font-bold text-slate-800">Rendimiento por Campaña</h3>
                            <p className="text-xs text-slate-400">Desempeño de cada nombre de campaña</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50/60 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaña</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enviados</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Abiertos</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {campaignData.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-xs">Sin campañas registradas.</td></tr>
                                ) : campaignData.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 font-bold text-slate-700 truncate max-w-[140px]">{row.name}</td>
                                        <td className="px-4 py-3 text-right text-slate-600 font-mono">{row.Enviados}</td>
                                        <td className="px-4 py-3 text-right text-emerald-600 font-mono font-bold">{row.Abiertos}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${row.tasa >= 40 ? 'bg-emerald-50 text-emerald-700' : row.tasa >= 20 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
                                                {row.tasa}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600"><Activity size={18} /></div>
                        <div>
                            <h3 className="font-bold text-slate-800">Distribución Engagement</h3>
                            <p className="text-xs text-slate-400">Rango de puntaje de compromiso de contactos</p>
                        </div>
                    </div>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={engagementBuckets}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)' }} />
                                <Bar dataKey="count" name="Contactos" radius={[8, 8, 0, 0]}>
                                    {engagementBuckets.map((entry, index) => (<Cell key={`eng-${index}`} fill={entry.color} />))}
                                </Bar>
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Content Performance Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-7 py-5 border-b border-slate-50 flex items-center gap-3">
                    <div className="p-2.5 bg-cafh-indigo/5 rounded-xl text-cafh-indigo"><Eye size={18} /></div>
                    <div>
                        <h3 className="font-bold text-slate-800">Rendimiento de Contenidos</h3>
                        <p className="text-xs text-slate-400">Artículos, recursos y páginas por número de vistas</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/60 border-b border-slate-100">
                            <tr>
                                <th className="px-7 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">#</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Título</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Autor</th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vistas</th>
                                <th className="px-7 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {contentTable.length === 0 ? (
                                <tr><td colSpan={6} className="px-7 py-12 text-center text-slate-400 text-xs italic">Sin contenidos registrados.</td></tr>
                            ) : contentTable.map((item, i) => {
                                const maxV = contentTable[0]?.views || 1;
                                const pct = Math.round(((item.views || 0) / maxV) * 100);
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-7 py-4 text-xs font-bold text-slate-400">#{i + 1}</td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                                            <div className="w-32 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                                <div className="h-full bg-cafh-indigo/50 rounded-full" style={{ width: `${pct}%` }}></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${item.type === 'Article' ? 'bg-cafh-indigo/5 text-cafh-indigo' : (item.type === 'video' || item.type === 'audio') ? 'bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-slate-600 to-indigo-200 text-transparent bg-clip-text font-black' : (item.type === 'Resource' || item.type === 'document') ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'}`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-slate-500">{item.author}</td>
                                        <td className="px-4 py-4 text-right font-mono font-bold text-slate-700">{(item.views || 0).toLocaleString()}</td>
                                        <td className="px-7 py-4 text-right">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${item.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tags Cloud */}
            <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-cafh-indigo"><Hash size={18} /></div>
                    <div>
                        <h3 className="font-bold text-slate-800">Etiquetas Populares (CRM)</h3>
                        <p className="text-xs text-slate-400">Tags más utilizados en tus contactos</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    {topTags.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Sin etiquetas registradas.</p>
                    ) : topTags.map(([tag, count]) => (
                        <span key={tag} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-cafh-indigo hover:text-white hover:border-cafh-indigo transition-all cursor-default">
                            {tag}
                            <span className="text-xs bg-cafh-indigo/10 text-cafh-indigo px-1.5 py-0.5 rounded-full font-mono">{count}</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

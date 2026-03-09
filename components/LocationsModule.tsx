import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Search, Filter, Globe, MapPin, Phone, Mail, MoreVertical,
    Trash2, Edit3, X, Save, MessageSquare, ChevronRight, Map,
    AlertCircle, CheckCircle2, Info, ExternalLink
} from 'lucide-react';
import { db } from '../storage';
import { GlobalLocation, LocationContact } from '../types';

export const LocationsAdminView: React.FC = () => {
    const [locations, setLocations] = useState<GlobalLocation[]>([]);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingLoc, setEditingLoc] = useState<Partial<GlobalLocation> | null>(null);
    const [search, setSearch] = useState('');
    const [continentFilter, setContinentFilter] = useState('All');
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadLocations();
    }, []);

    const loadLocations = () => {
        setLocations(db.locations.getAll());
    };

    const handleSave = () => {
        if (!editingLoc?.name || !editingLoc?.country || !editingLoc?.city) {
            setStatusMsg({ type: 'error', text: 'Nombre, País y Ciudad son requeridos.' });
            return;
        }

        const finalLoc: GlobalLocation = {
            id: editingLoc.id || `loc_${Date.now()}`,
            name: editingLoc.name || '',
            address: editingLoc.address || '',
            continent: editingLoc.continent || 'América',
            country: editingLoc.country || '',
            region: editingLoc.region || '',
            city: editingLoc.city || '',
            comuna: editingLoc.comuna || '',
            imageUrl: editingLoc.imageUrl || '',
            mapX: editingLoc.mapX || 50,
            mapY: editingLoc.mapY || 50,
            contacts: editingLoc.contacts || [],
            tenantId: editingLoc.tenantId || 't_global',
            status: editingLoc.status || 'Active'
        };

        if (editingLoc.id) {
            db.locations.update(editingLoc.id, finalLoc);
        } else {
            db.locations.add(finalLoc);
        }

        setStatusMsg({ type: 'success', text: `Sede "${finalLoc.name}" guardada con éxito.` });
        setIsEditorOpen(false);
        setEditingLoc(null);
        loadLocations();
        setTimeout(() => setStatusMsg(null), 3000);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta sede?')) {
            db.locations.delete(id);
            loadLocations();
        }
    };

    const filteredLocations = locations.filter(loc => {
        const matchesSearch = loc.name.toLowerCase().includes(search.toLowerCase()) ||
            loc.city.toLowerCase().includes(search.toLowerCase());
        const matchesContinent = continentFilter === 'All' || loc.continent === continentFilter;
        return matchesSearch && matchesContinent;
    });

    const continents = ['All', 'América', 'Europa', 'África', 'Asia', 'Oceanía'];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-800 flex items-center gap-3">
                        <Globe className="text-cafh-indigo" size={32} />
                        Gestión de Sedes Globales
                    </h2>
                    <p className="text-slate-500 mt-1">Administra los puntos de presencia mundial y sus datos de contacto.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingLoc({
                            continent: 'América',
                            mapX: 50,
                            mapY: 50,
                            contacts: [],
                            status: 'Active'
                        });
                        setIsEditorOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-cafh-indigo text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-cafh-indigo/20 transform hover:-translate-y-1"
                >
                    <Plus size={20} />
                    Añadir Nueva Sede
                </button>
            </div>

            {statusMsg && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold">{statusMsg.text}</span>
                </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cafh-indigo transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o ciudad..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-cafh-indigo/5 focus:border-cafh-indigo transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {continents.map(c => (
                        <button
                            key={c}
                            onClick={() => setContinentFilter(c)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${continentFilter === c
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Locations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc) => (
                        <div key={loc.id} className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col">
                            {/* Accent Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cafh-cyan/10 transition-colors"></div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-cafh-indigo/10 group-hover:text-cafh-indigo transition-all duration-300">
                                    <MapPin size={24} />
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => { setEditingLoc(loc); setIsEditorOpen(true); }}
                                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-cafh-indigo transition-colors"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(loc.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10 space-y-4 flex-1">
                                <div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cafh-cyan mb-1">
                                        <Globe size={10} />
                                        {loc.continent} / {loc.country}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-cafh-indigo transition-colors">{loc.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{loc.city}, {loc.region || loc.country}</p>
                                </div>

                                <div className="pt-4 border-t border-slate-50 space-y-2">
                                    {loc.contacts.slice(0, 2).map((c, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs text-slate-500 py-1">
                                            {c.type === 'whatsapp' ? <MessageSquare size={14} className="text-green-500" /> :
                                                c.type === 'phone' ? <Phone size={14} className="text-blue-500" /> :
                                                    c.type === 'email' ? <Mail size={14} className="text-indigo-400" /> :
                                                        <ExternalLink size={14} className="text-cafh-cyan" />}
                                            <span className="font-medium truncate">{c.label}: {c.value}</span>
                                        </div>
                                    ))}
                                    {loc.contacts.length > 2 && (
                                        <p className="text-[10px] font-bold text-slate-400 pl-6">+{loc.contacts.length - 2} contactos más</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
                                <span>ID: {loc.id}</span>
                                <span className={loc.status === 'Active' ? 'text-green-500' : 'text-slate-300'}>● {loc.status}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                            <Map size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">No se encontraron sedes</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2">Prueba cambiando los filtros o ajustando tu búsqueda.</p>
                        <button
                            onClick={() => { setContinentFilter('All'); setSearch(''); }}
                            className="mt-6 text-cafh-indigo font-bold hover:underline"
                        >
                            Limpiar todos los filtros
                        </button>
                    </div>
                )}
            </div>

            {/* LOCATION EDITOR SIDE-PANEL */}
            {isEditorOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsEditorOpen(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white shadow-2xl h-screen overflow-y-auto animate-in slide-in-from-right duration-500">
                        {/* Drawer Header */}
                        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100 p-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">{editingLoc?.id ? 'Editar Sede' : 'Nueva Sede'}</h3>
                                <p className="text-slate-500 text-sm">{editingLoc?.name || 'Configura la ubicación global'}</p>
                            </div>
                            <button onClick={() => setIsEditorOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:rotate-90 transition-all duration-300">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="p-8 space-y-8 pb-32">
                            {/* GEOGRAPHIC SECTION */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-cafh-indigo">
                                    <div className="w-8 h-8 rounded-lg bg-cafh-indigo/10 flex items-center justify-center"><Globe size={14} /></div>
                                    Ubicación Geográfica
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Nombre de la Sede</label>
                                        <input
                                            value={editingLoc?.name || ''}
                                            onChange={e => setEditingLoc({ ...editingLoc!, name: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cafh-indigo/20 outline-none"
                                            placeholder="Ej: Centro Cafh Santiago"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Continente</label>
                                        <select
                                            value={editingLoc?.continent || 'América'}
                                            onChange={e => setEditingLoc({ ...editingLoc!, continent: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                        >
                                            {continents.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 ml-1">País</label>
                                        <input
                                            value={editingLoc?.country || ''}
                                            onChange={e => setEditingLoc({ ...editingLoc!, country: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                            placeholder="Ej: Chile"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Ciudad</label>
                                        <input
                                            value={editingLoc?.city || ''}
                                            onChange={e => setEditingLoc({ ...editingLoc!, city: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                            placeholder="Ej: Santiago"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Dirección Completa</label>
                                    <input
                                        value={editingLoc?.address || ''}
                                        onChange={e => setEditingLoc({ ...editingLoc!, address: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                        placeholder="Calle, Número, Oficina..."
                                    />
                                </div>
                            </section>

                            {/* MAP SELECTOR TOOL */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-cafh-indigo">
                                    <div className="w-8 h-8 rounded-lg bg-cafh-indigo/10 flex items-center justify-center"><Map size={14} /></div>
                                    Posicionamiento en Mapa Mundi
                                </div>
                                <div className="bg-slate-900 rounded-3xl p-2 relative overflow-hidden group">
                                    <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-[10px] text-white/70 font-bold pointer-events-none">
                                        Haz click para situar el PIN
                                    </div>
                                    <div className="relative aspect-video bg-indigo-950 rounded-2xl overflow-hidden cursor-crosshair"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const x = ((e.clientX - rect.left) / rect.width) * 100;
                                            const y = ((e.clientY - rect.top) / rect.height) * 100;
                                            setEditingLoc({ ...editingLoc!, mapX: x, mapY: y });
                                        }}
                                    >
                                        <img
                                            src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2000&auto=format&fit=crop"
                                            className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                                            alt="World Map"
                                        />
                                        {/* PIN indicator */}
                                        <div
                                            className="absolute w-6 h-6 -ml-3 -mt-6 pointer-events-none flex items-center justify-center animate-bounce transition-all duration-300"
                                            style={{ left: `${editingLoc?.mapX}%`, top: `${editingLoc?.mapY}%` }}
                                        >
                                            <div className="absolute inset-0 bg-cafh-cyan rounded-full animate-ping opacity-50"></div>
                                            <MapPin className="text-white fill-cafh-cyan" size={24} />
                                        </div>

                                        {/* GRID Visualizer */}
                                        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-10">
                                            {[...Array(72)].map((_, i) => <div key={i} className="border border-white/20"></div>)}
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-4 px-2 text-[10px] text-slate-500 font-mono">
                                        <span>Coords: X: {editingLoc?.mapX?.toFixed(1)}%</span>
                                        <span>Y: {editingLoc?.mapY?.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </section>

                            {/* CONTACTS MANAGEMENT */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-cafh-indigo">
                                    <div className="w-8 h-8 rounded-lg bg-cafh-indigo/10 flex items-center justify-center"><MessageSquare size={14} /></div>
                                    Botones de Contacto Directo
                                </div>
                                <div className="space-y-4">
                                    {(editingLoc?.contacts || []).map((contact, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                            <select
                                                value={contact.type}
                                                onChange={e => {
                                                    const newContacts = [...(editingLoc?.contacts || [])];
                                                    newContacts[idx].type = e.target.value as any;
                                                    setEditingLoc({ ...editingLoc!, contacts: newContacts });
                                                }}
                                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
                                            >
                                                <option value="whatsapp">WhatsApp</option>
                                                <option value="phone">Teléfono</option>
                                                <option value="email">Email</option>
                                                <option value="website">Sitio Web</option>
                                            </select>
                                            <input
                                                placeholder="Etiqueta (ej: Secretaría)"
                                                value={contact.label}
                                                onChange={e => {
                                                    const newContacts = [...(editingLoc?.contacts || [])];
                                                    newContacts[idx].label = e.target.value;
                                                    setEditingLoc({ ...editingLoc!, contacts: newContacts });
                                                }}
                                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
                                            />
                                            <input
                                                placeholder="Número o email"
                                                value={contact.value}
                                                onChange={e => {
                                                    const newContacts = [...(editingLoc?.contacts || [])];
                                                    newContacts[idx].value = e.target.value;
                                                    setEditingLoc({ ...editingLoc!, contacts: newContacts });
                                                }}
                                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newContacts = (editingLoc?.contacts || []).filter((_, i) => i !== idx);
                                                    setEditingLoc({ ...editingLoc!, contacts: newContacts });
                                                }}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const newContacts = [...(editingLoc?.contacts || []), { type: 'whatsapp', label: '', value: '' }];
                                            setEditingLoc({ ...editingLoc!, contacts: newContacts as LocationContact[] });
                                        }}
                                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 hover:border-cafh-indigo hover:text-cafh-indigo transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Agregar Medio de Contacto
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Footer Actions */}
                        <div className="fixed bottom-0 w-full max-w-2xl bg-white border-t border-slate-100 p-8 flex gap-4 z-30">
                            <button
                                onClick={() => setIsEditorOpen(false)}
                                className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-[2] px-8 py-4 bg-cafh-indigo text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-cafh-indigo/20 flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                Guardar Sede
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

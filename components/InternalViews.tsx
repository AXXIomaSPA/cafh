import React, { useState, useEffect } from 'react';
import {
    Compass, Anchor, Users, Map, Heart, Sparkles, Cloud, Book, BookOpen, Video,
    Feather, MessageCircle, Calendar, Sun, Coffee, Search, Filter, ArrowRight,
    Play, Download, MapPin, Clock, ChevronRight, X
} from 'lucide-react';
import { db } from '../storage';
import { ContentItem, CalendarEvent } from '../types';

// --- SHARED INTERNAL LAYOUT ---
const InternalHeader: React.FC<{ title: string; subtitle: string; icon: any; bgImage: string }> = ({ title, subtitle, icon: Icon, bgImage }) => (
    <div className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-6 overflow-hidden rounded-b-[3rem] shadow-xl">
        {/* Background */}
        <div className="absolute inset-0 z-0">
            <img src={bgImage} alt={title} className="w-full h-full object-cover opacity-30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-cafh-indigo via-cafh-indigo/80 to-slate-50"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-cafh-cyan rounded-full blur-[100px] opacity-20 animate-float"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cafh-cyan font-bold text-sm mb-6 animate-fade-in-up">
                <Icon size={16} />
                <span>Sección Oficial</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{title}</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{subtitle}</p>
        </div>
    </div>
);

// --- ABOUT VIEW ---
export const AboutView: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <InternalHeader
                title="Quiénes Somos"
                subtitle="Una comunidad global dedicada al desenvolvimiento espiritual y al servicio de la humanidad."
                icon={Users}
                bgImage="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop"
            />

            <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-24">

                {/* Section 1: History & Identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-cafh-cyan rounded-[2rem] rotate-3 opacity-20 transform translate-x-4 translate-y-4"></div>
                        <img
                            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop"
                            alt="Historia"
                            className="relative z-10 rounded-[2rem] shadow-xl w-full object-cover h-[400px]"
                        />
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-cafh-indigo font-bold uppercase tracking-widest text-sm">
                            <Compass size={20} />
                            <span>Nuestra Historia</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-800">Un legado de sabiduría viva</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Fundada hace más de 80 años, Cafh nació como una respuesta a la necesidad humana de encontrar un sentido trascendente. A lo largo de las décadas, hemos evolucionado manteniendo intacta nuestra esencia: el método de vida.
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                <span className="block text-3xl font-bold text-cafh-cyan mb-1">1937</span>
                                <span className="text-sm text-slate-500 font-medium">Año de Fundación</span>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                <span className="block text-3xl font-bold text-cafh-cyan mb-1">20+</span>
                                <span className="text-sm text-slate-500 font-medium">Países con presencia</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Mission */}
                <div className="bg-cafh-indigo text-white rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cafh-lavender rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <Anchor size={48} className="mx-auto text-cafh-cyan mb-6" />
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Nuestra Misión</h2>
                        <p className="text-xl md:text-2xl font-light text-blue-100 leading-relaxed">
                            "Fomentar el desenvolvimiento espiritual de sus miembros para que, a través de su propio trabajo interior, contribuyan al bien de la sociedad y del mundo entero."
                        </p>
                    </div>
                </div>

                {/* Section 3: Global Presence */}
                <div>
                    <div className="text-center mb-12">
                        <span className="text-cafh-clay font-bold tracking-widest text-sm uppercase bg-cafh-clay/10 px-3 py-1 rounded-full">Global</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800 mt-4">Nuestra Presencia</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['América', 'Europa', 'Medio Oriente'].map((region, i) => (
                            <div key={i} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:bg-slate-50 transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-cafh-light rounded-full flex items-center justify-center text-cafh-indigo mb-6 group-hover:scale-110 transition-transform">
                                    <Map size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{region}</h3>
                                <p className="text-slate-500 text-sm mb-4">Sedes activas y grupos de estudio presenciales.</p>
                                <span className="text-cafh-cyan font-bold text-sm flex items-center gap-2">Ver ubicaciones <ArrowRight size={16} /></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- METHOD VIEW ---
export const MethodView: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <InternalHeader
                title="El Método"
                subtitle="Un camino práctico para integrar la espiritualidad en la vida cotidiana."
                icon={Sparkles}
                bgImage="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop"
            />

            <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Pilar 1: Vida Interior */}
                    <div className="group">
                        <div className="relative mb-8 overflow-hidden rounded-[2.5rem]">
                            <div className="absolute inset-0 bg-cafh-indigo/20 group-hover:bg-transparent transition-colors z-10"></div>
                            <img src="https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=800&auto=format&fit=crop" alt="Vida Interior" className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur px-6 py-3 rounded-full flex items-center gap-3">
                                <Heart className="text-cafh-clay" />
                                <span className="font-bold text-slate-800">Vida Interior</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">El cultivo del ser</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            La vida interior no es aislarse, es encontrar un centro de paz y estabilidad dentro de uno mismo, desde el cual interactuamos con el mundo de manera más consciente y amorosa.
                        </p>
                        <ul className="space-y-3">
                            {['Auto-observación', 'Dominio emocional', 'Intención pura'].map(item => (
                                <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-cafh-light flex items-center justify-center text-cafh-cyan"><ChevronRight size={14} /></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pilar 2: Mística */}
                    <div className="group">
                        <div className="relative mb-8 overflow-hidden rounded-[2.5rem]">
                            <div className="absolute inset-0 bg-cafh-indigo/20 group-hover:bg-transparent transition-colors z-10"></div>
                            <img src="https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=800&auto=format&fit=crop" alt="Mística" className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur px-6 py-3 rounded-full flex items-center gap-3">
                                <Sparkles className="text-cafh-cyan" />
                                <span className="font-bold text-slate-800">Mística del Corazón</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">Conexión profunda</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            La mística en Cafh es la experiencia directa de la unión con la vida. A través del amor, trascendemos nuestras limitaciones individuales y participamos de una realidad mayor.
                        </p>
                        <ul className="space-y-3">
                            {['Amor a la humanidad', 'Sentido de trascendencia', 'Unión sustancial'].map(item => (
                                <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-cafh-light flex items-center justify-center text-cafh-cyan"><ChevronRight size={14} /></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Practices Banner */}
                <div className="mt-24 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <span className="text-cafh-indigo font-bold tracking-widest text-sm uppercase block mb-2">Herramientas Prácticas</span>
                        <h3 className="text-3xl font-display font-bold text-slate-800">Meditación Discursiva</h3>
                        <p className="text-slate-600 mt-4 max-w-xl">
                            Nuestro método principal de meditación. No solo busca calmar la mente, sino transformar la conducta a través de la reflexión profunda sobre temas universales.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-cafh-indigo text-white rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-cafh-indigo/20">
                            Aprender a Meditar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- RESOURCES VIEW ---
export const ResourcesView: React.FC = () => {
    const [filter, setFilter] = useState('Todos');
    const [resourcesContent, setResourcesContent] = useState<any[]>([]);
    const [selectedResource, setSelectedResource] = useState<any | null>(null);

    useEffect(() => {
        const contents = db.content.getAll().map(c => ({
            id: `c_${c.id}`, originalId: c.id, title: c.title, type: c.type, tags: c.tags, date: c.publishDate, url: c.imageUrl, source: 'content'
        }));
        const medias = db.media.getAll()
            .filter(m => ['document', 'video', 'audio'].includes(m.type))
            .map((m: any) => ({
                id: `m_${m.id}`, originalId: m.id, title: m.name, type: m.type, tags: m.tags || [], date: m.uploadedAt, url: m.url, source: 'media'
            }));
        setResourcesContent([...contents, ...medias].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, []);

    const filteredContent = filter === 'Todos'
        ? resourcesContent
        : resourcesContent.filter(c => {
            if (filter === 'Article') return c.type === 'Article';
            if (filter === 'Resource') return c.type === 'document' || c.type === 'Resource';
            if (filter === 'Video') return c.type === 'video' || c.type === 'Event'; // Mapped loosely
            if (filter === 'Audio') return c.type === 'audio';
            return true;
        });

    const handleResourceClick = (res: any) => {
        db.analytics.trackConsumption({
            assetId: res.originalId,
            assetName: res.title,
            assetType: res.type,
            tags: res.tags
        });
        setSelectedResource(res);
    };

    return (
        <div className="min-h-screen bg-slate-50">
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
            <InternalHeader
                title="Biblioteca de Recursos"
                subtitle="Explora documentos, videos y audios para nutrir tu camino."
                icon={BookOpen}
                bgImage="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2000&auto=format&fit=crop"
            />

            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                        {['Todos', 'Article', 'Resource', 'Video', 'Audio'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${filter === type
                                        ? 'bg-cafh-indigo text-white shadow-md'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {type === 'Todos' ? 'Todos' : type === 'Article' ? 'Artículos' : type === 'Resource' ? 'Descargas/PDF' : type === 'Video' ? 'Videos' : 'Audios'}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar en la biblioteca..."
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:border-cafh-cyan transition-colors"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContent.map(item => (
                        <div key={item.id} onClick={() => handleResourceClick(item)} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${item.type === 'Article' ? 'bg-blue-50 text-blue-600' :
                                        (item.type === 'Resource' || item.type === 'document') ? 'bg-green-50 text-green-600' :
                                            item.type === 'audio' ? 'bg-purple-50 text-purple-600' :
                                                'bg-red-50 text-red-600'
                                    }`}>
                                    {item.type === 'Article' ? <Feather size={24} /> : (item.type === 'Resource' || item.type === 'document') ? <Download size={24} /> : item.type === 'audio' ? <Play size={24} /> : <Video size={24} />}
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded">{item.type}</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-cafh-indigo transition-colors flex-1">
                                {item.title}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">#{tag}</span>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-400">
                                <span>{item.date}</span>
                                <span className="flex items-center gap-1 group-hover:text-cafh-cyan transition-colors font-bold text-cafh-indigo">Abrir <ArrowRight size={14} /></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- ACTIVITIES VIEW ---
export const ActivitiesView: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        setEvents(db.events.getAll());
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <InternalHeader
                title="Actividades y Retiros"
                subtitle="Participa de nuestros encuentros. Espacios diseñados para el aprendizaje y la vivencia espiritual."
                icon={Calendar}
                bgImage="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=2000&auto=format&fit=crop"
            />

            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Upcoming Highlights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    <div className="lg:col-span-1 bg-cafh-indigo text-white rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-cafh-cyan rounded-full blur-[80px] opacity-20"></div>
                        <h3 className="text-2xl font-bold mb-4 relative z-10">¿Buscas un retiro?</h3>
                        <p className="text-blue-200 mb-8 relative z-10">Desconecta del ruido y reconecta contigo mismo en nuestros centros de retiro en la naturaleza.</p>
                        <button className="bg-white text-cafh-indigo px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors w-fit relative z-10">
                            Ver opciones de Retiro
                        </button>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {events.slice(0, 2).map((event) => (
                            <div key={event.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
                                {event.meetingUrl && (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                        Virtual
                                    </div>
                                )}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl ${event.color} flex flex-col items-center justify-center text-white font-bold leading-none`}>
                                        <span className="text-xl">{event.day}</span>
                                        <span className="text-[10px] tracking-widest uppercase">{event.month}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{event.type}</span>
                                        <h4 className="font-bold text-slate-800 leading-tight group-hover:text-cafh-indigo transition-colors">{event.title}</h4>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-slate-500">
                                    <div className="flex items-center gap-2"><Clock size={16} className="text-cafh-turquoise" /> {event.time}</div>
                                    <div className="flex items-center gap-2"><MapPin size={16} className="text-cafh-turquoise" /> {event.location}</div>
                                </div>
                                {event.meetingUrl && (
                                    <a
                                        href={event.meetingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center gap-2 text-green-600 font-bold text-sm hover:underline"
                                    >
                                        <Video size={16} /> Unirse Online
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Full Calendar List */}
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-display font-bold text-slate-800">Calendario Completo</h2>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-full border border-slate-200 hover:bg-slate-50"><Filter size={20} /></button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-slate-50 hover:bg-slate-50 hover:border-slate-200 transition-all group">
                                <div className="flex items-start md:items-center gap-6 mb-4 md:mb-0">
                                    <div className={`w-16 h-16 rounded-2xl ${event.color} flex flex-col items-center justify-center text-white font-bold leading-none shrink-0`}>
                                        <span className="text-2xl">{event.day}</span>
                                        <span className="text-xs tracking-widest uppercase">{event.month}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-cafh-indigo transition-colors flex items-center gap-2">
                                            {event.title}
                                            {event.meetingUrl && <Video size={16} className="text-green-500" />}
                                        </h4>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1"><Clock size={14} /> {event.time}</span>
                                            <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                                            <span className="bg-white border border-slate-200 px-2 rounded-full text-xs font-bold">{event.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {event.meetingUrl ? (
                                        <a
                                            href={event.meetingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-all flex items-center gap-2"
                                        >
                                            <Video size={16} /> Unirse
                                        </a>
                                    ) : (
                                        <button className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm group-hover:bg-cafh-indigo group-hover:text-white transition-all">
                                            Inscribirme
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
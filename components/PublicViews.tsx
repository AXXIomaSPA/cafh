import React, { useState, useEffect, useRef } from 'react';
import * as Lucide from 'lucide-react';
import { Play, ArrowRight, Heart, Users, BookOpen, MapPin, Mail, ChevronRight, Flower2, Sparkles, Wind, Sun, X, Loader2, Check, Calendar, Mic, FileText, User, Headphones, Activity, Clock, Lock, ArrowLeft, AlertCircle, ChevronLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_WIZARD_STEPS, MOCK_EVENTS } from '../constants';
import { db } from '../storage';
import { UserRole, HeroConfig, BlogPost, BlogConfig, HomeConfig, CustomPage, PageSection, WizardQuestion, ProfileType, UserWizardProfile } from '../types';
import Markdown from 'react-markdown';

// --- DYNAMIC PAGE VIEW ---

import { ContentItem, CalendarEvent } from '../types';

// --- DYNAMIC PREDEFINED BLOCKS ---
const DynamicResourcesGrid: React.FC<any> = ({ bgClass, paddingClass, containerClass }) => {
    const [filter, setFilter] = useState('Todos');
    const [resourcesContent, setResourcesContent] = useState<ContentItem[]>([]);

    useEffect(() => {
        setResourcesContent(db.content.getAll());
    }, []);

    const filteredContent = filter === 'Todos' ? resourcesContent : resourcesContent.filter(c => c.type === filter);

    return (
        <section className={`${bgClass} ${paddingClass}`}>
            <div className={`${containerClass} mx-auto px-6`}>
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                        {['Todos', 'Article', 'Resource', 'Video'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${filter === type
                                        ? 'bg-cafh-indigo text-white shadow-md'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {type === 'Todos' ? 'Todos' : type === 'Article' ? 'Artículos' : type === 'Resource' ? 'Descargables' : 'Videos'}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Lucide.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar en la biblioteca..."
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:border-cafh-cyan transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContent.map(item => (
                        <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${item.type === 'Article' ? 'bg-blue-50 text-blue-600' :
                                        item.type === 'Resource' ? 'bg-green-50 text-green-600' :
                                            'bg-red-50 text-red-600'
                                    }`}>
                                    {item.type === 'Article' ? <Lucide.Feather size={24} /> : item.type === 'Resource' ? <Lucide.Download size={24} /> : <Lucide.Play size={24} />}
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded">{item.type}</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-cafh-indigo transition-colors flex-1">
                                {item.title}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {item.tags.map((tag: string) => (
                                    <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">#{tag}</span>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-400">
                                <span>{item.publishDate}</span>
                                <span className="flex items-center gap-1 group-hover:text-cafh-cyan transition-colors font-bold text-cafh-indigo">Ver recurso <Lucide.ArrowRight size={14} /></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const DynamicEventsCalendar: React.FC<any> = ({ bgClass, paddingClass, containerClass }) => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        setEvents(db.events.getAll());
    }, []);

    return (
        <section className={`${bgClass} ${paddingClass} pb-0`}>
            <div className={`${containerClass} mx-auto px-6`}>
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
                                    <div className="flex items-center gap-2"><Lucide.Clock size={16} className="text-cafh-cyan" /> {event.time}</div>
                                    <div className="flex items-center gap-2"><Lucide.MapPin size={16} className="text-cafh-cyan" /> {event.location}</div>
                                </div>
                                {event.meetingUrl && (
                                    <a
                                        href={event.meetingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center gap-2 text-green-600 font-bold text-sm hover:underline"
                                    >
                                        <Lucide.Video size={16} /> Unirse Online
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-display font-bold text-slate-800">Calendario Completo</h2>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-full border border-slate-200 hover:bg-slate-50"><Lucide.Filter size={20} /></button>
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
                                            {event.meetingUrl && <Lucide.Video size={16} className="text-green-500" />}
                                        </h4>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1"><Lucide.Clock size={14} /> {event.time}</span>
                                            <span className="flex items-center gap-1"><Lucide.MapPin size={14} /> {event.location}</span>
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
                                            <Lucide.Video size={16} /> Unirse
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
        </section>
    );
};

const DynamicTimeline: React.FC<any> = ({ bgClass, paddingClass, containerClass }) => (
    <section className={`${bgClass} ${paddingClass}`}>
        <div className={`${containerClass} mx-auto px-6`}>
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
                        <Lucide.Compass size={20} />
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
        </div>
    </section>
);

const DynamicMethodPillars: React.FC<any> = ({ bgClass, paddingClass, containerClass }) => (
    <section className={`${bgClass} ${paddingClass}`}>
        <div className={`${containerClass} mx-auto px-6`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Pilar 1: Vida Interior */}
                <div className="group">
                    <div className="relative mb-8 overflow-hidden rounded-[2.5rem]">
                        <div className="absolute inset-0 bg-cafh-indigo/20 group-hover:bg-transparent transition-colors z-10"></div>
                        <img src="https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=800&auto=format&fit=crop" alt="Vida Interior" className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur px-6 py-3 rounded-full flex items-center gap-3">
                            <Lucide.Heart className="text-cafh-clay" />
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
                                <div className="w-6 h-6 rounded-full bg-cafh-light flex items-center justify-center text-cafh-cyan"><Lucide.ChevronRight size={14} /></div>
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
                            <Lucide.Sparkles className="text-cafh-cyan" />
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
                                <div className="w-6 h-6 rounded-full bg-cafh-light flex items-center justify-center text-cafh-cyan"><Lucide.ChevronRight size={14} /></div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </section>
);
// --- END DYNAMIC PREDEFINED BLOCKS ---

export const DynamicPageView: React.FC<{ slug: string }> = ({ slug }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState<CustomPage | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const p = db.cms.getPageBySlug(slug);
        setPage(p);
        setIsLoading(false);
        window.scrollTo(0, 0);
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-cafh-blue" size={40} />
            </div>
        );
    }

    if (!page || page.status !== 'Published') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-[2rem] flex items-center justify-center text-slate-400 mb-8">
                    <AlertCircle size={48} />
                </div>
                <h1 className="text-4xl font-display font-bold text-slate-800 mb-4">Página no encontrada</h1>
                <p className="text-slate-500 mb-8 max-w-md">Lo sentimos, la página que buscas no existe o no está disponible en este momento.</p>
                <button onClick={() => navigate('/')} className="px-8 py-4 bg-cafh-indigo text-white rounded-2xl font-bold shadow-lg shadow-cafh-indigo/20 hover:scale-105 transition-all">
                    Volver al Inicio
                </button>
            </div>
        );
    }

    const renderPageSection = (section: PageSection) => {
        const { type, content, settings } = section;
        const bgClass = settings?.backgroundColor || 'bg-white';
        const paddingClass = settings?.padding === 'small' ? 'py-10' : settings?.padding === 'large' ? 'py-32' : 'py-20';
        const containerClass = settings?.containerSize === 'narrow' ? 'max-w-3xl' : settings?.containerSize === 'full' ? 'max-w-none px-0' : 'max-w-7xl';

        switch (type) {
            case 'Hero':
                return (
                    <section key={section.id} className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <img src={content.imageUrl} alt={content.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-r from-cafh-indigo/90 to-transparent"></div>
                        </div>
                        <div className="max-w-7xl mx-auto px-6 relative z-10 text-white">
                            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-fade-in-up">{content.title}</h1>
                            {content.subtitle && <p className="text-xl md:text-2xl text-white/80 max-w-2xl mb-10 animate-fade-in-up delay-100">{content.subtitle}</p>}
                            {content.ctaText && (
                                <button onClick={() => navigate(content.ctaLink)} className="px-8 py-4 bg-cafh-cyan text-cafh-indigo rounded-2xl font-bold hover:bg-white transition-all animate-fade-in-up delay-200">
                                    {content.ctaText}
                                </button>
                            )}
                        </div>
                    </section>
                );
            case 'Text':
                return (
                    <section key={section.id} className={`${bgClass} ${paddingClass}`}>
                        <div className={`${containerClass} mx-auto px-6`}>
                            <div className="markdown-body prose prose-slate prose-lg max-w-none">
                                <Markdown>{content.text}</Markdown>
                            </div>
                        </div>
                    </section>
                );
            case 'Image':
                return (
                    <section key={section.id} className={`${bgClass} ${paddingClass}`}>
                        <div className={`${containerClass} mx-auto px-6`}>
                            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <img src={content.imageUrl} alt={content.caption} className="w-full h-auto" referrerPolicy="no-referrer" />
                            </div>
                            {content.caption && <p className="text-center text-slate-400 mt-6 text-sm italic">{content.caption}</p>}
                        </div>
                    </section>
                );
            case 'Stats':
                return (
                    <section key={section.id} className={`${bgClass} ${paddingClass}`}>
                        <div className={`${containerClass} mx-auto px-6`}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {content.items.map((item: any, i: number) => {
                                    const Icon = (Lucide as any)[item.icon] || Lucide.Activity;
                                    return (
                                        <div key={i} className="text-center space-y-3">
                                            <div className="w-16 h-16 bg-cafh-light rounded-2xl flex items-center justify-center text-cafh-indigo mx-auto shadow-sm">
                                                <Icon size={32} strokeWidth={1.5} />
                                            </div>
                                            <div className="text-4xl font-display font-bold text-slate-800">{item.value}</div>
                                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                );
            case 'Cards':
                return (
                    <section key={section.id} className={`${bgClass} ${paddingClass}`}>
                        <div className={`${containerClass} mx-auto px-6`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {content.items.map((item: any, i: number) => {
                                    const Icon = (Lucide as any)[item.icon] || Lucide.Star;
                                    return (
                                        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-cafh-indigo mb-6 group-hover:scale-110 transition-transform">
                                                <Icon size={28} strokeWidth={1.5} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-4">{item.title}</h3>
                                            <p className="text-slate-500 leading-relaxed">{item.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                );
            case 'CTA':
                return (
                    <section key={section.id} className={`${bgClass} ${paddingClass}`}>
                        <div className={`${containerClass} mx-auto px-6`}>
                            <div className="bg-cafh-indigo rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cafh-cyan/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                <div className="relative z-10">
                                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">{content.title}</h2>
                                    <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">{content.text}</p>
                                    <button onClick={() => navigate(content.buttonLink)} className="px-10 py-5 bg-cafh-cyan text-cafh-indigo rounded-2xl font-bold hover:bg-white transition-all shadow-xl shadow-cafh-cyan/20">
                                        {content.buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            case 'IconGrid':
                return (
                    <section key={section.id} className={`${bgClass} ${paddingClass}`}>
                        <div className={`${containerClass} mx-auto px-6`}>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {content.items.map((item: any, i: number) => {
                                    const Icon = (Lucide as any)[item.icon] || Lucide.HelpCircle;
                                    return (
                                        <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-slate-50 shadow-sm hover:shadow-md transition-all">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-cafh-indigo mb-3">
                                                <Icon size={24} strokeWidth={1.5} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{item.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                );
            case 'Gallery':
                return (
                    <section key={section.id} className={`${bgClass} ${paddingClass}`}>
                        <div className={`${containerClass} mx-auto px-6`}>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {content.images.map((img: string, i: number) => (
                                    <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            case 'Video':
                return (
                    <section key={section.id} className={`${bgClass} ${paddingClass}`}>
                        <div className={`${containerClass} mx-auto px-6`}>
                            {content.title && <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">{content.title}</h3>}
                            <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${content.videoId}`}
                                    title={content.title || "Video"}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </section>
                );
            case 'Accordion':
                return (
                    <section key={section.id} className={`${bgClass} ${paddingClass}`}>
                        <div className={`${containerClass} mx-auto px-6`}>
                            <div className="space-y-4">
                                {content.items.map((item: any, i: number) => (
                                    <details key={i} className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                            <span className="font-bold text-slate-800">{item.title}</span>
                                            <ChevronDown size={20} className="text-slate-400 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                                            {item.content}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'ResourcesGrid':
                return <DynamicResourcesGrid key={section.id} section={section} bgClass={bgClass} paddingClass={paddingClass} containerClass={containerClass} />;
            case 'EventsCalendar':
                return <DynamicEventsCalendar key={section.id} section={section} bgClass={bgClass} paddingClass={paddingClass} containerClass={containerClass} />;
            case 'Timeline':
                return <DynamicTimeline key={section.id} section={section} bgClass={bgClass} paddingClass={paddingClass} containerClass={containerClass} />;
            case 'MethodPillars':
                return <DynamicMethodPillars key={section.id} section={section} bgClass={bgClass} paddingClass={paddingClass} containerClass={containerClass} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full bg-slate-50">
            {page.sections.sort((a, b) => a.order - b.order).map(section => renderPageSection(section))}
        </div>
    );
};

// --- LOGIN VIEW ---
export const LoginView: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Simulate network delay
        setTimeout(() => {
            const user = db.auth.login(email, password);
            setIsLoading(false);

            if (user) {
                if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
                    navigate('/admin');
                } else {
                    navigate('/member/dashboard');
                }
            } else {
                setError('Credenciales inválidas. Intente nuevamente.');
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">
            {/* Background Decor */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-cafh-cyan/20 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cafh-indigo/10 rounded-full blur-[120px]"></div>

            <div className="relative z-10 bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white max-w-md w-full animate-fade-in-up">

                <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-slate-400 hover:text-cafh-indigo transition-colors">
                    <ArrowLeft size={24} />
                </button>

                <div className="text-center mb-10 mt-6">
                    <div className="w-20 h-20 bg-cafh-indigo text-white rounded-[2rem] flex items-center justify-center text-4xl font-display mx-auto mb-6 shadow-lg shadow-cafh-indigo/30 rotate-3">
                        C
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-800">Bienvenido</h2>
                    <p className="text-slate-500 mt-2">Ingresa a tu espacio personal</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium border border-red-100">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cafh-cyan focus:ring-2 focus:ring-cafh-cyan/20 transition-all font-medium text-slate-700"
                                placeholder="nombre@ejemplo.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cafh-cyan focus:ring-2 focus:ring-cafh-cyan/20 transition-all font-medium text-slate-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <a href="#" className="text-sm font-bold text-cafh-indigo hover:underline">¿Olvidaste tu contraseña?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-cafh-indigo text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl shadow-cafh-indigo/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        ¿No tienes una cuenta? <a href="#" className="font-bold text-cafh-cyan hover:underline">Regístrate</a>
                    </p>
                </div>

                {/* DEV HINTS */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center space-y-1">
                    <p className="font-bold uppercase tracking-widest text-slate-300">Credenciales Demo:</p>
                    <p>Admin: <span className="font-mono bg-slate-100 px-1 rounded">admin@cafh.cl</span> / <span className="font-mono bg-slate-100 px-1 rounded">admin123</span></p>
                    <p>Miembro: <span className="font-mono bg-slate-100 px-1 rounded">miembro@cafh.cl</span> / <span className="font-mono bg-slate-100 px-1 rounded">miembro123</span></p>
                </div>
            </div>
        </div>
    );
};

// --- MODAL COMPONENTS ---

const VideoModal: React.FC<{ isOpen: boolean; onClose: () => void; videoId: string }> = ({ isOpen, onClose, videoId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 p-2 rounded-full z-10 transition-colors"
                >
                    <X size={24} />
                </button>
                <div className="aspect-video">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title="Video Institucional"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

// --- WIZARD MODAL (CONNECTED TO REAL DATA) ---

// Helper: convierte WizardQuestion (admin) a formato compatible con WizardStep (fallback)
const getWizardQuestions = (): WizardQuestion[] | null => {
    try {
        const raw = localStorage.getItem('cafh_journey_questions_v1');
        if (!raw) return null;
        const parsed: WizardQuestion[] = JSON.parse(raw);
        const active = parsed.filter(q => q.isActive).sort((a, b) => a.order - b.order);
        return active.length > 0 ? active : null;
    } catch { return null; }
};

const getProfiles = (): ProfileType[] => {
    try {
        const raw = localStorage.getItem('cafh_journey_profiles_v1');
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

// Calculates dominant profile from answers
const calculateProfile = (
    selections: Record<number, string>,
    adminQuestions: WizardQuestion[] | null
): { profile: ProfileType | null; allTags: string[] } => {
    const profiles = getProfiles();
    let allTags: string[] = [];

    if (adminQuestions && adminQuestions.length > 0) {
        // Use real admin questions with profileTags
        allTags = Object.entries(selections).flatMap(([stepIdx, optionValue]) => {
            const question = adminQuestions[Number(stepIdx)];
            if (!question) return [];
            const option = question.options.find(o => o.value === optionValue);
            return option?.profileTags || [];
        });
    } else {
        // Use MOCK_WIZARD_STEPS fallback with relatedTags
        allTags = Object.entries(selections).flatMap(([stepIdx, optionValue]) => {
            const step = MOCK_WIZARD_STEPS[Number(stepIdx)];
            if (!step) return [];
            const option = step.options.find(o => o.value === optionValue);
            return option?.relatedTags || [];
        });
    }

    if (profiles.length === 0) return { profile: null, allTags };

    const scored = profiles.map(p => ({
        ...p,
        score: p.contentTags.filter(t => allTags.includes(t)).length
    }));
    scored.sort((a, b) => b.score - a.score);
    return { profile: scored[0] || null, allTags };
};

const WizardModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    // Load real questions once on mount
    const [adminQuestions] = useState<WizardQuestion[] | null>(() => getWizardQuestions());

    // Determine which question list to use
    const totalSteps = adminQuestions ? adminQuestions.length : MOCK_WIZARD_STEPS.length;

    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState<Record<number, string>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [assignedProfile, setAssignedProfile] = useState<ProfileType | null>(null);
    const [derivedTags, setDerivedTags] = useState<string[]>([]);

    // Registration form state
    const [showRegForm, setShowRegForm] = useState(false);
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPass, setRegPass] = useState('');
    const [regError, setRegError] = useState<string | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);

    // Reset on close/reopen
    useEffect(() => {
        if (!isOpen) {
            setStep(0);
            setSelections({});
            setIsAnalyzing(false);
            setShowResults(false);
            setShowRegForm(false);
            setRegName('');
            setRegEmail('');
            setRegPass('');
            setRegError(null);
            setAssignedProfile(null);
            setDerivedTags([]);
        }
    }, [isOpen]);

    // Get current question text
    const getCurrentQuestion = (): { question: string; options: { label: string; value: string }[] } => {
        if (adminQuestions && adminQuestions[step]) {
            const q = adminQuestions[step];
            return {
                question: q.question,
                options: q.options.map(o => ({ label: o.label, value: o.value }))
            };
        }
        const mock = MOCK_WIZARD_STEPS[step];
        return {
            question: mock?.question || '',
            options: mock?.options.map(o => ({ label: o.label, value: o.value })) || []
        };
    };

    const handleSelect = (optionValue: string) => {
        const newSelections = { ...selections, [step]: optionValue };
        setSelections(newSelections);

        if (step < totalSteps - 1) {
            setStep(step + 1);
        } else {
            // All questions answered — calculate profile
            setIsAnalyzing(true);
            setTimeout(() => {
                const { profile, allTags } = calculateProfile(newSelections, adminQuestions);
                setAssignedProfile(profile);
                setDerivedTags(allTags);
                setIsAnalyzing(false);
                setShowResults(true);
            }, 2000);
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setRegError(null);

        if (!regName.trim() || !regEmail.trim() || regPass.length < 6) {
            setRegError('Completa todos los campos. La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setIsRegistering(true);

        setTimeout(() => {
            try {
                // 1. Create the user session (simulate registration)
                const userId = `u_${Date.now()}`;
                const newUser = {
                    id: userId,
                    name: regName.trim(),
                    email: regEmail.trim().toLowerCase(),
                    role: 'MEMBER' as any,
                    avatarUrl: '',
                    tenantId: 't_santiago_01',
                    interests: derivedTags,
                    joinedDate: new Date().toISOString().split('T')[0]
                };

                // 2. Save session
                localStorage.setItem('cafh_user_session_v1', JSON.stringify(newUser));

                // 3. Save UserWizardProfile
                const wizardProfile: UserWizardProfile = {
                    userId,
                    profileTypeId: assignedProfile?.id || 'default',
                    profileTypeName: assignedProfile?.name || 'Viajero',
                    wizardAnswers: Object.fromEntries(
                        Object.entries(selections).map(([k, v]) => [
                            adminQuestions ? (adminQuestions[Number(k)]?.id || k) : String(k),
                            v
                        ])
                    ),
                    derivedTags,
                    completedAt: new Date().toISOString()
                };
                const existingProfiles: UserWizardProfile[] = JSON.parse(
                    localStorage.getItem('cafh_user_wizard_profiles_v1') || '[]'
                );
                existingProfiles.push(wizardProfile);
                localStorage.setItem('cafh_user_wizard_profiles_v1', JSON.stringify(existingProfiles));

                // 4. Create CRM contact with profile tags
                const crmTags = [
                    'wizard_registration',
                    ...(assignedProfile ? [assignedProfile.crmTag] : []),
                    ...derivedTags
                ].filter(Boolean);

                db.crm.add({
                    name: regName.trim(),
                    email: regEmail.trim().toLowerCase(),
                    phone: '',
                    role: 'Member',
                    status: 'Subscribed',
                    lastContact: new Date().toISOString().split('T')[0],
                    tags: crmTags,
                    notes: `Registrado vía wizard. Perfil: ${assignedProfile?.name || 'Sin perfil'}`,
                    createdAt: new Date().toISOString().split('T')[0],
                    ...(assignedProfile?.crmListId ? { listIds: [assignedProfile.crmListId] } : {})
                });

                // 5. Redirect to dashboard
                navigate('/member/dashboard');
                onClose();
            } catch (err) {
                setRegError('Ocurrió un error al crear tu cuenta. Inténtalo de nuevo.');
                setIsRegistering(false);
            }
        }, 800);
    };

    if (!isOpen) return null;

    const currentQ = getCurrentQuestion();

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-cafh-indigo/90 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-fade-in-up overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 transition-colors z-10"
                >
                    <X size={24} />
                </button>

                {/* State 1: Analyzing */}
                {isAnalyzing && (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="w-20 h-20 bg-cafh-light rounded-full flex items-center justify-center mb-6 relative">
                            <Sparkles className="text-cafh-cyan w-10 h-10 absolute animate-pulse" />
                            <Loader2 className="w-20 h-20 text-cafh-indigo animate-spin absolute opacity-30" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-cafh-indigo mb-2">Diseñando tu viaje...</h3>
                        <p className="text-slate-500">Analizando tus respuestas para encontrar tu perfil ideal.</p>
                    </div>
                )}

                {/* State 2: Results + Register Form */}
                {!isAnalyzing && showResults && (
                    <div>
                        {!showRegForm ? (
                            // 2a: Profile reveal
                            <div className="text-center">
                                {assignedProfile ? (
                                    <>
                                        <div
                                            className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg"
                                            style={{ backgroundColor: assignedProfile.color + '22', border: `2px solid ${assignedProfile.color}` }}
                                        >
                                            {assignedProfile.emoji}
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest mb-1 block" style={{ color: assignedProfile.color }}>
                                            Tu perfil
                                        </span>
                                        <h3 className="text-3xl font-display font-bold text-slate-800 mb-3">
                                            {assignedProfile.name}
                                        </h3>
                                        <p className="text-slate-500 mb-6 leading-relaxed">
                                            {assignedProfile.description}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Check size={32} />
                                        </div>
                                        <h3 className="text-3xl font-display font-bold text-slate-800 mb-3">¡Tu camino está listo!</h3>
                                        <p className="text-slate-500 mb-6 leading-relaxed">
                                            Hemos preparado una experiencia personalizada basada en tus respuestas.
                                        </p>
                                    </>
                                )}

                                {/* Kit Items */}
                                {assignedProfile && assignedProfile.kitItems.length > 0 && (
                                    <div className="bg-cafh-light p-6 rounded-2xl mb-6 border border-slate-100 text-left">
                                        <span className="text-xs font-bold text-cafh-indigo uppercase tracking-widest mb-3 block">Tu Kit Inicial Incluye:</span>
                                        <ul className="space-y-2">
                                            {assignedProfile.kitItems.slice(0, 4).map(item => (
                                                <li key={item.id} className="flex items-start gap-2 text-sm text-slate-700">
                                                    <Check size={14} className="text-cafh-cyan mt-0.5 shrink-0" />
                                                    <span><strong>{item.type}</strong>: {item.title}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {!assignedProfile && (
                                    <div className="bg-cafh-light p-6 rounded-2xl mb-6 border border-slate-100 text-left">
                                        <span className="text-xs font-bold text-cafh-indigo uppercase tracking-widest mb-2 block">Tu Kit Inicial Incluye:</span>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={14} className="text-cafh-cyan" /> Guía PDF: "Primeros Pasos"</li>
                                            <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={14} className="text-cafh-cyan" /> 3 Meditaciones guiadas (Audio)</li>
                                            <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={14} className="text-cafh-cyan" /> Acceso a Calendario de Eventos</li>
                                        </ul>
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowRegForm(true)}
                                    className="w-full bg-cafh-indigo text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl shadow-cafh-indigo/20"
                                >
                                    Crear mi cuenta gratuita para acceder
                                </button>
                                <p className="text-xs text-slate-400 mt-3">¿Ya tienes cuenta? <button onClick={() => navigate('/login')} className="text-cafh-indigo font-bold hover:underline">Inicia sesión</button></p>
                            </div>
                        ) : (
                            // 2b: Registration form
                            <div>
                                <button onClick={() => setShowRegForm(false)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 text-sm font-medium transition-colors">
                                    <ChevronRight size={16} className="rotate-180" /> Volver
                                </button>
                                <h3 className="text-2xl font-display font-bold text-slate-800 mb-1">Crea tu cuenta</h3>
                                {assignedProfile && (
                                    <p className="text-sm text-slate-500 mb-6">
                                        Perfil asignado: <span className="font-bold" style={{ color: assignedProfile.color }}>{assignedProfile.emoji} {assignedProfile.name}</span>
                                    </p>
                                )}

                                {regError && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-5 flex items-center gap-3 text-sm font-medium border border-red-100">
                                        <AlertCircle size={16} />
                                        {regError}
                                    </div>
                                )}

                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Nombre completo</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                value={regName}
                                                onChange={e => setRegName(e.target.value)}
                                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cafh-cyan focus:ring-2 focus:ring-cafh-cyan/20 transition-all font-medium text-slate-700"
                                                placeholder="Tu nombre"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="email"
                                                value={regEmail}
                                                onChange={e => setRegEmail(e.target.value)}
                                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cafh-cyan focus:ring-2 focus:ring-cafh-cyan/20 transition-all font-medium text-slate-700"
                                                placeholder="tu@email.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Contraseña</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="password"
                                                value={regPass}
                                                onChange={e => setRegPass(e.target.value)}
                                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cafh-cyan focus:ring-2 focus:ring-cafh-cyan/20 transition-all font-medium text-slate-700"
                                                placeholder="Mínimo 6 caracteres"
                                                minLength={6}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isRegistering}
                                        className="w-full bg-cafh-indigo text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl shadow-cafh-indigo/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isRegistering ? <Loader2 size={22} className="animate-spin" /> : 'Acceder a mi espacio personalizado'}
                                    </button>
                                </form>
                                <p className="text-xs text-slate-400 text-center mt-4">Al registrarte aceptas los términos y condiciones de Cafh.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* State 3: Questions */}
                {!isAnalyzing && !showResults && (
                    <>
                        <div className="mb-8">
                            <span className="text-xs font-bold text-cafh-cyan uppercase tracking-widest">Paso {step + 1} de {totalSteps}</span>
                            <div className="w-full h-2 bg-slate-100 rounded-full mt-2">
                                <div
                                    className="h-full bg-cafh-cyan rounded-full transition-all duration-500"
                                    style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <h3 className="text-2xl md:text-4xl font-display font-bold text-slate-800 mb-8">
                            {currentQ.question}
                        </h3>

                        <div className="space-y-3">
                            {currentQ.options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className="w-full text-left p-5 rounded-xl border border-slate-200 hover:border-cafh-cyan hover:bg-cafh-light transition-all duration-200 flex items-center justify-between group"
                                >
                                    <span className="font-medium text-slate-700 group-hover:text-cafh-indigo text-lg">{option.label}</span>
                                    <ChevronRight size={20} className="text-slate-300 group-hover:text-cafh-cyan opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


// --- HOME VIEW ---

export const HomeView: React.FC = () => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    // Manageable States
    const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

    // Internal UI States
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const [blogIndex, setBlogIndex] = useState(0);
    const [isBlogPaused, setIsBlogPaused] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);
    const blogIntervalRef = useRef<any>(null);
    const navigate = useNavigate();

    // 1. Fetch Manageable Config from DB
    useEffect(() => {
        const config = db.cms.getHomeConfig();
        setHomeConfig(config);

        let posts = db.blog.getAll();
        if (posts.length === 0) {
            db.init();
            posts = db.blog.getAll();
        }
        setBlogPosts(posts);
    }, []);

    // 2. Hero Slideshow Logic
    useEffect(() => {
        if (!homeConfig || homeConfig.hero.backgrounds.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentBgIndex((prev) => (prev + 1) % homeConfig.hero.backgrounds.length);
        }, homeConfig.hero.sliderSpeed || 7000);
        return () => clearInterval(interval);
    }, [homeConfig]);

    // 3. Responsive Visible Count for Blog
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setVisibleCount(1);
            else if (window.innerWidth < 1024) setVisibleCount(2);
            else setVisibleCount(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 4. Blog Carousel Logic (Auto-Scroll)
    useEffect(() => {
        if (!homeConfig || !homeConfig.blogSection.autoPlay || isBlogPaused || blogPosts.length === 0) return;

        blogIntervalRef.current = setInterval(() => {
            setBlogIndex((prev) => (prev + 1) % blogPosts.length);
        }, homeConfig.blogSection.autoPlaySpeed);

        return () => {
            if (blogIntervalRef.current) clearInterval(blogIntervalRef.current);
        };
    }, [homeConfig, isBlogPaused, blogPosts.length]);

    const getVisibleBlogPosts = () => {
        if (blogPosts.length === 0) return [];
        const visible = [];
        for (let i = 0; i < visibleCount; i++) {
            const index = (blogIndex + i) % blogPosts.length;
            visible.push(blogPosts[index]);
        }
        return visible;
    };

    const handleBlogNext = () => setBlogIndex((prev) => (prev + 1) % blogPosts.length);
    const handleBlogPrev = () => setBlogIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);

    if (!homeConfig) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin text-cafh-indigo" /></div>;

    const visiblePosts = getVisibleBlogPosts();

    // Render Components based on Section Order
    const renderSection = (sectionId: string) => {
        switch (sectionId) {
            case 'hero':
                return (
                    <section key="hero" className="relative min-h-[90vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden pt-24 md:pt-20">
                        <div className="absolute top-0 inset-x-0 h-[80vh] md:h-[90vh] bg-cafh-indigo rounded-b-[3rem] md:rounded-b-[5rem] overflow-hidden z-0 shadow-2xl">
                            {homeConfig.hero.backgrounds.map((media, index) => (
                                <div
                                    key={media.id}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    {media.type === 'video' ? (
                                        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                                            <source src={media.url} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img src={media.url} alt="Background" className="w-full h-full object-cover mix-blend-soft-light" referrerPolicy="no-referrer" />
                                    )}
                                </div>
                            ))}
                            <div className="absolute inset-0 bg-gradient-to-t from-cafh-indigo via-transparent to-cafh-indigo/30 z-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cafh-indigo/60 z-10"></div>
                        </div>

                        <div className={`relative z-30 max-w-5xl px-4 md:px-6 flex flex-col ${homeConfig.hero.textAlignment === 'center' ? 'items-center text-center' :
                                homeConfig.hero.textAlignment === 'right' ? 'items-end text-right' : 'items-start text-left'
                            }`}>
                            <div className="mb-6 md:mb-8 p-1 pr-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 animate-fade-in-up flex items-center gap-3">
                                <div className="bg-cafh-cyan rounded-full p-2 text-cafh-indigo"><Sparkles size={16} /></div>
                                <span className="text-white text-sm font-medium tracking-wide">Bienvenido a Cafh</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-bold text-white mb-6 md:mb-8 leading-[1.05] tracking-tight animate-fade-in-up drop-shadow-lg">
                                {homeConfig.hero.title} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cafh-cyan to-white italic">
                                    {homeConfig.hero.highlightWord}
                                </span>
                            </h1>

                            <p className="text-lg md:text-2xl text-blue-50/90 mb-10 md:mb-14 max-w-md md:max-w-2xl font-light leading-relaxed animate-fade-in-up">
                                {homeConfig.hero.subtitle}
                            </p>

                            <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-5 animate-fade-in-up">
                                <button
                                    onClick={() => {
                                        const link = homeConfig.hero.ctaLink;
                                        // Open wizard modal for journey-related routes
                                        if (link === '/metodo' || link === '#wizard' || link === '/wizard') {
                                            setIsWizardOpen(true);
                                        } else {
                                            navigate(link);
                                        }
                                    }}
                                    className="bg-cafh-cyan text-cafh-indigo px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(111,207,235,0.4)] flex items-center justify-center gap-3 w-full sm:w-auto group"
                                >
                                    <span>{homeConfig.hero.ctaText}</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={() => setIsVideoModalOpen(true)}
                                    className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-semibold text-base md:text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white text-cafh-indigo flex items-center justify-center">
                                        <Play size={12} fill="currentColor" />
                                    </div>
                                    <span>Ver Video</span>
                                </button>
                            </div>
                        </div>
                    </section>
                );
            case 'search':
                return (
                    <section key="search" className="py-20 md:py-32 -mt-20 md:-mt-24 relative z-40 px-4 md:px-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-12">
                                <p className="text-cafh-indigo/60 font-bold uppercase tracking-widest text-sm mb-2">{homeConfig.searchSubtitle}</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {homeConfig.searchItems.map((item, idx) => {
                                    const IconComponent = (Lucide as any)[item.icon] || Lucide.HelpCircle;
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => navigate(item.path)}
                                            className="group bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center hover:bg-white/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl shadow-cafh-indigo/5"
                                        >
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                <IconComponent size={28} className="text-cafh-indigo" strokeWidth={1.5} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-sm md:text-base group-hover:text-cafh-indigo transition-colors">{item.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                );
            case 'threeColumns':
                return (
                    <section key="threeColumns" className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {homeConfig.threeColumns.sort((a, b) => a.order - b.order).map((col, idx) => {
                                    const IconComponent = (Lucide as any)[col.icon] || Lucide.HelpCircle;
                                    return (
                                        <div key={idx} className={`space-y-4 ${col.alignment === 'center' ? 'text-center' :
                                                col.alignment === 'right' ? 'text-right' : 'text-left'
                                            }`}>
                                            <div className={`flex ${col.alignment === 'center' ? 'justify-center' :
                                                    col.alignment === 'right' ? 'justify-end' : 'justify-start'
                                                } mb-6`}>
                                                <div className="w-16 h-16 bg-cafh-light rounded-2xl flex items-center justify-center text-cafh-indigo shadow-sm">
                                                    <IconComponent size={32} strokeWidth={1.5} />
                                                </div>
                                            </div>
                                            <h3 className="font-display text-3xl text-cafh-indigo">{col.title}</h3>
                                            <p className="text-slate-600 leading-relaxed">{col.description}</p>
                                            {col.link && (
                                                <button onClick={() => navigate(col.link!)} className="text-cafh-cyan font-bold text-sm hover:underline">
                                                    Leer más
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                );
            case 'blog':
                return (
                    <section
                        key="blog"
                        className="py-20 bg-slate-50 relative overflow-hidden"
                        onMouseEnter={() => setIsBlogPaused(true)}
                        onMouseLeave={() => setIsBlogPaused(false)}
                    >
                        <div className="max-w-7xl mx-auto px-6 mb-10 flex justify-between items-end">
                            <div>
                                <span className="text-cafh-cyan font-bold tracking-widest text-xs uppercase">{homeConfig.blogSection.sectionSubtitle}</span>
                                <h2 className="text-4xl font-display font-bold text-slate-800">{homeConfig.blogSection.sectionTitle}</h2>
                            </div>
                            <div className="hidden md:flex items-center gap-3">
                                <button onClick={handleBlogPrev} className="p-3 rounded-full border border-slate-200 hover:bg-cafh-indigo hover:text-white transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                <button onClick={handleBlogNext} className="p-3 rounded-full border border-slate-200 hover:bg-cafh-indigo hover:text-white transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="max-w-7xl mx-auto px-6 relative">
                            <div className="overflow-hidden">
                                <div className={`grid gap-6 ${visibleCount === 1 ? 'grid-cols-1' : visibleCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                    {visiblePosts.map((post) => (
                                        <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-slate-100 flex flex-col h-full mx-auto w-full max-w-sm md:max-w-none">
                                            <div className="h-48 overflow-hidden relative shrink-0">
                                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-cafh-indigo uppercase tracking-wide">
                                                    {post.category}
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <span className="text-xs text-slate-400 font-medium mb-2 block">{post.date} • {post.author}</span>
                                                <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-cafh-indigo transition-colors line-clamp-2">{post.title}</h3>
                                                <p className="text-slate-500 text-sm line-clamp-3 mb-4 leading-relaxed flex-1">{post.excerpt}</p>
                                                <span className="text-cafh-cyan font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                                                    Leer artículo <ArrowRight size={16} />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                );
            case 'activities':
                return (
                    <section key="activities" className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                                <div className="max-w-2xl">
                                    <span className="text-cafh-clay font-bold tracking-widest text-xs uppercase bg-cafh-clay/10 px-3 py-1 rounded-full">Agenda</span>
                                    <h2 className="text-4xl font-display font-bold text-slate-800 mt-4 mb-4">{homeConfig.activitiesSection.title}</h2>
                                    <p className="text-slate-600">{homeConfig.activitiesSection.subtitle}</p>
                                </div>
                                <button onClick={() => navigate('/activities')} className="px-6 py-3 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-800 hover:text-white transition-colors">
                                    Ver Calendario Completo
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {MOCK_EVENTS.slice(0, homeConfig.activitiesSection.maxEvents).map((event) => (
                                    <div key={event.id} className="bg-slate-50 rounded-[2rem] p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`p-4 rounded-2xl ${event.color} text-white text-center min-w-[70px]`}>
                                                <span className="block text-2xl font-bold">{event.day}</span>
                                                <span className="block text-[10px] font-bold tracking-widest uppercase">{event.month}</span>
                                            </div>
                                            <div className="bg-white px-3 py-1 rounded-full border border-slate-100 text-xs font-bold text-slate-500">{event.type}</div>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-cafh-indigo transition-colors min-h-[3rem]">{event.title}</h3>
                                        <div className="space-y-2 mt-4 pt-4 border-t border-slate-200/50">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"><Clock size={14} className="text-cafh-cyan" />{event.time}</div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"><MapPin size={14} className="text-cafh-cyan" />{event.location}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full bg-slate-50 selection:bg-cafh-cyan selection:text-cafh-indigo overflow-hidden">
            {homeConfig.sectionOrder.map(sectionId => renderSection(sectionId))}
            <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} videoId={homeConfig.hero.modalVideoId} />
            <WizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
        </div>
    );
};